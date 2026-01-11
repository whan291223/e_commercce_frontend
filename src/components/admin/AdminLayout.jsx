import React, { useState } from 'react';

function AdminLayout({ activePage, setActivePage, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
  ];

  const MenuItem = ({ item }) => (
    <button
      onClick={() => setActivePage(item.id)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
        ${activePage === item.id
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
    >
      <span className="text-xl">{item.icon}</span>
      {sidebarOpen && <span className="font-medium">{item.label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'w-64' : 'w-20'}
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 ${sidebarOpen ? '' : 'justify-center'}`}>
            <span className="text-xl">👤</span>
            {sidebarOpen && <span className="font-medium text-sm">Admin User</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;