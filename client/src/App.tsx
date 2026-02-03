import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import CatalogPage from "./pages/CatalogPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/admin/ProductsPage";
import LeadsPage from "./pages/admin/LeadsPage";

import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Outlet />
      <Footer />
    </>
  );
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans text-slate-900 relative">
        <Toaster position="top-center" richColors />

        <Routes>
          {/* 1. PUBLIC ROUTES (Wrapped in Navbar/Footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
          </Route>

          {/* 2. AUTH ROUTE (No Navbar) */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* 3. PROTECTED ADMIN ROUTES (Uses Admin Layout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />

            <Route path="leads" element={<LeadsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
