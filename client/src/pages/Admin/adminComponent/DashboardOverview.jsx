import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListSkeleton  from '../../../components/layout/ListSkeleton';
import PropertyList from '../../../components/layout/PropertyList';
import styles from '../../Admin/Admin.module.css';

const DashboardOverview = () => {

  const [totalStats, setTotalStats] = useState({
    userCount: 0,
    propertyCount: 0
  })
  const [isloading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchdashboard = async () => {

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      try {
        // const res = await fetch('http://localhost:8000/api/admin/statistics', { headers });
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/statistics`, { headers });

        // const propertiesRes = await fetch('http://localhost:8000/api/admin/properties', { headers });
        const propertiesRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/properties`, { headers });

        if (!res.ok) {
          throw new Error(`Failed to fetch stats: ${res.status}`);
        }

        if (!propertiesRes.ok) {
          throw new Error(`Failed to fetch properties: ${propertiesRes.status}`);
        }

        const propertiesData = await propertiesRes.json();
        setProperties(Array.isArray(propertiesData) ? propertiesData : (propertiesData.data || []));
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);

        const data = await res.json();

        setTotalStats({
          userCount: data.data.userCount,
          propertyCount: data.data.propertyCount
        })
      } catch (error) {
        console.error(error.message)
      }
    }
    fetchdashboard();
  }, []);

  return (
    <div className={styles.content}>
      <h1 className={styles.pageTitle}>Platform Overview</h1>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <h3 className={styles.kpiTitle}>Total Users</h3>
          <p className={styles.kpiValue}>{totalStats.userCount}</p>
        </div>
        <div className={styles.kpiCard}>
          <h3 className={styles.kpiTitle}>Total Properties</h3>
          <p className={styles.kpiValue}>{totalStats.propertyCount}</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2>Recent Real Estate Listings</h2>
          <Link to="/admin_dashboard/properties" className={styles.viewAllLink}>
            <button className={styles.viewAllBtn}>View All</button>
          </Link>
        </div>

        <div className={styles.tableWrapper}>
          {isloading ? (
            Array.from({length: 6}).map((_, index) => <ListSkeleton key={index} />)
          ) : (
            properties.slice(0, 6).map((property, index) => (
              <PropertyList key={property._id || property.id} property={property} index = {index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;