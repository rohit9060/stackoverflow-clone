import { QuestionCard } from "@/components/QuestionCard";
import {
  answerCollection,
  dbName,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { database, users } from "@/models/server/config";
import { IUserPrefs } from "@/store";
import { Query } from "node-appwrite";
import React from "react";

const LatestQuestions = async () => {
  const questions = await database.listDocuments(dbName, questionCollection, [
    Query.limit(5),
    Query.orderDesc("$createdAt"),
  ]);
  console.log("Fetched Questions:", questions);

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
      const [author, answers, votes] = await Promise.all([
        users.get<IUserPrefs>(ques.authorId),
        database.listDocuments(dbName, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1), // for optimization
        ]),
        database.listDocuments(dbName, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.limit(1), // for optimization
        ]),
      ]);

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
        },
      };
    })
  );

  console.log("Latest question");
  console.log(questions);
  return (
    <div className="space-y-6">
      {questions.documents.map((question) => (
        <QuestionCard key={question.$id} ques={question} />
      ))}
    </div>
  );
};

export default LatestQuestions;
