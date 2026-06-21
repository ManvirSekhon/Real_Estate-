import React from 'react';
import { useEffect, useState } from 'react';
import PropertyCard from '../../components/layout/PropertyCard';
import styles from './Bookmarks.module.css';
import NotFound from '../../components/layout/NotFound'
import Skeleton from '../../components/layout/Skeleton';


const Bookmarks = () => {

  const [savedProperties, setSavedProperties] = useState([]);
  const token = localStorage.getItem('token');
  const [isloading, setisLoading] = useState(true);


  useEffect(() => {
    const fetchBookmarks = async () => {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/bookmarks`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTimeout(() => {
        setisLoading(!isloading);
      }, 3000);

      const data = await res.json();
      // console.log(data);
      setSavedProperties(data.data);
    };

    fetchBookmarks();
  }, []);

  const handleToggleBookmark = async (propertyId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/users/bookmarks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ propertyId }),
        }
      );

      // const data = await res.json();
      // setSavedProperties(data.data || []);

      setSavedProperties(prev =>
        prev.filter(property => property._id !== propertyId)
      );


    } catch (err) {
      console.error(err);
    }
  };

  if (isloading) {
    return <div className={styles.grid}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  }

  return (
    <div className={styles.bookmarks_page}>
      <h2 className={styles.bookmarks_title}>My Bookmarked Properties</h2>



      {(savedProperties || []).length === 0 ? (
        <div className={styles.no_bookmarks}>
          <NotFound />
        </div>
      ) : (
        <div className={styles.grid}>
          {savedProperties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              isBookmarked={true}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookmarks