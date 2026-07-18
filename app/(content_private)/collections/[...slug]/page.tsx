"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FolderOpen, Search, FolderPlus, X } from "lucide-react";
import { getBookmarksByCollection, getCollections, addBookmarkToCollection, removeBookmarkFromCollection } from "@/lib/actions/collections";
import { getBookmarks, toggleFavorite } from "@/lib/actions/bookmarks";
import BookmarkCard from "@/components/ui/BookmarkCard";

interface BookmarkWithTags {
  id: string;
  website: {
    id: string;
    url: string;
    titre: string;
    description?: string;
    screenshotUrl?: string;
    resumerIa?: string;
    isAnalyzed: boolean;
  };
  userId: string;
  createdAt: string;
  favori: boolean;
  notePersonnel?: string;
  tags: Array<{ tag: { id: string; nom: string } }>;
}

interface Collection {
  id: string;
  nom: string;
}

export default function CollectionPage() {
  const params = useParams();
  const collectionId = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [bookmarks, setBookmarks] = useState<BookmarkWithTags[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [collectionName, setCollectionName] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [collectionBookmarks, collectionsData] = await Promise.all([
        getBookmarksByCollection(collectionId),
        getCollections()
      ]);
      setBookmarks(collectionBookmarks as unknown as BookmarkWithTags[]);
      setCollections(collectionsData as unknown as Collection[]);

      const currentCollection = collectionsData.find(c => c.id === collectionId);
      if (currentCollection) {
        setCollectionName(currentCollection.nom);
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (collectionId) {
      loadData();
    }
  }, [collectionId]);

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.website.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFavorite = async (bookmarkId: string) => {
    await toggleFavorite(bookmarkId);
    loadData();
  };

  const handleAddToCollection = async (bookmarkId: string, adding: boolean, targetCollectionId?: string) => {
    if (adding && targetCollectionId) {
      await addBookmarkToCollection(bookmarkId, targetCollectionId);
    } else {
      await removeBookmarkFromCollection(bookmarkId, collectionId);
    }
    loadData();
  };

  if (!collectionId) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Invalid collection ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <FolderOpen className="text-blue-600" size={32} />
          {collectionName || 'Collection'}
        </h1>
        <p className="text-gray-600">
          {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''} in this collection
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading bookmarks...</p>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Folder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No bookmarks match your search' : 'No bookmarks in this collection'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="relative">
              <button
                onClick={() => handleAddToCollection(bookmark.id, false)}
                className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                title="Remove from collection"
              >
                <X size={16} className="text-gray-600" />
              </button>
              <BookmarkCard
                bookmark={bookmark as unknown as any}
                onToggleFavorite={handleToggleFavorite}
                onCollectionChange={handleAddToCollection}
                collections={collections}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
