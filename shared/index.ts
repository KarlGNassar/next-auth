export interface UserDocument {
  _id: string;
  name: string;
  tokenVersion: number;
  gitHubUserId: string;
}

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  version: number;
}

export enum Cookies {
  AccessToken = "access",
  RefreshToken = "refresh",
}

export interface AccessToken extends AccessTokenPayload {
  exp: number;
}

export interface RefreshToken extends RefreshTokenPayload {
  exp: number;
}
