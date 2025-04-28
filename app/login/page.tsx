// app/login/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // 1. Login dan ambil token
      const res = await axios.post(
        "https://test-fe.mysellerpintar.com/api/auth/login",
        data
      );
      const token = res.data.token;

      // 2. Simpan token ke cookie
      document.cookie = `token=${encodeURIComponent(
        token
      )}; path=/; max-age=86400`;

      // 3. Ambil data profile pakai token
      const profileRes = await axios.get(
        "https://test-fe.mysellerpintar.com/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const role = profileRes.data.role;

      // 4. Simpan role ke cookie
      document.cookie = `role=${encodeURIComponent(
        role
      )}; path=/; max-age=86400`;

      // 5. Redirect berdasarkan role
      if (role.toLowerCase() === "admin") {
        router.push("/dashboard/admin/artikel");
      } else {
        router.push("/dashboard/user/artikel");
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md py-10 px-4 bg-white rounded shadow flex flex-col items-center">
        <div className="mb-6">
          <div className="relative w-45 h-20">
            <Image
              src="/logo3.png"
              alt="Background"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div>
            <label htmlFor="username">Username</label>
            <Input
              {...register("username")}
              placeholder="Input username"
              className="mt-1 border-gray-300"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input
              {...register("password")}
              type="password"
              placeholder="Input password"
              className="mt-1 border-gray-300"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
        <span className="mt-8">
          Don’t have an account?{" "}
          <Link className="text-blue-600 underline" href="/register">
            Register
          </Link>
        </span>
      </div>
    </div>
  );
}
