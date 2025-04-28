"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

// Schema validasi menggunakan Zod
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["User", "Admin"]),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Fungsi untuk menangani submit form
  const onSubmit = async (data: FormData) => {
    try {
      // Mengirimkan request untuk registrasi ke backend
      await axios.post("/auth/register", data);

      // Redirect ke halaman login setelah registrasi berhasil
      router.push("/login");
    } catch (err) {
      console.error("Registration failed:", err);
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
          <label htmlFor="username">Username</label>
          <Input
            {...register("username")}
            placeholder="Username"
            className="mt-1 border-gray-300"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}

          <label htmlFor="password">Password</label>
          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="mt-1 border-gray-300"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <label htmlFor="role">Role</label>
          <select
            {...register("role")}
            className="w-full border mt-1 border-gray-300 px-3 py-2 rounded-md text-sm"
          >
            <option value="">Select Role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}

          {/* Button Register */}
          <Button type="submit" className="w-full bg-blue-600 text-white">
            Register
          </Button>
        </form>

        {/* Link ke halaman Login */}
        <p className="text-center mt-4 text-sm">
          Already have an account?
          <Link href="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
