// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { Home, Users, Building, Settings, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../../Admin/Admin.module.css';
import logo from '../../../assets/Logo.png';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} alt="RealEstate Logo" />
        Marketplace Admin
      </div>
      <nav className={styles.nav}>
        <NavLink to="/admin_dashboard/" end className={({isActive}) => isActive ? `${styles.navButton} ${styles.navButtonActive}` : styles.navButton}>
          <Home size={20} /> Dashboard Overview
        </NavLink>
        <NavLink to="/admin_dashboard/properties" className={({isActive}) => isActive ? `${styles.navButton} ${styles.navButtonActive}` : styles.navButton}>
          <Building size={20} /> Property Listings
        </NavLink>
        <NavLink to="/admin_dashboard/users" className={({isActive}) => isActive ? `${styles.navButton} ${styles.navButtonActive}` : styles.navButton}>
          <Users size={20} /> User Management
        </NavLink>
      </nav>
      
      <div className={styles.logoutContainer}>
        <button onClick={handleLogout} className={`${styles.navButton} ${styles.logoutButton}`}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;