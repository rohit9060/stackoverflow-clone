import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import getOrCreateStorage from "./storageSetup";
import { database } from "./config";
import { dbName } from "../name";

export default async function getOrCreateDB() {
  try {
    await database.get(dbName);
    console.log("Database Connected");
  } catch (error) {
    try {
      await database.create(dbName, dbName);
      console.log("Database Created");
      // create collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);

      console.log("Database Connected");
    } catch (error) {
      console.error("Error creating database:", error);
    }
  }
  return database;
}
