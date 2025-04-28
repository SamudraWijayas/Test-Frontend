import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute isAdminRequired={false}>
      <div>{children}</div>
    </ProtectedRoute>
  );
}
