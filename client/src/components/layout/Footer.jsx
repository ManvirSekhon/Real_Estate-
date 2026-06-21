import React from 'react'
import styles from './ComponentStyle/Footer.module.css'
import logo from '../../assets/Logo.png'
import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";

const Footer = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.section}>

          <div className={styles.logo}>
            <img src={logo} alt="RealEstate MarketPlace" />
            <div>
              <h3>RealEstate </h3>
              <h3 style={{ color: '#D97706' }}>MarketPlace</h3>
            </div>
          </div>


          <p>Find your dream home with ease and confidence.</p>
        </div>

        <div className={styles.links}>
          <a href="/">Home</a>
          <a href="/search">Search</a>
          <a href="/dashboard">Dashboard</a>
        </div>

        <div className={styles.contact}>
          <h4>Contact Us</h4>

          <div className={styles.contactItem}>
            <MdLocationOn className={styles.icon} />
            <p>123 Luxury Lane, Mumbai, India</p>
          </div>

          <div className={styles.contactItem}>
            <FaPhoneAlt className={styles.icon} size={14} />
            <p>+91 98765 43210</p>
          </div>

          <div className={styles.contactItem}>
            <MdEmail className={styles.icon} />
            <p>pk4365172@gmail.com</p>
          </div>

          <div className={styles.socials}>
            <a href="#"><FaFacebook /></a>
            <a href="https://www.instagram.com/pankajsart/#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; 2026 RealEstate MarketPlace. All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer

