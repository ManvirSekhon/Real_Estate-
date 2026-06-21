import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import Skeleton from '../../components/layout/Skeleton';
import { MdAddBusiness } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import styles from './Properties.module.css';
import NotFound from '../../components/layout/NotFound';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [deleted, setDelete] = useState(false);


    useEffect(() => {
        const getProperties = async () => {
            try {
                // const response = await axios.get('http://localhost:8000/api/property/user-properties', {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/property/user-properties`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProperties(response.data.data);
                setTimeout(() => {
                    setLoading(false);
                }, 1500);
            } catch (error) {
                console.error("Error fetching properties:", error);
                setLoading(false);
            }
        };

        setDelete(false);
        getProperties();
    }, [deleted]);

    const handleDeleteRefresh = () => {
        setLoading(true);
        setDelete(true);
    };
    return (
        <div className={styles.layout}>

            <button
                className={styles.addBtn}
                onClick={() => navigate('/dashboard/add-property')}
                title="Register New Property"
            >
                <MdAddBusiness /> <span>Add Property</span>
            </button>
            <div className={styles.propertiesGrid}>
                {
                    loading ? (
                        Array.from({ length: 10}).map((_, index) => (
                            <Skeleton key={index} />
                        ))
                    ) : properties.length > 0 ? (
                        properties.map((item) => (
                            <PropertyCard key={item._id} property={item} onDelete={handleDeleteRefresh} />
                        ))
                    ) : (
                        <NotFound />
                    )}

            </div>
        </div>
    );
};

export default Properties;