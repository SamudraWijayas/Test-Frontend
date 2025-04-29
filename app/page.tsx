"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  // Redirect if already logged iny
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const role = document.cookie.replace(
      /(?:(?:^|.*;\s*)role\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token && role) {
      if (role.toLowerCase() === "admin") {
        router.push("/dashboard/admin/artikel");
      } else {
        router.push("/dashboard/user/artikel");
      }
    }
  }, [router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://test-fe.mysellerpintar.com/api/auth/login",
        data
      );
      const token = res.data.token;
      document.cookie = `token=${encodeURIComponent(
        token
      )}; path=/; max-age=86400`;

      const profileRes = await axios.get(
        "https://test-fe.mysellerpintar.com/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const role = profileRes.data.role;
      document.cookie = `role=${encodeURIComponent(
        role
      )}; path=/; max-age=86400`;

      // Tampilkan pesan sukses menggunakan message dari Ant Design
      toast.success("Login successful!");

      // Redirect berdasarkan role
      if (role.toLowerCase() === "admin") {
        setTimeout(() => router.push("/dashboard/admin/artikel"));
      } else {
        setTimeout(() => router.push("/dashboard/user/artikel"));
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed. Please try again!"); // Tampilkan pesan error jika login gagal
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md py-10 px-4 bg-white rounded shadow flex flex-col items-center">
          <div className="mb-6">
            <div className="relative w-45 h-20">
              <Image
                src="/logo3.png"
                alt="Logo"
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
    </>
  );
}

// import Image from "next/image";
// import ArticleCard from "@/components/ArticleCard";
// import Navbar from "@/components/NavbarWhite";

// const articles = [
//   {
//     image:
//       "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg",
//     date: "April 18, 2025",
//     title: "Cybersecurity Essentials Every Developer Should Know",
//     description:
//       "Protect your work and users with fundamental cybersecurity techniques and solutions.",
//     tags: ["Technology", "Security"],
//   },
//   {
//     image:
//       "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg",
//     date: "April 18, 2025",
//     title: "The Future of Work: Remote-First Teams and Digital Tools",
//     description:
//       "How companies are crafting remote-first policies and using collaboration tools.",
//     tags: ["Remote", "Tools"],
//   },
//   {
//     image:
//       "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg",
//     date: "April 18, 2025",
//     title: "The Future of Work: Remote-First Teams and Digital Tools",
//     description:
//       "How companies are crafting remote-first policies and using collaboration tools.",
//     tags: ["Remote", "Tools"],
//   },
//   // Tambahkan artikel lainnya...
// ];

// export default function ArticlePage() {
//   return (
//     <div className="bg-white text-black">
//       <Navbar />

//       <main className="max-w-6xl mx-auto px-6 pb-10 pt-26">
//         <article>
//           <p className="text-sm text-gray-500 text-center">
//             February 8, 2024 · Creativity, Agile
//           </p>
//           <h1 className="text-3xl font-bold mt-2 mb-6 text-center">
//             Figma’s New Dev Mode: A Game-Changer for Designers & Developers
//           </h1>

//           <div className="relative w-full h-50 lg:h-100 mb-8">
//             <Image
//               src="/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg"
//               alt="Man working with two monitors"
//               fill
//               className="object-cover rounded-xl"
//             />
//           </div>

//           <p className="mb-4">
//             Di dunia digital modern, kolaborasi antara desainer dan developer
//             seringkali penuh tantangan. Namun, Figma memperkenalkan fitur baru
//             bernama <strong>Dev Mode</strong> yang menghadirkan cara baru untuk
//             meningkatkan komunikasi dan alur kerja.
//           </p>

//           <h2 className="text-xl font-semibold mt-6 mb-2">Apa itu Dev Mode?</h2>
//           <p className="mb-4">
//             Dev Mode adalah fitur di Figma yang memfokuskan tampilan khusus bagi
//             developer, memungkinkan mereka untuk lebih mudah membaca spesifikasi
//             desain dan mengambil aset yang dibutuhkan.
//           </p>

//           <h2 className="text-xl font-semibold mt-6 mb-2">Fitur Utama</h2>
//           <ul className="list-disc pl-6 mb-4">
//             <li>Inspeksi Desain yang Lebih Detil</li>
//             <li>Dokumentasi Otomatis</li>
//             <li>Integrasi dengan Tools Developer</li>
//             <li>Mode Navigasi yang Ramah Developer</li>
//           </ul>

//           <h2 className="text-xl font-semibold mt-6 mb-2">Pemikiran Akhir</h2>
//           <p className="mb-4">
//             Dengan Dev Mode, Figma berhasil menjembatani jurang komunikasi
//             antara desainer dan developer. Ini adalah langkah maju dalam
//             efisiensi tim produk.
//           </p>
//         </article>

//         <section className="mt-12">
//           <h3 className="text-2xl font-semibold mb-4">Artikel lainnya</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {articles.map((article, idx) => (
//               <ArticleCard key={idx} {...article} />
//             ))}
//           </div>
//         </section>
//       </main>

//       <footer className="bg-blue-50 text-center py-6 mt-12 text-sm text-gray-600">
//         <p>© 2025 LogicIpsum. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }
