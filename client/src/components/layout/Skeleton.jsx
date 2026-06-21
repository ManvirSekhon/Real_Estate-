import React from 'react'
import styles from './ComponentStyle/Skeleton.module.css'

const Skeleton = () => {
    return (
        <div className={styles.skeletonCard}>
            <div className={`${styles.skeletonImage} ${styles.shimmerEffect}`}></div>
            <div className={styles.skeletonContent}>
                <div className={`${styles.skeletonTitle} ${styles.shimmerEffect}`}></div>
                <div className={`${styles.skeletonPrice} ${styles.shimmerEffect}`}></div>
                <div className={`${styles.skeletonAddress} ${styles.shimmerEffect}`}></div>
                <div className={`${styles.skeletonDetails} ${styles.shimmerEffect}`}></div>
            </div>
        </div>
    )
}

export default Skeleton