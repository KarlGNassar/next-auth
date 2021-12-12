import { v4 as uuidv4 } from "uuid";

import { UserDocument } from "@shared";
import { databaseClient } from "./database";

function collection() {
  return databaseClient
    .db(process.env.MONGODB_DATABASE)
    .collection<UserDocument>("users");
}

export async function createUser(name: string, gitHubUserId: number) {
  const user: UserDocument = {
    _id: uuidv4(),
    name,
    tokenVersion: 0,
    gitHubUserId: gitHubUserId.toString(),
  };

  const coll = await collection();
  const result = await coll.insertOne(user);
  if (result.acknowledged) return user;

  throw new Error();
}

export async function getUserByGitHubId(gitHubUserId: number) {
  const coll = await collection();
  return coll.findOne({ gitHubUserId: gitHubUserId.toString() });
}
