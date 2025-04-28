# Website Manajemen Artikel

Website manajemen artikel sederhana dengan fitur autentikasi role User dan Admin.

## Fitur

- **User**:
  - Melihat daftar artikel.
  - Membaca detail artikel.
- **Admin**:
  - CRUD (Create, Read, Update, Delete) Artikel.
  - Manajemen User (opsional jika dikembangkan).

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript
- **UI**: Tailwind CSS + Shadcn/ui
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod
- **API Request**: Axios
- **Authentication**: JWT (opsional untuk backend)

## Struktur Folder

```
- app/
  - (auth)/
    - login/page.tsx
    - register/page.tsx
  - dashboard/
    - articles/
      - page.tsx
      - [id]/edit/page.tsx
    - page.tsx
  - articles/
    - page.tsx (lihat daftar artikel)
  - layout.tsx
  - page.tsx (landing page)
- components/
- lib/
- hooks/
- services/
- types/
```

## Cara Menjalankan

1. **Clone Repository**

```bash
git clone https://github.com/username/nama-repo.git
cd nama-repo
```

2. **Install Dependencies**

```bash
npm install
# atau
yarn install
```

3. **Buat file .env.local**

```
NEXT_PUBLIC_API_URL=https://test-fe.mysellerpintar.com/api
```

4. **Jalankan Development Server**

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Deployment

- **Vercel**: Rekomendasi hosting untuk Next.js. Cukup connect repo GitHub ➔ deploy otomatis.
- **Netlify**: Alternatif hosting.

## Link

- URL Website: [https://test-frontend-tau-wheat.vercel.app](https://test-frontend-tau-wheat.vercel.app)
- Repository GitHub: [https://github.com/SamudraWijayas/Test-Frontend.git](https://github.com/SamudraWijayas/Test-Frontend.git)

## Catatan

- Pastikan API sudah berjalan.
- Jika ingin proteksi halaman berdasarkan role, gunakan middleware Next.js.

---

Made with ❤️ by [Samudra Wijaya Samdoria]
