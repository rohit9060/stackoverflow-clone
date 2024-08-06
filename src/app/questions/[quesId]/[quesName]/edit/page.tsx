import { dbName, questionCollection } from "@/models/name";
import { database } from "@/models/server/config";
import React from "react";
import { EditQuestionForm } from "@/components";

const Page = async ({
  params,
}: {
  params: { quesId: string; quesName: string };
}) => {
  const question = await database.getDocument(
    dbName,
    questionCollection,
    params.quesId
  );

  return <EditQuestionForm question={question} />;
};

export default Page;
