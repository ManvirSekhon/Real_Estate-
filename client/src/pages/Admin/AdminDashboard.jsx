// src/pages/Admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './adminComponent/AdminSidebar';
import AdminHeader from './adminComponent/AdminHeader';
import styles from '../Admin/Admin.module.css';
import DashboardOverview from './adminComponent/DashboardOverview';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.layout}>
      {/* 1. Call the Sidebar */}
      {sidebarOpen && <AdminSidebar />}

      <div className={styles.mainWorkspace}>
        {/* 2. Call the Header and pass the toggle function */}
        <AdminHeader toggleSidebar={toggleSidebar} />

        {/* 3. The Outlet renders whatever specific page you are on */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;