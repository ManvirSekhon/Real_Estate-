import React from 'react'
import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from 'react';
import PropertyCard from '../components/layout/PropertyCard';
import Skeleton from '../components/layout/Skeleton';
import NotFound from '../components/layout/NotFound';
import styles from './Style/Search.module.css'

const Search = () => {

  const [allProperties, setAllProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userBookmarks, setUserBookmarks] = useState([]);

  useEffect(() => {
    const fetchUserBookmarks = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/users/bookmarks`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const data = await res.json();
        setUserBookmarks(data.data || []);

      } catch (err) {
        console.error(err);
      }
    };

    fetchUserBookmarks();
  }, []);

  // console.log(allProperties);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/property/all`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
        });
        const data = await res.json();

        setAllProperties(Array.isArray(data) ? data : (data.data || []));

        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const handleToggleBookmark = async (propertyId) => {
  try {
    setUserBookmarks((prev) => {
      const exists = prev.some((b) => b._id === propertyId);

      if (exists) {
        return prev.filter((b) => b._id !== propertyId);
      } else {
        return [...prev, { _id: propertyId }];
      }
    });

    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/users/bookmarks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ propertyId }),
      }
    );

    const data = await res.json();

    if (data?.data) {
      setUserBookmarks(data.data); 
    }

  } catch (error) {
    console.error(error);
  }
};

  const filteredProperties = allProperties.filter(property => {
    if (searchTerm === '') return true;
    return (property.title || '').toLowerCase().includes(searchTerm.toLowerCase());
  })



  return (
    <div className={styles.search_page}>
      <div className={styles.search_container}>
        <input
          type="text"
          placeholder="Search your properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.searchButton}>
          <FiSearch />
        </button>
      </div>

      <div className={styles.grid}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} />
          ))
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((property) => {

            const isBookmarked = userBookmarks.some(
              (b) => b._id === property._id
            );

            return <PropertyCard key={property._id || property.id}      property={property}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark} />
          })
        ) : (
          <NotFound />
        )}
      </div>
    </div>
  )
}

export default Search