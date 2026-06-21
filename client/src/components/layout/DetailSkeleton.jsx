// PropertySkeleton.jsx
import React from 'react';
import styles from './ComponentStyle/DetailSkeleton.module.css';

const DetailSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={`${styles.shimmer} ${styles.skeletonImage}`}></div>
      <div className={styles.skeletonGrid}>
        <div>
          <div className={`${styles.shimmer} ${styles.skeletonTitle}`}></div>
          <div className={`${styles.shimmer} ${styles.skeletonText}`} style={{ width: '40%' }}></div>
          <div className={`${styles.shimmer} ${styles.skeletonPrice}`}></div>
          <div className={`${styles.shimmer} ${styles.skeletonText}`}></div>
          <div className={`${styles.shimmer} ${styles.skeletonText}`}></div>
          <div className={`${styles.shimmer} ${styles.skeletonText}`} style={{ width: '80%' }}></div>
        </div>
        <div className={`${styles.shimmer} ${styles.skeletonSidebar}`}></div>
      </div>
    </div>
  );
};

export default DetailSkeleton;