import { Permission } from "node-appwrite";
import { answerCollection, dbName } from "../name";
import { database } from "./config";

export default async function createAnswerCollection() {
  // Creating Collection
  await database.createCollection(dbName, answerCollection, answerCollection, [
    Permission.create("users"),
    Permission.read("any"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Answer Collection Created");

  // Creating Attributes
  await Promise.all([
    database.createStringAttribute(
      dbName,
      answerCollection,
      "content",
      10000,
      true
    ),
    database.createStringAttribute(
      dbName,
      answerCollection,
      "questionId",
      50,
      true
    ),
    database.createStringAttribute(
      dbName,
      answerCollection,
      "authorId",
      50,
      true
    ),
  ]);
  console.log("Answer Attributes Created");
}
