import React from 'react';
import styles from './ComponentStyle/UsersCard.module.css';
import { useNavigate } from 'react-router-dom';

const UsersCard = ({ user }) => {
  const navigate = useNavigate();
  const handleEdit = (e) => {
    e.preventDefault();
    if (user.role === 'admin') {
      navigate(`/admin_dashboard/users/edit/${user._id}`);
    } else {
      navigate(`/dashboard/users/edit/${user._id}`);
    }
  }
  const handleDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/delete/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        window.location.reload();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className={styles.cardRow}>
      <div className={styles.img}>
        {user.avatar ? (
          <img src={user.avatar} alt="Avatar" />
        ) : (
          user.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.email}>{user.email}</span>
      </div>
      <div className={styles.details}>
        <span className={styles.roleTag}>{user.role || 'User'}</span>
        <span className={styles.date}>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={handleEdit}>Edit</button>
        <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default UsersCard;