"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type CreateCollectionInput = {
  nom: string;
};

export async function createCollection(input: CreateCollectionInput) {
  const userId = await getCurrentUserId();

  const collection = await prisma.collection.create({
    data: {
      nom: input.nom,
      userId,
    },
  });

  revalidatePath("/(content_private)/collections");

  return { success: true, collectionId: collection.id };
}

export async function getCollections() {
  const userId = await getCurrentUserId();

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { dateCreation: "desc" },
    include: {
      bookmarks: {
        include: {
          bookmark: true,
        },
      },
    },
  });

  return collections;
}

export async function addBookmarkToCollection(bookmarkId: string, collectionId: string) {
  const userId = await getCurrentUserId();

  const bookmark = await prisma.bookmark.findFirst({
    where: { id: bookmarkId, userId },
  });

  if (!bookmark) {
    throw new Error("Bookmark not found or access denied");
  }

  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
  });

  if (!collection) {
    throw new Error("Collection not found or access denied");
  }

  await prisma.bookmarkOnCollection.create({
    data: {
      bookmarkId,
      collectionId,
    },
  });

  revalidatePath("/(content_private)/collections");
  revalidatePath("/(content_private)/bookmarks");

  return { success: true };
}

export async function removeBookmarkFromCollection(bookmarkId: string, collectionId: string) {
  const userId = await getCurrentUserId();

  await prisma.bookmarkOnCollection.deleteMany({
    where: {
      bookmarkId,
      collectionId,
    },
  });

  revalidatePath("/(content_private)/collections");
  revalidatePath("/(content_private)/bookmarks");

  return { success: true };
}

export async function getBookmarksByCollection(collectionId: string) {
  const userId = await getCurrentUserId();

  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
  });

  if (!collection) {
    throw new Error("Collection not found or access denied");
  }

  const bookmarkOnCollections = await prisma.bookmarkOnCollection.findMany({
    where: { collectionId },
    include: {
      bookmark: {
        include: {
          website: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
  });

  return bookmarkOnCollections.map((rel) => rel.bookmark);
}
