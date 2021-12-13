import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { databaseClient } from "./database";
import { getGitHubUser } from "./github-adapter";
import { buildTokens, setTokens } from "./token-utils";
import { createUser, getUserByGitHubId } from "./user-service";

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());

app.get("/", (req, res) => res.send("api is running..🏃‍♂️"));

app.get("/github", async (req, res) => {
  const { code } = req.query;

  const githubUser = await getGitHubUser(code as string);
  let user = await getUserByGitHubId(githubUser.id);
  if (!user) user = await createUser(githubUser.name, githubUser.id);

  const { accessToken, refreshToken } = buildTokens(user);
  setTokens(res, accessToken, refreshToken);

  res.redirect(`${process.env.CLIENT_URL}/me`);
});
app.get("/refresh", async (req, res) => {});
app.get("/logout", async (req, res) => {});
app.get("/logout-all", async (req, res) => {});
app.get("/me", async (req, res) => {});

async function main() {
  await databaseClient.connect();
  app.listen(3001, () => console.log("listening on locahost"));
}

main();
