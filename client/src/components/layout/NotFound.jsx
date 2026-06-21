import React from 'react'
import styles from './ComponentStyle/NotFound.module.css'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.notFoundContainer}>
            <div className={styles.notFoundIcon}>🔍</div>
            <h2 className={styles.notFoundTitle}>Looking for something?</h2>
            <p className={styles.notFoundText}>
                 what you're looking for doesn't exist or has been removed.
            </p>
            <button
                className={styles.homeBtn}
                onClick={() => { localStorage.getItem('role') === 'admin' ? navigate('/admin_dashboard') : navigate('/') }}
            >
                Go to Home Page
            </button>
        </div>
    )
}

export default NotFound