import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import ShopPage from './components/customer/ShopPage.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import api from './api/ApiService.jsx';
import './App.css'
import { CartProvider } from './context/CartContext'; 
import CartSidebar from './components/customer/Cart/CartSidebar';
import Success from "./routes/Success"
import Cancel from "./routes/Cancel"
import MyOrdersPage from './components/customer/MyOrdersPage.jsx';

// Redirects "/" to login or dashboard based on JWT and role
function HomeRedirect() {
  const [redirect, setRedirect] = React.useState(null);

  React.useEffect(() => {
    const token = sessionStorage.getItem("jwt_token");
    if (!token) {
      setRedirect("/shop"); // ✅ Changed from /login to /shop
      return;
    }
    api.get("/api/v1/users/my_session/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.role === "admin") {
          setRedirect("/admin");
        } else {
          setRedirect("/shop"); // ✅ Changed from /customer to /shop
        }
      })
      .catch(() => {
        setRedirect("/shop"); // ✅ Changed from /login to /shop
      });
  }, []);

  if (redirect) return <Navigate to={redirect} replace />;
  return (
    <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
      Loading...
    </div>
  );
}

// Protects admin route
function AdminRoute({ children }) {
  const [status, setStatus] = React.useState("loading");
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const token = sessionStorage.getItem("jwt_token");
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    api.get("/api/v1/users/my_session/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const role = res.data.role;
        if (role === "admin") {
          setStatus("allowed");
        } else {
          setStatus("forbidden");
        }
      })
      .catch(() => {
        sessionStorage.removeItem("jwt_token");
        setError("Your session has expired. Please log in again.");
        setStatus("unauthenticated");
      });
  }, []);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading...
      </div>
    );

  if (status === "unauthenticated") {
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);

    return (
      <div className="max-w-xl mx-auto mt-6 p-4 bg-red-50 border border-red-300 rounded-lg text-center">
        <p className="text-red-700">
          {error || "Please log in again."}
        </p>
      </div>
    );
  }

  if (status === "forbidden")
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-300 rounded-xl text-center">
        <h2 className="text-2xl font-semibold text-red-700">
          This page is for admin only.
        </h2>
      </div>
    );

  return children;
}

function App() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

   return (
    <CartProvider>
      <Router>
        <Navbar />
        <CartSidebar /> 
        
        <main className="min-h-screen mx-auto p-4 dark:bg-gray-500">
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ✅ PUBLIC: Anyone can browse the shop */}
            <Route path="/shop" element={<ShopPage />} />

            {/* ✅ PUBLIC: Success/Cancel pages don't need login */}
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} /> 
            <Route path="/my-orders" element={
                <MyOrdersPage />
            } />
            {/* ✅ PROTECTED: Admin only */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;