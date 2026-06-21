import React, { useEffect, useState } from 'react';
import PropertyCard from '../../Dashboard/PropertyCard';
import Skeleton from '../../../components/layout/Skeleton';
import styles from '../../Dashboard/Properties.module.css';
import NotFound from '../../../components/layout/NotFound';

const AdminProperties = () => {

  const [properties, setAllProperties] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [deleted, setDelete] = useState(false);


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // const res = await fetch('http://localhost:8000/api/property/all', {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/property/all`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
        });
        const data = await res.json();

        setAllProperties(Array.isArray(data) ? data : (data.data || []));

        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    }
    setDelete(false);
    fetchProperties();
  }, [deleted]);

  const handleDeleteRefresh = () => {
    setIsLoading(true);
    setDelete(true);
  };



  return (
    <div className={styles.propertiesGrid}>
      {
        loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} />
          ))
        ) : properties.length > 0 ? (
          properties.map((item) => (
            <PropertyCard key={item._id} property={item} onDelete={handleDeleteRefresh} />
          ))
        ) : (
          <NotFound />
        )}

    </div>
  ); 
};

export default AdminProperties;