"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { getBookmarks } from "@/lib/actions/bookmarks";
import { Bookmark } from "@/app/generated/prisma/models";
import BookmarkCard from "@/components/ui/BookmarkCard";
import AddBookmarkForm from "@/components/ui/AddBookmarkForm";

async function loadBookmarks(search: string): Promise<Bookmark[]> {
  return await getBookmarks({ search });
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSearch = async (value: string) => {
    setSearch(value);
    setLoading(true);
    const results = await loadBookmarks(value);
    setBookmarks(results);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Bookmarks</h1>
          <p className="text-gray-600">Manage your saved websites and links</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Hide Form' : 'Add Bookmark'}
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {showForm && (
        <div className="mb-8">
          <AddBookmarkForm />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading bookmarks...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No bookmarks found</p>
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
}
