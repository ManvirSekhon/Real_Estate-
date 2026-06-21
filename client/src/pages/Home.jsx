import React, { useEffect, useState } from 'react'
import styles from './Style/Home.module.css'
import { Link } from 'react-router-dom'
import PropertyCard from '../components/layout/PropertyCard'

const Home = () => {

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/property/all`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
        });

        const data = await res.json();



        setProperties(data.slice(0, 3));
      } catch (err) {
        console.log(err);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <React.Fragment>

      {/* HERO SECTION */}
      <div className={styles.hero}>
        <h1>"Your Perfect Property, Just a Click Away."</h1>
        <Link to='/search'><button>Explore</button></Link>
      </div>

      {/* ABOUT SECTION */}
      <div className={styles.about}>
        <h2>About Us</h2>
        <p>
          We help you find the best properties tailored to your needs.
          Whether you're looking to buy, rent, or invest — we provide
          verified listings, seamless browsing, and trusted connections.
        </p>
      </div>

      {/* FEATURED PROPERTIES */}
      <div className={styles.featured}>

        <div className={styles.featuredHeader}>
          <h2>Featured Properties</h2>
        </div>

        <div className={styles.gridWrapper}>
          <div className={styles.propertyGrid}>
            {properties?.length > 0 ? (
              properties.slice(0, 7).map((property) => (
                <Link to="/search" key={property._id}>
                  <div
                    key={property._id}
                    className={styles.propertyTile}
                    style={{ backgroundImage: `url(${property.image})` }}
                  >
                    <div className={styles.overlay}>
                      <h3>{property.title}</h3>
                      <p>₹ {property.price}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No properties available</p>
            )}
            
            <div className={styles.viewAllTile}>
              <Link to="/search">View All</Link>
            </div>
          </div>



        </div>

      </div>

    </React.Fragment >
  )
}

export default Home;