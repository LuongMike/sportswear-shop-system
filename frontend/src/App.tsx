import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProductsPage from "./pages/products/ProductsPage";
import ProductDetailPage from "./pages/product-detail/ProductDetailPage";
import BrandsPage from "./pages/brands/BrandsPage";
import AdminPage from "./pages/admin/AdminPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrdersPage from "./pages/account/OrdersPage";
import ProfilePage from "./pages/account/ProfilePage";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/useAuthStore";
import QueryProvider from "./providers/QueryProvider";
import MainLayout from "./components/layout/MainLayout";
import ChatBubble from "./components/common/ChatBubble";

const App = () => {
  const { initializeAuth } = useAuthStore();

  // Initialize auth when app starts
  useEffect(() => {
    console.log("🚀 App starting, initializing auth...");
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryProvider>
      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            {/* Trang chủ */}
            <Route path="/" element={<HomePage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Collections routes - All products */}
            <Route path="/collections" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />

            {/* Collections routes - 3 cấp độ */}
            <Route path="/collections/:category" element={<ProductsPage />} />
            <Route
              path="/collections/:category/:subcategory"
              element={<ProductsPage />}
            />
            <Route
              path="/collections/:category/:subcategory/:subsubcategory"
              element={<ProductsPage />}
            />

            {/* Brands routes */}
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/brands/:brand" element={<ProductsPage />} />

            {/* Sports routes */}
            <Route path="/sports" element={<ProductsPage />} />
            <Route path="/sports/:sport" element={<ProductsPage />} />

            {/* Search */}
            <Route path="/search" element={<ProductsPage />} />

            {/* Checkout & Account */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account/orders" element={<OrdersPage />} />
            <Route path="/account/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Catch-all route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
        <ChatBubble />
      </BrowserRouter>
    </QueryProvider>
  );
};

export default App;
