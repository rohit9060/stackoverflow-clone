import { Permission } from "node-appwrite";
import { commentCollection, dbName } from "../name";
import { database } from "./config";

export default async function createCommentCollection() {
  // Creating Collection
  await database.createCollection(
    dbName,
    commentCollection,
    commentCollection,
    [
      Permission.create("users"),
      Permission.read("any"),
      Permission.read("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]
  );
  console.log("Comment Collection Created");

  // Creating Attributes
  await Promise.all([
    database.createStringAttribute(
      dbName,
      commentCollection,
      "content",
      10000,
      true
    ),
    database.createEnumAttribute(
      dbName,
      commentCollection,
      "type",
      ["answer", "question"],
      true
    ),
    database.createStringAttribute(
      dbName,
      commentCollection,
      "typeId",
      50,
      true
    ),
    database.createStringAttribute(
      dbName,
      commentCollection,
      "authorId",
      50,
      true
    ),
  ]);
  console.log("Comment Attributes Created");
}
