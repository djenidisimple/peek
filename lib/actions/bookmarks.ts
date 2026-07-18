"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type CreateBookmarkInput = {
  url: string;
  titre: string;
  description?: string;
  screenshotUrl?: string;
};

export async function createBookmark(input: CreateBookmarkInput) {
  const userId = await getCurrentUserId();

  const website = await prisma.website.create({
    data: {
      url: input.url,
      titre: input.titre,
      description: input.description,
      screenshotUrl: input.screenshotUrl,
      isAnalyzed: false,
    },
  });

  await prisma.bookmark.create({
    data: {
      websiteId: website.id,
      userId: userId,
      favori: false,
    },
  });

  revalidatePath("/(content_private)/bookmarks");
  revalidatePath("/(content_private)/collections");

  return { success: true, websiteId: website.id };
}

export async function getBookmarks(filters?: {
  search?: string;
  onlyFavorites?: boolean;
  collectionId?: string;
}) {
  const userId = await getCurrentUserId();

  const where: any = { userId };

  if (filters?.onlyFavorites) {
    where.favori = true;
  }

  if (filters?.search) {
    where.website = {
      titre: { contains: filters.search, mode: "insensitive" },
    };
  }

  if (filters?.collectionId) {
    where.collections = { some: { collectionId: filters.collectionId } };
  }

  const bookmarks = await prisma.bookmark.findMany({
    where,
    include: {
      website: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookmarks.map((bookmark) => {
    const website = bookmark.website;
    const typedBookmark: any = {
      ...bookmark,
      website: website || {
        id: website?.id || '',
        titre: website?.titre || '',
        url: website?.url || '',
        description: website?.description || '',
        screenshotUrl: website?.screenshotUrl || '',
        resumerIa: website?.resumerIa || '',
        isAnalyzed: website?.isAnalyzed || false,
      }
    };
    return typedBookmark as any;
  });
}

export async function toggleFavorite(bookmarkId: string) {
  const userId = await getCurrentUserId();

  const bookmark = await prisma.bookmark.findFirst({
    where: { id: bookmarkId, userId },
  });

  if (!bookmark) {
    throw new Error("Bookmark not found or access denied");
  }

  await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: { favori: !bookmark.favori },
  });

  revalidatePath("/(content_private)/bookmarks");
  revalidatePath("/(content_private)/collections");

  return { success: true };
}
