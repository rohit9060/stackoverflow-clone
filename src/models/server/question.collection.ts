import { Permission } from "node-appwrite";
import { dbName, questionCollection } from "../name";
import { database } from "./config";

export default async function createQuestionCollection() {
  // Create a collection for questions
  await database.createCollection(
    dbName,
    questionCollection,
    questionCollection,
    [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]
  );

  // log
  console.log(`Question collection created.`);

  // create attributes
  await Promise.all([
    database.createStringAttribute(
      dbName,
      questionCollection,
      "title",
      128,
      true
    ),
    database.createStringAttribute(
      dbName,
      questionCollection,
      "content",
      10000,
      true
    ),
    database.createStringAttribute(
      dbName,
      questionCollection,
      "authorId",
      100,
      true
    ),
    database.createStringAttribute(
      dbName,
      questionCollection,
      "tags",
      100,
      true,
      undefined,
      true
    ),
    database.createStringAttribute(
      dbName,
      questionCollection,
      "attachmentId",
      100,
      false
    ),
  ]);

  // log
  console.log(`Question attributes created.`);

  // create indexes
  /* await Promise.all([
    database.createIndex(
      dbName,
      questionCollection,
      "title",
      IndexType.Fulltext,
      ["title"],
      ["asc"]
    ),
  ]);
  */

  // log
  console.log(`Question indexes created.`);
}
