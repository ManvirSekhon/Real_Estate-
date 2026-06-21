import React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../layout/ComponentStyle/PropertyDetails.module.css';
import DetailSkeleton from './DetailSkeleton';
import NotFound from './NotFound';
import { ArrowLeft } from 'lucide-react';
import defaultImage from '../../assets/default.avif';
import { Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";


const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Contact, setContact] = useState(false);


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // const res = await fetch(`http://localhost:8000/api/property/get/${id}`, {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/property/get/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setProperty(data);

        setTimeout(() => {
          setLoading(false);
        }, 3000);

      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const handleContact = (e) => {
    e.preventDefault();
    setContact(!Contact);
  }

  const copyNumber = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(property?.postedBy?.number);
    toast.success("Number copied!");
  };

  const sendMessage = async () => {
    try{
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        sellerEmail: property?.postedBy?.email,
        buyerName: localStorage.getItem('user'),
        buyerEmail: localStorage.getItem('email'),
        buyerPhone: localStorage.getItem('number'),
        propertyTitle: property?.title,
        propertyId: property?._id,
        sellerId: property?.postedBy?._id,
        message: "Hi, I'm interested in your property : " + property?.title 
      }),
    });
    if (res.ok) {
      toast.success("Mail sent!");
    } else {
      toast.error("Something went wrong!");
    }
    }catch(error){
      toast.error(error.message);
    }
  };

  console.log(property);
  if (loading) return <DetailSkeleton />;
  if (!property) return <NotFound />;


  return (
    <>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={18} style={{ marginRight: '8px' }} />
        Back
      </button>
      <div className={styles.container}>

        <div className={styles.imageWrapper}>
          <img src={property.image || defaultImage} alt={property.title} className={styles.mainImage} />
          <span className={styles.typeBadge}>{property.property_type}</span>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.mainInfo}>
            <h1 className={styles.title}>{property.title}</h1>
            <p className={styles.location}>{property.address}, {property.city}, {property.state}</p>
            <div className={styles.priceTag}>₹{property.price.toLocaleString('en-IN')}</div>

            <h3>Description</h3>
            <p className={styles.description}>{property.description}</p>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.statsCard}>
              <h3>Property Details</h3>
              <ul className={styles.statsList}>
                <li><strong>Bedrooms:</strong> {property.bedrooms}</li>
                <li><strong>Bathrooms:</strong> {property.bathrooms}</li>
                <li><strong>Area:</strong> {property.square_foot} sqft</li>
                <li><strong>Parking:</strong> {!property.parking ? 'Available' : 'Not Available'}</li>
              </ul>
              <p className={styles.seller}>Listed by: <span>{property.postedBy?.name || "Unknown"}</span></p>

              {Contact ? <div className={styles.ContactInfo}>

                <a
                  href={`https://wa.me/91${property?.postedBy?.number}?text=${encodeURIComponent(
                    `Hi, I'm interested in your property: ${property.title}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp size={18} style={{ marginRight: "8px" }} />
                  Chat on WhatsApp
                </a>

                <a onClick={copyNumber}>
                  <Phone size={18} style={{ marginRight: "8px" }} />
                  Copy Number
                </a>

                <a onClick={sendMessage}>
                  <Mail size={18} style={{ marginRight: "8px" }} />
                  Send Email
                </a>

              </div> : null}

              <button className={styles.contactBtn}
                onClick={handleContact}>
                {Contact ? "Hide Contact" : "Contact Seller"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;