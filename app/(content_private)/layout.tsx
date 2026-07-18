import SideBar from "@/components/ui/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen">
        <SideBar />
        {children}
    </div>
  );
}