import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styles from './ComponentStyle/Navbar.module.css'
import logo from '../../assets/Logo.png'

const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();


  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  }
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="RealEstate MarketPlace" />
        <div>
          <h3>RealEstate </h3>
          <h3 style={{ color: '#D97706' }}>MarketPlace</h3>
        </div>
      </div>

      <div className={styles.links}>
        <Link to='/'>Home</Link>
        <Link to='/search'>Search</Link>
        {/* {localStorage.getItem('role') === 'admin' ? <Link to='/admin_dashboard'>Admin Dashboard</Link> : <Link to='/dashboard'>Dashboard</Link>} */}
        <Link to='/dashboard'>Dashboard</Link>

      </div>
      <div className={styles.buttons}>
        {isLoggedIn ? (
          <button onClick={handleLogout}>LogOut</button>
        ) : (
          <>
            <Link to='/login'><button>Login</button></Link>
            <Link to='/register'><button>Register</button></Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar