import React from 'react';
import styles from './PropertyCard.module.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import defau from '../../assets/default.avif';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';



const PropertyCard = ({ property, onDelete}) => {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.preventDefault();
    // Navigate to the edit page with the property's ID
    if (localStorage.getItem('role') === 'admin') {
      navigate(`/admin_dashboard/edit-property/${property._id}`);
    } else {
      navigate(`/dashboard/edit-property/${property._id}`);
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
      try {
        // const res = await fetch(`http://localhost:8000/api/property/delete/${property._id}`, {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/property/delete/${property._id}`, {
          method: 'DELETE'
        })

        const data = await res.json();

        if (data.success) {
          onDelete();
          toast.success("Property deleted Successfully")
        }

      } catch (error) {
        console.log(error.message);
      }
  }

  return (
    <div className={styles.card}>
      <img
        src={property.image || defau}
        alt={property.title}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{property.title}</h3>
        <p className={styles.price}>₹{property.price}</p>
        <p className={styles.location}>{property.address}</p>
        {/* Add more fields as per your MongoDB schema */}
        <div className={styles.btn}>
          <button className={styles.propBtn} onClick={handleEdit}>
            <FaEdit className={styles.icon} />Edit
          </button>
          <button className={styles.propBtn} onClick={handleRemove}>
            <FaTrashAlt className={styles.icon} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;