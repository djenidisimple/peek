import GridView from "@/components/ui/GridView";
export default function BookMark() {
    return (
        <div className="flex items-start justify-between p-8">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold mb-4">All Bookmarks</h1>
                <p className="text-lg text-gray-600">This is the bookmark page content.</p>
            </div>
            <GridView />
        </div>
    );
}