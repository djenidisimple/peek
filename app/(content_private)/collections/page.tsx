"use client";

import React, { useState, useEffect } from "react";
import { FolderPlus, Search, Folder } from "lucide-react";
import { getCollections, createCollection, addBookmarkToCollection, removeBookmarkFromCollection, getBookmarksByCollection } from "@/lib/actions/collections";
import { getBookmarks } from "@/lib/actions/bookmarks";
import BookmarkCard from "@/components/ui/BookmarkCard";
import CollectionForm from "@/components/ui/CollectionForm";

interface Collection {
  id: string;
  nom: string;
  dateCreation: string;
  userId: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await getCollections();
      setCollections(data as unknown as Collection[]);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleCreateCollection = async (nom: string) => {
    await createCollection({ nom });
    await loadCollections();
  };

  const filteredCollections = collections.filter(col =>
    col.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Collections</h1>
          <p className="text-gray-600">Organize your bookmarks into folders</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <FolderPlus size={20} />
          {showForm ? 'Hide Form' : 'New Collection'}
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {showForm && (
        <div className="mb-8">
          <CollectionForm onSubmit={handleCreateCollection} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading collections...</p>
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Folder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No collections match your search' : 'No collections yet'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:underline"
            >
              Create your first collection
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map((collection) => (
            <div key={collection.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                 onClick={() => window.location.href = `/collections/${collection.id}`}
            >
              <h3 className="font-semibold text-lg mb-2 truncate">{collection.nom}</h3>
              <p className="text-sm text-gray-600 mb-3">
                Created on {new Date(collection.dateCreation).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600 font-medium">
                  View collection →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
