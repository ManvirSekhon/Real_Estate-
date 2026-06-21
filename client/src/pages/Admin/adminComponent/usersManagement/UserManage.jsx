import React from 'react'
import { useEffect, useState } from 'react';
import styles from './UserManage.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import UsersCard from '../../../../components/layout/UsersCard';

const UserManage = () => {

  const [isloading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const isRegistering =  location.pathname === '/admin_dashboard/users/register';


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/admin/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : (data.data || []));
        setTimeout(() => {

          setIsLoading(false);
        }, 1500);

      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  console.log(users);

  const handleAddUser = (e) => {
    e.preventDefault();
    navigate('/admin_dashboard/users/register');
  };

  return (
    <div className={styles.users}>
      
      <div className={styles.head}>
        {!isRegistering ? (
          <>
            <h2>({users.length}) Users</h2>
            <button className={styles.addUserBtn} onClick={handleAddUser}>
              <UserPlus />
              Add User
            </button>
          </>) : (
          <button className={styles.back} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
         Back 
        </button>
        )
        }
      </div>
      <div className={styles.userlayout}>
        {isloading ? (
          <p>Loading users...</p>
        ) : (
          users.map((user) => (
            <UsersCard key={user._id || user.id} user={user} />
          ))
        )}
      </div>
    </div>
  )
}

export default UserManage;