import React from "react";
import { useActionState } from "react";
import { createBookmark } from "@/lib/actions/bookmarks";

interface FormState {
  message: string;
  success: boolean;
}

export default function AddBookmarkForm() {
  const [formState, formAction, isPending] = useActionState<FormState | null, FormData>(
    async (previousState: FormState | null, formData: FormData): Promise<FormState> => {
      const url = formData.get("url") as string;
      const titre = formData.get("titre") as string;
      const description = formData.get("description") as string;
      const screenshotUrl = formData.get("screenshotUrl") as string;

      try {
        const result = await createBookmark({
          url,
          titre,
          description: description || undefined,
          screenshotUrl: screenshotUrl || undefined,
        });

        return {
          message: `Bookmark created successfully! Website ID: ${result.websiteId}`, 
          success: true,
        };
      } catch (error) {
        return {
          message: error instanceof Error ? error.message : "An error occurred",
          success: false,
        };
      }
    },
    null
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Bookmark</h2>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            URL
          </label>
          <input
            id="url"
            name="url"
            type="url"
            required
            placeholder="https://example.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="titre" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="titre"
            name="titre"
            type="text"
            required
            placeholder="Example"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Website description..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
          />
        </div>
        <div>
          <label htmlFor="screenshotUrl" className="block text-sm font-medium mb-1">
            Screenshot URL (Optional)
          </label>
          <input
            id="screenshotUrl"
            name="screenshotUrl"
            type="url"
            placeholder="https://example.com/screenshot.jpg"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        {formState?.message && (
          <div
            className={`text-sm p-3 rounded-md ${formState.success ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}
          >
            {formState.message}
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isPending ? "Adding..." : "Add Bookmark"}
        </button>
      </form>
    </div>
  );
}
