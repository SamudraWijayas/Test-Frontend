"use client";

import { useEffect, useState } from "react";
import { getTokenFromCookie } from "@/lib/auth";

interface UserProfile {
  id: string;
  username: string;
  role: String;
}

export function useProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getTokenFromCookie();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://test-fe.mysellerpintar.com/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Gagal mengambil data user");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Gagal mengambil data user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
