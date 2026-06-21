import React from 'react';
import styles from './ComponentStyle/UsersCard.module.css';

const PropertyList = ({ property, index }) => {
    return (
        <div className={styles.cardRow}>
            <div className={styles.index}>{index + 1}.</div>
            <div className={styles.info}>
                <span className={styles.name}>{property.title}</span>
                <span className={styles.price}>₹ {property.price}</span>
            </div>
            <div className={styles.details}>
                <span className={styles.roleTag}>{property.property_type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                <span className={styles.date}>Posted: {property.createdAt}</span>
            </div>
            {/* <div className={styles.actions}>
                <buttton className={styles.deleteBtn} >Delete</buttton>
                <button>on className={styles.editBtn}>Edit</button>
            </div> */}
        </div >
    )
};

export default PropertyList;