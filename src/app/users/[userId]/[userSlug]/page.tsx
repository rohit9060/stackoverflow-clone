import { database, users } from "@/models/server/config";
import { IUserPrefs } from "@/store";
import React from "react";
import { MagicCard, MagicContainer } from "@/components/magicui/magic-card";
import { answerCollection, dbName, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";

const Page = async ({
  params,
}: {
  params: { userId: string; userSlug: string };
}) => {
  const [user, questions, answers] = await Promise.all([
    users.get<IUserPrefs>(params.userId),
    database.listDocuments(dbName, questionCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1), // for optimization
    ]),
    database.listDocuments(dbName, answerCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1), // for optimization
    ]),
  ]);

  return (
    <MagicContainer
      className={
        "flex h-[500px] w-full flex-col gap-4 lg:h-[250px] lg:flex-row"
      }
    >
      <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
        <div className="absolute inset-x-4 top-4">
          <h2 className="text-xl font-medium">Reputation</h2>
        </div>
        <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
          <h1>{user.prefs.reputation}</h1>
        </p>
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </MagicCard>
      <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
        <div className="absolute inset-x-4 top-4">
          <h2 className="text-xl font-medium">Questions asked</h2>
        </div>
        <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
          <h1>{questions.total}</h1>
        </p>
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </MagicCard>
      <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
        <div className="absolute inset-x-4 top-4">
          <h2 className="text-xl font-medium">Answers given</h2>
        </div>
        <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
          <h1>{answers.total}</h1>
        </p>
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </MagicCard>
    </MagicContainer>
  );
};

export default Page;
