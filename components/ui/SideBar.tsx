import { BookmarkIcon, FolderBookmark, Heart, PanelLeft, Plus } from "lucide-react";

export default function SideBar() {
    return (
        <div className="w-70 h-full p-4 border-r border-neutral-200">
            <div className="w-full flex items-center justify-between -mt-4 mb-6 border-b border-neutral-200 px-4 py-4">
                <h2 className="text-xl font-bold">Peek</h2>
                <button type="button" className="bg-transparent color-[#393B3D]">
                    <PanelLeft className="w-5 h-5"/>
                </button>
            </div>
            <ul className="space-y-3">
                <li>
                    <a href="/bookmarks" 
                        className="
                            hover:underline w-full py-2.5 px-4 rounded-md
                            bg-[#3B82F6] text-white decoration-0
                            flex items-center
                        "
                    >
                        <BookmarkIcon className="inline-block w-5 h-5 mr-2" color="white" />
                        All bookmarks
                        <span className="ml-auto">
                            400
                        </span>
                    </a>
                </li>
                <li>
                    <a href="/favorites" 
                        className="
                            text-[#393B3D] hover:underline w-full py-2.5 px-4 rounded-md 
                            flex items-center decoration-0
                            hover:bg-[#F3F4F6] hover:text-[#1F2937]
                        "
                    >
                        <Heart className="inline-block w-5 h-5 mr-2" />
                        Favorites
                        <span className="ml-auto">
                            240
                        </span>
                    </a>
                </li>
                <li>
                    <a href="/collections" 
                        className="
                            text-[#393B3D] hover:underline w-full py-2.5 px-4 rounded-md 
                            flex items-center
                            hover:bg-[#F3F4F6] hover:text-[#1F2937]
                        "
                    >
                        <FolderBookmark className="inline-block w-5 h-5 mr-2" />
                        Collections
                        <span className="ml-auto">
                            120
                        </span>
                    </a>
                </li>
                <li>
                    <a href="#" 
                        className="
                            text-[#393B3D] hover:underline w-full py-2.5 px-4 rounded-md 
                            flex items-center hover:text-[#1F2937]
                        "
                    >
                        My Collections
                        <Plus className="inline-block w-5 h-5 ml-auto" />
                    </a>
                </li>
                <li>
                    <a href="#" 
                        className="
                            text-[#393B3D] hover:underline w-full py-2.5 px-4 rounded-md 
                            flex items-center hover:text-[#1F2937]
                        "
                    >
                        Tag
                        <Plus className="inline-block w-5 h-5 ml-auto" />
                    </a>
                </li>
            </ul>

        </div>
    )
}