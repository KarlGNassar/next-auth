import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";

import {
  AccessTokenPayload,
  Cookies,
  RefreshTokenPayload,
  UserDocument,
} from "@shared";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

enum TokenExpiration {
  Access = 5 * 60,
  Refresh = 7 * 24 * 60 * 60,
}

function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: TokenExpiration.Access,
  });
}

function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: TokenExpiration.Refresh,
  });
}

export function buildTokens(user: UserDocument) {
  const accessPayload: AccessTokenPayload = { userId: user._id };
  const refreshPayload: RefreshTokenPayload = {
    userId: user._id,
    version: user.tokenVersion,
  };

  const accessToken = signAccessToken(accessPayload);
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

  return { accessToken, refreshToken };
}

const isProduction = process.env.NODE_ENV === "production";

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  domain: process.env.BASE_DOMAIN,
  path: "/",
};

const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Access * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Refresh * 1000,
};

export function setTokens(res: Response, access: string, refresh?: string) {
  res.cookie(Cookies.AccessToken, access, accessTokenCookieOptions);
  if (refresh)
    res.cookie(Cookies.RefreshToken, refresh, refreshTokenCookieOptions);
}
