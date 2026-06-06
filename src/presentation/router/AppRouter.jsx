import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { NotFoundPage } from '../../components/ui/404-page-not-found';

// Layouts
import UserLayout from '../components/layout/UserLayout';
import AdminLayout from '../components/layout/AdminLayout';

// User Pages
import HomePage from '../pages/user/HomePage';
import LoginPage from '../pages/user/LoginPage';
import RegisterPage from '../pages/user/RegisterPage';
import ProdukListPage from '../pages/user/ProdukListPage';
import ProdukDetailPage from '../pages/user/ProdukDetailPage';
import CheckoutPage from '../pages/user/CheckoutPage';
import KonfirmasiPage from '../pages/user/KonfirmasiPage';
import RiwayatPage from '../pages/user/RiwayatPage';
import RiwayatDetailPage from '../pages/user/RiwayatDetailPage';
import NotifikasiPage from '../pages/user/NotifikasiPage';
import ProfilPage from '../pages/user/ProfilPage';
import NewsListPage from '../pages/user/NewsListPage';
import NewsDetailPage from '../pages/user/NewsDetailPage';
import UmkmListPage from '../pages/user/UmkmListPage';
import UmkmDetailPage from '../pages/user/UmkmDetailPage';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import UserListPage from '../pages/admin/UserListPage';
import UserDetailPage from '../pages/admin/UserDetailPage';
import ProdukAdminPage from '../pages/admin/ProdukAdminPage';
import ProdukFormPage from '../pages/admin/ProdukFormPage';
import UmkmAdminPage from '../pages/admin/UmkmAdminPage';
import UmkmFormPage from '../pages/admin/UmkmFormPage';
import TransaksiAdminPage from '../pages/admin/TransaksiAdminPage';
import TransaksiDetailPage from '../pages/admin/TransaksiDetailPage';
import NotifikasiAdminPage from '../pages/admin/NotifikasiAdminPage';
import NewsAdminPage from '../pages/admin/NewsAdminPage';
import NewsFormPage from '../pages/admin/NewsFormPage';
import QrisAdminPage from '../pages/admin/QrisAdminPage';
import AdminProfilPage from '../pages/admin/AdminProfilPage';

export const AppRouter = createBrowserRouter([
  // Auth / Login Routes (no layout)
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },

  // User Main Tabs (show BottomNavBar, hide back button)
  {
    element: <UserLayout showBottomNav={true} showBack={false} />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/produk', element: <ProdukListPage /> },
      { path: '/umkm', element: <UmkmListPage /> },
      { path: '/news', element: <NewsListPage /> },
      { path: '/notifikasi', element: <NotifikasiPage /> },
      { path: '/profil', element: <ProfilPage /> },
    ]
  },

  // User Inner Detail Pages (hide BottomNavBar, show back button)
  {
    element: <UserLayout showBottomNav={false} showBack={true} />,
    children: [
      { path: '/produk/:id', element: <ProdukDetailPage /> },
      { path: '/umkm/:id', element: <UmkmDetailPage /> },
      { path: '/news/:id', element: <NewsDetailPage /> },
      { path: '/transaksi/baru', element: <CheckoutPage /> },
      { path: '/transaksi/konfirmasi', element: <KonfirmasiPage /> },
      { path: '/riwayat', element: <RiwayatPage /> },
      { path: '/riwayat/:id', element: <RiwayatDetailPage /> },
    ]
  },

  // Admin Dashboard / Management (uses AdminLayout with sidebar)
  {
    element: <AdminLayout />,
    children: [
      { path: '/admin/dashboard', element: <DashboardPage /> },
      { path: '/admin/users', element: <UserListPage /> },
      { path: '/admin/users/:id', element: <UserDetailPage /> },
      { path: '/admin/produk', element: <ProdukAdminPage /> },
      { path: '/admin/produk/tambah', element: <ProdukFormPage /> },
      { path: '/admin/produk/:id/edit', element: <ProdukFormPage /> },
      { path: '/admin/umkm', element: <UmkmAdminPage /> },
      { path: '/admin/umkm/tambah', element: <UmkmFormPage /> },
      { path: '/admin/umkm/:id/edit', element: <UmkmFormPage /> },
      { path: '/admin/transaksi', element: <TransaksiAdminPage /> },
      { path: '/admin/transaksi/:id', element: <TransaksiDetailPage /> },
      { path: '/admin/notifikasi/kirim', element: <NotifikasiAdminPage /> },
      { path: '/admin/news', element: <NewsAdminPage /> },
      { path: '/admin/news/tambah', element: <NewsFormPage /> },
      { path: '/admin/news/:id/edit', element: <NewsFormPage /> },
      { path: '/admin/qris', element: <QrisAdminPage /> },
      { path: '/admin/profil', element: <AdminProfilPage /> },
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
