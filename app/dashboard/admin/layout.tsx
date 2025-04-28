import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Header } from "@/components/dashboard/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ToastContainer } from "react-toastify";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute isAdminRequired={true}>
      <ToastContainer />
      <div className="bg-gray-100">
        <SidebarProvider>
          <div className="flex h-screen w-full">
            {/* Sidebar */}
            <AppSidebar />
            {/* Konten utama dan Header */}
            <div className="flex flex-col flex-1">
              {/* Header di atas konten utama */}
              <Header />
              <main className="flex-1 p-4 overflow-y-auto">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}
