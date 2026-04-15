import { AdminSidebar } from "@/components/layout/AdminSidebar";

export const metadata = {
  title: "Admin | Kristýna Foto",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="light flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-6">
        {children}
      </main>
    </div>
  );
}
