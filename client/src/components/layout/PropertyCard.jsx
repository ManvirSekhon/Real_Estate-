import React from 'react';
import { useState } from 'react';
import defaultImage from '../../assets/default.avif';
import styles from './ComponentStyle/PropertyCard.module.css';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Star } from 'lucide-react';
import axios from 'axios';

import { default as Lottie } from "lottie-react";
import starAnimation from "../../assets/Star.json";

import useSound from 'use-sound'; 
import popSound from '../../assets/star.wav'; 

const PropertyCard = ({ property, isBookmarked, onToggleBookmark }) => {
  const navigate = useNavigate();

  const [play] = useSound(popSound, { volume: 0.5 });
  const [playAnimation, setPlayAnimation] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();

    if (!isBookmarked) {
      play();
      setPlayAnimation(true);
      setTimeout(() => {
        setPlayAnimation(false);
      }, 800);
    }
    if (onToggleBookmark) {
      onToggleBookmark(property._id);
    }
  }

  const handleView = () => {
    navigate(`/search/details/${property._id}`);
  };

  const LottieComponent = typeof Lottie === 'function' ? Lottie : Lottie.default;


  return (
    <div className={styles.card}>

      {playAnimation && (
        <div className={styles.lottiewrapper}>
          <LottieComponent
            animationData={starAnimation}
            loop={false}
            style={{ width: '300px', height: '300px' }}
          />
        </div>
      )}

      {/* Property Image */}
      <img
        src={property.image || defaultImage}
        alt={property.title}
        className={styles.image}
      />

      <div className={styles.bookmarkWrapper} onClick={handleBookmark}>
        <Star
          size={20}
          // Fill with color if bookmarked, otherwise 'none' (blank)
          fill={isBookmarked ? "#ffcc00" : "none"}
          // The outline color
          color={isBookmarked ? "#ffcc00" : "#555"}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{property.title}</h3>

        {/* Price */}
        <p className={styles.price}>₹{property.price}</p>

        {/* Address */}
        <p className={styles.address}>
          {property.address} {property.city && `, ${property.city}`} {property.state && `, ${property.state}`}
        </p>

        {/* Extra details & Badge */}
        <p className={styles.details}>
          {property.bedrooms} Beds | {property.bathrooms} Baths | {property.square_foot} sqft <br />
          <span className={styles.typeBadge}>
            {property.property_type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </p>
      </div>

      <button className={styles.btn} onClick={handleView}>View Details</button>
    </div>
  );
};

export default PropertyCard;