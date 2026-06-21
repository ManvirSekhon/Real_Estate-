// src/components/admin/AdminHeader.jsx
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import styles from '../../Admin/Admin.module.css';

const AdminHeader = ({ toggleSidebar }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button onClick={toggleSidebar} className={styles.iconButton}>
          <Menu size={24} />
        </button>

      </div>
      <div className={styles.headerRight}>
        <div className={styles.role}>
            {localStorage.getItem('role')}
        </div>
        <div className={styles.profileAvatar}>
          P
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;