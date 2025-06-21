
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Login from "./pages/Login";
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "./pages/ResetPassword";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Orders from "./pages/Orders";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import TestimonialsPage from "./pages/Testimonials";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminReports from "./pages/admin/AdminReports";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Routes - No Layout wrapper, uses AdminLayout instead */}
          <Route path="/admin/*" element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AnimatedPage>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatedPage>
              </AdminLayout>
            </ProtectedAdminRoute>
          } />``

          {/* Home Route - No Layout wrapper since Index handles its own layout */}
          <Route path="/" element={<Layout><AnimatedPage><Index /></AnimatedPage></Layout>} />

          {/* Public Routes - With Layout wrapper */}
          <Route path="/products" element={<Layout><AnimatedPage><Products /></AnimatedPage></Layout>} />
          <Route path="/products/:id" element={<Layout><AnimatedPage><ProductDetail /></AnimatedPage></Layout>} />
          <Route path="/about" element={<Layout><AnimatedPage><About /></AnimatedPage></Layout>} />
          <Route path="/cart" element={<Layout><AnimatedPage><Cart /></AnimatedPage></Layout>} />
          <Route path="/order" element={<Layout><AnimatedPage><Order /></AnimatedPage></Layout>} />
          <Route path="/login" element={<Layout><AnimatedPage><Login /></AnimatedPage></Layout>} />
          <Route path="/auth" element={<Layout><AnimatedPage><EmailVerification /></AnimatedPage></Layout>} />
          <Route path="/auth/reset-password/:code" element={<Layout><AnimatedPage><ResetPassword /></AnimatedPage></Layout>} />
          <Route path="/payment" element={<Layout><AnimatedPage><Payment /></AnimatedPage></Layout>} />
          <Route path="/payment-success" element={<Layout><AnimatedPage><PaymentSuccess /></AnimatedPage></Layout>} />
          <Route path="/orders" element={<Layout><AnimatedPage><Orders /></AnimatedPage></Layout>} />
          <Route path="/blog" element={<Layout><AnimatedPage><Blog /></AnimatedPage></Layout>} />
          <Route path="/blog/:id" element={<Layout><AnimatedPage><BlogDetail /></AnimatedPage></Layout>} />
          <Route path="/testimonials" element={<Layout><AnimatedPage><TestimonialsPage /></AnimatedPage></Layout>} />
          <Route path="/contact" element={<Layout><AnimatedPage><Contact /></AnimatedPage></Layout>} />
          <Route path="*" element={<Layout><AnimatedPage><NotFound /></AnimatedPage></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;