import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());

app.get("/", (req, res) => res.send("api is running..🏃‍♂️"));

app.get("/github", async (req, res) => {
  const { code } = req.query;

  //   const githubUser = await getGitHubUser(code as string);
});
app.get("/refresh", async (req, res) => {});
app.get("/logout", async (req, res) => {});
app.get("/logout-all", async (req, res) => {});
app.get("/me", async (req, res) => {});

app.listen(5000);
