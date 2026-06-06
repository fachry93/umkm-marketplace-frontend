import fs from 'fs';
import path from 'path';

const userPages = [
  'HomePage', 'LoginPage', 'RegisterPage', 'ProdukListPage', 'ProdukDetailPage',
  'CheckoutPage', 'KonfirmasiPage', 'RiwayatPage', 'RiwayatDetailPage',
  'NotifikasiPage', 'ProfilPage', 'NewsListPage', 'NewsDetailPage'
];

const adminPages = [
  'AdminLoginPage', 'DashboardPage', 'UserListPage', 'UserDetailPage',
  'ProdukAdminPage', 'ProdukFormPage', 'TransaksiAdminPage', 'TransaksiDetailPage',
  'NotifikasiAdminPage', 'NewsAdminPage', 'NewsFormPage', 'QrisAdminPage', 'AdminProfilPage'
];

const basePageContent = (name) => `import React from 'react';
import { PageTransition } from '../../components/animation/PageTransition';

export default function ${name}() {
  return (
    <PageTransition>
      <div className="p-4">
        <h1 className="text-2xl font-bold font-display text-primary-600">${name}</h1>
      </div>
    </PageTransition>
  );
}
`;

for (const page of userPages) {
  const dir = 'src/presentation/pages/user';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, page + '.jsx'), basePageContent(page));
}

for (const page of adminPages) {
  const dir = 'src/presentation/pages/admin';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, page + '.jsx'), basePageContent(page));
}

// Generate AppRouter.jsx
const routerContent = `import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// User Pages
${userPages.map(p => `import ${p} from '../pages/user/${p}';`).join('\n')}

// Admin Pages
${adminPages.map(p => `import ${p} from '../pages/admin/${p}';`).join('\n')}

export const AppRouter = createBrowserRouter([
  // Public Routes
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/produk', element: <ProdukListPage /> },
  { path: '/produk/:id', element: <ProdukDetailPage /> },
  { path: '/news', element: <NewsListPage /> },
  { path: '/news/:id', element: <NewsDetailPage /> },

  // Protected User Routes (Need Auth check in real app)
  { path: '/transaksi/baru', element: <CheckoutPage /> },
  { path: '/transaksi/konfirmasi', element: <KonfirmasiPage /> },
  { path: '/riwayat', element: <RiwayatPage /> },
  { path: '/riwayat/:id', element: <RiwayatDetailPage /> },
  { path: '/notifikasi', element: <NotifikasiPage /> },
  { path: '/profil', element: <ProfilPage /> },

  // Admin Routes
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/admin/dashboard', element: <DashboardPage /> },
  { path: '/admin/users', element: <UserListPage /> },
  { path: '/admin/users/:id', element: <UserDetailPage /> },
  { path: '/admin/produk', element: <ProdukAdminPage /> },
  { path: '/admin/produk/tambah', element: <ProdukFormPage /> },
  { path: '/admin/produk/:id/edit', element: <ProdukFormPage /> },
  { path: '/admin/transaksi', element: <TransaksiAdminPage /> },
  { path: '/admin/transaksi/:id', element: <TransaksiDetailPage /> },
  { path: '/admin/notifikasi/kirim', element: <NotifikasiAdminPage /> },
  { path: '/admin/news', element: <NewsAdminPage /> },
  { path: '/admin/news/tambah', element: <NewsFormPage /> },
  { path: '/admin/news/:id/edit', element: <NewsFormPage /> },
  { path: '/admin/qris', element: <QrisAdminPage /> },
  { path: '/admin/profil', element: <AdminProfilPage /> },
]);
`;

fs.writeFileSync('src/presentation/router/AppRouter.jsx', routerContent);
