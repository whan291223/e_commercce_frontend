import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CategoriesPage from "./pages/CategoriesPage";

function AdminDashboard() {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'categories':
        return <CategoriesPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <AdminLayout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </AdminLayout>
  );
}

export default AdminDashboard;