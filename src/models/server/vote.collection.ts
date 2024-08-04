import { Permission } from "node-appwrite";
import { dbName, voteCollection } from "../name";
import { database } from "./config";

export default async function createVoteCollection() {
  // Creating Collection
  await database.createCollection(dbName, voteCollection, voteCollection, [
    Permission.create("users"),
    Permission.read("any"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Vote Collection Created");

  // Creating Attributes
  await Promise.all([
    database.createEnumAttribute(
      dbName,
      voteCollection,
      "type",
      ["question", "answer"],
      true
    ),
    database.createStringAttribute(dbName, voteCollection, "typeId", 50, true),
    database.createEnumAttribute(
      dbName,
      voteCollection,
      "voteStatus",
      ["upvoted", "downvoted"],
      true
    ),
    database.createStringAttribute(
      dbName,
      voteCollection,
      "votedById",
      50,
      true
    ),
  ]);
  console.log("Vote Attributes Created");
}
