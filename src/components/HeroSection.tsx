import React from "react";
import { HeroParallax } from "@/components/ui/";
import { database } from "@/models/server/config";
import {
  dbName,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Query } from "node-appwrite";
import { slugify } from "@/lib";
import { storage } from "@/models/client/config";
import { HeroSectionHeader } from "./HeroSectionHeader";

export default async function HeroSection() {
  const questions = await database.listDocuments(dbName, questionCollection, [
    Query.orderDesc("$createdAt"),
    Query.limit(15),
  ]);

  return (
    <HeroParallax
      header={<HeroSectionHeader />}
      products={questions.documents.map((q) => ({
        title: q.title,
        link: `/questions/${q.$id}/${slugify(q.title)}`,
        thumbnail: storage.getFilePreview(
          questionAttachmentBucket,
          q.attachmentId
        ).href,
      }))}
    />
  );
}
