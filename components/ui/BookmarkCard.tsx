"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Bookmark, Website, Tag } from "@/app/generated/prisma/models";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onToggleFavorite?: (bookmarkId: string) => void;
  onCollectionChange?: (bookmarkId: string, adding: boolean, collectionId?: string) => void;
  collections?: Array<{ id: string; nom: string; }>;
}

export default function BookmarkCard({ bookmark, onToggleFavorite, onCollectionChange, collections = [] }: BookmarkCardProps) {
  const { website, favori, notePersonnel, tags } = bookmark;
  const [isFavorite, setIsFavorite] = useState(favori);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(bookmark.id);
  };

  const actualTags = tags?.map((tag) => typeof tag === 'string' ? tag : tag.tag?.nom).filter(Boolean) || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {website?.screenshotUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={website.screenshotUrl}
            alt={website.titre}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {website?.titre}
          </h3>
          <button
            onClick={handleFavoriteToggle}
            className={`p-1 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-600`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {website?.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {website.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {actualTags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          {collections.length > 0 && onCollectionChange && (
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onCollectionChange(bookmark.id, true, e.target.value);
                  }
                }}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Add to collection...</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          <input
            type="text"
            placeholder="User note..."
            defaultValue={notePersonnel || ''}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
}
