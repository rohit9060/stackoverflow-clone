import {
  answerCollection,
  dbName,
  questionCollection,
  voteCollection,
} from "@/models/name";

import { database, users } from "@/models/server/config";
import { IUserPrefs } from "@/store";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    const { votedById, voteStatus, type, typeId } = await request.json();

    const response = await database.listDocuments(dbName, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]);

    if (response.documents.length > 0) {
      await database.deleteDocument(
        dbName,
        voteCollection,
        response.documents[0].$id
      );

      // Decrease the reputation of the question/answer author
      const questionOrAnswer = await database.getDocument(
        dbName,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );

      const authorPrefs = await users.getPrefs<IUserPrefs>(
        questionOrAnswer.authorId
      );

      await users.updatePrefs<IUserPrefs>(questionOrAnswer.authorId, {
        reputation:
          response.documents[0].voteStatus === "upvoted"
            ? Number(authorPrefs.reputation) - 1
            : Number(authorPrefs.reputation) + 1,
      });
    }

    // that means prev vote does not exists or voteStatus changed
    if (response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await database.createDocument(
        dbName,
        voteCollection,
        ID.unique(),
        {
          type,
          typeId,
          voteStatus,
          votedById,
        }
      );

      // Increate/Decrease the reputation of the question/answer author accordingly
      const questionOrAnswer = await database.getDocument(
        dbName,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );

      const authorPrefs = await users.getPrefs<IUserPrefs>(
        questionOrAnswer.authorId
      );

      // if vote was present
      if (response.documents[0]) {
        await users.updatePrefs<IUserPrefs>(questionOrAnswer.authorId, {
          reputation:
            // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
            response.documents[0].voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) - 1
              : Number(authorPrefs.reputation) + 1,
        });
      } else {
        await users.updatePrefs<IUserPrefs>(questionOrAnswer.authorId, {
          reputation:
            // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
            voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) + 1
              : Number(authorPrefs.reputation) - 1,
        });
      }

      const [upvotes, downvotes] = await Promise.all([
        database.listDocuments(dbName, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "upvoted"),
          Query.equal("votedById", votedById),
          Query.limit(1), // for optimization as we only need total
        ]),
        database.listDocuments(dbName, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "downvoted"),
          Query.equal("votedById", votedById),
          Query.limit(1), // for optimization as we only need total
        ]),
      ]);

      return NextResponse.json(
        {
          data: { document: doc, voteResult: upvotes.total - downvotes.total },
          message: response.documents[0] ? "Vote Status Updated" : "Voted",
        },
        {
          status: 201,
        }
      );
    }

    const [upvotes, downvotes] = await Promise.all([
      database.listDocuments(dbName, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1), // for optimization as we only need total
      ]),
      database.listDocuments(dbName, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1), // for optimization as we only need total
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          document: null,
          voteResult: upvotes.total - downvotes.total,
        },
        message: "Vote Withdrawn",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Error deleting answer" },
      { status: error?.status || error?.code || 500 }
    );
  }
}
