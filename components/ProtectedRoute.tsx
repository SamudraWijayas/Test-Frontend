"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  isAdminRequired?: boolean; // Menentukan apakah admin diperlukan
}

const ProtectedRoute = ({
  children,
  isAdminRequired = false,
}: ProtectedRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const role = document.cookie.replace(
      /(?:(?:^|.*;\s*)role\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    // Jika token tidak ada, arahkan ke login
    if (!token) {
      router.push("/login");
      return;
    }

    // Jika role tidak sesuai dengan yang dibutuhkan (admin/user)
    if (isAdminRequired && role.toLowerCase() !== "admin") {
      router.push("/dashboard/user/artikel"); // Arahkan ke halaman user jika role admin dibutuhkan
      return;
    }

    if (!isAdminRequired && role.toLowerCase() !== "user") {
      router.push("/dashboard/admin/artikel"); // Arahkan ke halaman admin jika role user dibutuhkan
      return;
    }
  }, [router, isAdminRequired]);

  return <>{children}</>;
};

export default ProtectedRoute;
