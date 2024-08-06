import { answerCollection, dbName } from "@/models/name";
import { database, users } from "@/models/server/config";
import { type NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { IUserPrefs } from "@/store";

export async function POST(req: NextRequest) {
  try {
    const { questionId, answer, authorId } = await req.json();

    const response = await database.createDocument(
      dbName,
      answerCollection,
      ID.unique(),
      {
        questionId: questionId,
        content: answer,
        authorId: authorId,
      }
    );

    // insert user reputation
    const perfs = await users.getPrefs<IUserPrefs>(authorId);
    await users.updatePrefs(authorId, {
      reputation: Number(perfs.reputation) + 1,
    });

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "An error occurred creating the answer",
      },
      {
        status: error.status || error.code || 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { answerId } = await req.json();

    const answer = await database.getDocument(
      dbName,
      answerCollection,
      answerId
    );
    const response = await database.deleteDocument(
      dbName,
      answerCollection,
      answerId
    );

    // update user reputation
    const perfs = await users.getPrefs<IUserPrefs>(answer.authorId);
    await users.updatePrefs(answer.authorId, {
      reputation: Number(perfs.reputation) - 1,
    });

    return NextResponse.json(
      { data: response },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred deleting the answer" },
      {
        status: error.status || error.code || 500,
      }
    );
  }
}
