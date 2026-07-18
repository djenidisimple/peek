import { LayoutGrid, LayoutList, ListSortDescendingIcon } from "lucide-react";

export default function GridView() {
    return (
        <div className="grid grid-cols-3 border-2 border-[#CDD3D8] rounded-md overflow-hidden">
            <button className="bg-[#F0ECFD] px-1 py-2 border-r-2 border-[#CDD3D8]">
                <LayoutGrid className="w-5 h-5 inline-block" />
            </button>
            <button className="px-4 py-2 border-r-2 border-[#CDD3D8]">
                <LayoutList className="w-5 h-5 inline-block" />
            </button>
            <button className="px-4 py-2">
                <ListSortDescendingIcon className="w-5 h-5 inline-block" />
            </button>
        </div>
    );
}