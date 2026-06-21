import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import styles from './AddProperty.module.css';
import { ArrowLeft } from 'lucide-react';

const EditProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    state: "",
    bedrooms: "",
    bathrooms: "",
    square_foot: "",
    parking: "false",
    property_type: "sale"
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Get the property ID from the URL

  // Fetch property data when the component mounts
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // const res = await fetch(`http://localhost:8000/api/property/get/${id}`);
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/property/get/${id}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch property data.');
        }
        const data = await res.json();
        // Pre-fill the form with the fetched data

        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          address: data.address,
          city: data.city,
          state: data.state,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          square_foot: data.square_foot,
          parking: String(data.parking),
          property_type: data.property_type
        });
      } catch (error) {
        console.error("Fetch Error:", error.message);
        alert("Error fetching property details. " + error.message);
        { localStorage.getItem('role') === 'admin' ? navigate('/admin_dashboard/properties') : navigate('/dashboard/properties') }
      }
    };

    fetchProperty();
  }, [id, navigate]); // Dependencies for useEffect

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newdata = new FormData();
    for (const key in formData) {
      newdata.append(key, formData[key]);
    }

    if (file) {
      newdata.append('image', file);
    }

    try {
      // Use PUT method to update the property
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/property/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: newdata
      });

      const data = await res.json();
      const role = localStorage.getItem('role');

      if (res.ok) {
        toast.success("Property updated successfully!", {
          duration: 3000,
          position: 'top-right',
        });
        setLoading(false)
        if (role === 'admin') {
          navigate('/admin_dashboard/properties');
        } else {
          navigate('/dashboard/properties');
        }
      } else {
        toast.error("Error: " + data.message, {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.log("Fetch Error:", error.message);
      alert("Network Error. Is your backend server running?");
    }
    // No need to reset form data after update, as we are navigating away.
  };

  return (
    <>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={18} style={{ marginRight: '8px' }} />
        Back
      </button>
      <div className={styles.add_property}>
        {/* <button className={styles.back} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Back
        </button> */}
        <h1>Update Property</h1>
        <form className={styles.property_form} onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Beautiful 3-bedroom apartment" required />
          </div>
          <div>
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Property description..." required />
          </div>
          <div>
            <label>Price (₹):</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="250000" required />
          </div>
          <div>
            <label>Location/Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" required />
          </div>
          <div className={styles.row}>
            <div>
              <label>City:</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div>
              <label>State:</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <label>Bedrooms:</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
            </div>
            <div>
              <label>Bathrooms:</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <label>Square Feet:</label>
              <input type="number" name="square_foot" value={formData.square_foot} onChange={handleChange} required />
            </div>
            <div>
              <label>Parking:</label>
              <select name="parking" value={formData.parking} onChange={handleChange} required>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div>
            <label>Property Type:</label>
            <select name="property_type" value={formData.property_type} onChange={handleChange}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div>
            <label>Images:</label>
            <input type="file" name="image" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <button type="submit">
            {loading ? 'Updating...' : 'Update Property'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProperty;
