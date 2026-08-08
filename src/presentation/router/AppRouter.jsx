import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { NotFoundPage } from '../../components/ui/404-page-not-found';
import LoadingFallback from '../components/ui/LoadingFallback';

// Layouts
import UserLayout from '../components/layout/UserLayout';
import AdminLayout from '../components/layout/AdminLayout';

// User Pages - LAZY
const HomePage = lazy(() => import('../pages/user/HomePage'));
const LoginPage = lazy(() => import('../pages/user/LoginPage'));
const RegisterPage = lazy(() => import('../pages/user/RegisterPage'));
const ProdukListPage = lazy(() => import('../pages/user/ProdukListPage'));
const ProdukDetailPage = lazy(() => import('../pages/user/ProdukDetailPage'));
const CheckoutPage = lazy(() => import('../pages/user/CheckoutPage'));
const KonfirmasiPage = lazy(() => import('../pages/user/KonfirmasiPage'));
const RiwayatPage = lazy(() => import('../pages/user/RiwayatPage'));
const RiwayatDetailPage = lazy(() => import('../pages/user/RiwayatDetailPage'));
const NotifikasiPage = lazy(() => import('../pages/user/NotifikasiPage'));
const ProfilPage = lazy(() => import('../pages/user/ProfilPage'));
const NewsListPage = lazy(() => import('../pages/user/NewsListPage'));
const NewsDetailPage = lazy(() => import('../pages/user/NewsDetailPage'));
const UmkmListPage = lazy(() => import('../pages/user/UmkmListPage'));
const UmkmDetailPage = lazy(() => import('../pages/user/UmkmDetailPage'));

// Admin Pages - LAZY
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const UserListPage = lazy(() => import('../pages/admin/UserListPage'));
const UserDetailPage = lazy(() => import('../pages/admin/UserDetailPage'));
const ProdukAdminPage = lazy(() => import('../pages/admin/ProdukAdminPage'));
const ProdukFormPage = lazy(() => import('../pages/admin/ProdukFormPage'));
const UmkmAdminPage = lazy(() => import('../pages/admin/UmkmAdminPage'));
const UmkmFormPage = lazy(() => import('../pages/admin/UmkmFormPage'));
const TransaksiAdminPage = lazy(() => import('../pages/admin/TransaksiAdminPage'));
const TransaksiDetailPage = lazy(() => import('../pages/admin/TransaksiDetailPage'));
const NotifikasiAdminPage = lazy(() => import('../pages/admin/NotifikasiAdminPage'));
const NewsAdminPage = lazy(() => import('../pages/admin/NewsAdminPage'));
const NewsFormPage = lazy(() => import('../pages/admin/NewsFormPage'));
const QrisAdminPage = lazy(() => import('../pages/admin/QrisAdminPage'));
const AdminProfilPage = lazy(() => import('../pages/admin/AdminProfilPage'));

export const AppRouter = createBrowserRouter([
  // Auth / Login Routes (no layout)
  { path: '/login', element: <Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense> },
  { path: '/register', element: <Suspense fallback={<LoadingFallback />}><RegisterPage /></Suspense> },
  { path: '/admin/login', element: <Suspense fallback={<LoadingFallback />}><AdminLoginPage /></Suspense> },

  // User Main Tabs (show BottomNavBar, hide back button)
  {
    element: <UserLayout showBottomNav={true} showBack={false} />,
    children: [
      { path: '/', element: <Suspense fallback={<LoadingFallback />}><HomePage /></Suspense> },
      { path: '/produk', element: <Suspense fallback={<LoadingFallback />}><ProdukListPage /></Suspense> },
      { path: '/umkm', element: <Suspense fallback={<LoadingFallback />}><UmkmListPage /></Suspense> },
      { path: '/news', element: <Suspense fallback={<LoadingFallback />}><NewsListPage /></Suspense> },
      { path: '/notifikasi', element: <Suspense fallback={<LoadingFallback />}><NotifikasiPage /></Suspense> },
      { path: '/profil', element: <Suspense fallback={<LoadingFallback />}><ProfilPage /></Suspense> },
    ]
  },

  // User Inner Detail Pages (hide BottomNavBar, show back button)
  {
    element: <UserLayout showBottomNav={false} showBack={true} />,
    children: [
      { path: '/produk/:id', element: <Suspense fallback={<LoadingFallback />}><ProdukDetailPage /></Suspense> },
      { path: '/umkm/:id', element: <Suspense fallback={<LoadingFallback />}><UmkmDetailPage /></Suspense> },
      { path: '/news/:id', element: <Suspense fallback={<LoadingFallback />}><NewsDetailPage /></Suspense> },
      { path: '/transaksi/baru', element: <Suspense fallback={<LoadingFallback />}><CheckoutPage /></Suspense> },
      { path: '/transaksi/konfirmasi', element: <Suspense fallback={<LoadingFallback />}><KonfirmasiPage /></Suspense> },
      { path: '/riwayat', element: <Suspense fallback={<LoadingFallback />}><RiwayatPage /></Suspense> },
      { path: '/riwayat/:id', element: <Suspense fallback={<LoadingFallback />}><RiwayatDetailPage /></Suspense> },
    ]
  },

  // Admin Dashboard / Management (uses AdminLayout with sidebar)
  {
    element: <AdminLayout />,
    children: [
      { path: '/admin/dashboard', element: <Suspense fallback={<LoadingFallback />}><DashboardPage /></Suspense> },
      { path: '/admin/users', element: <Suspense fallback={<LoadingFallback />}><UserListPage /></Suspense> },
      { path: '/admin/users/:id', element: <Suspense fallback={<LoadingFallback />}><UserDetailPage /></Suspense> },
      { path: '/admin/produk', element: <Suspense fallback={<LoadingFallback />}><ProdukAdminPage /></Suspense> },
      { path: '/admin/produk/tambah', element: <Suspense fallback={<LoadingFallback />}><ProdukFormPage /></Suspense> },
      { path: '/admin/produk/:id/edit', element: <Suspense fallback={<LoadingFallback />}><ProdukFormPage /></Suspense> },
      { path: '/admin/umkm', element: <Suspense fallback={<LoadingFallback />}><UmkmAdminPage /></Suspense> },
      { path: '/admin/umkm/tambah', element: <Suspense fallback={<LoadingFallback />}><UmkmFormPage /></Suspense> },
      { path: '/admin/umkm/:id/edit', element: <Suspense fallback={<LoadingFallback />}><UmkmFormPage /></Suspense> },
      { path: '/admin/transaksi', element: <Suspense fallback={<LoadingFallback />}><TransaksiAdminPage /></Suspense> },
      { path: '/admin/transaksi/:id', element: <Suspense fallback={<LoadingFallback />}><TransaksiDetailPage /></Suspense> },
      { path: '/admin/notifikasi/kirim', element: <Suspense fallback={<LoadingFallback />}><NotifikasiAdminPage /></Suspense> },
      { path: '/admin/news', element: <Suspense fallback={<LoadingFallback />}><NewsAdminPage /></Suspense> },
      { path: '/admin/news/tambah', element: <Suspense fallback={<LoadingFallback />}><NewsFormPage /></Suspense> },
      { path: '/admin/news/:id/edit', element: <Suspense fallback={<LoadingFallback />}><NewsFormPage /></Suspense> },
      { path: '/admin/qris', element: <Suspense fallback={<LoadingFallback />}><QrisAdminPage /></Suspense> },
      { path: '/admin/profil', element: <Suspense fallback={<LoadingFallback />}><AdminProfilPage /></Suspense> },
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
