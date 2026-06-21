import React from 'react';
import styles from './ComponentStyle/ListSkeleton.module.css';

const ListSkeleton = () => {
    return (
        <div className={`${styles.cardRow} ${styles.shimmer}`}>
            <div className={styles.index}></div>
            <div className={styles.info}>
                <span className={styles.name}></span>
                <span className={styles.email}></span>
            </div>
            <div className={styles.details}>
                <span className={styles.roleTag}></span>
                <span className={styles.date}></span>
            </div>
            <div className={styles.actions}>
                <button className={styles.editBtn}></button>
                <button className={styles.deleteBtn} ></button>
            </div>
        </div>
    )
};

export default ListSkeleton;