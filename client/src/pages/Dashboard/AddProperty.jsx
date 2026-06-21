import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import styles from './AddProperty.module.css';

const AddProperty = () => {
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
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loading) return;
    setLoading(true);

    
    const uploadData = new FormData();

    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    })

    uploadData.append('image', image);


    try {
      // const res = await fetch('http://localhost:8000/api/property/add', {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/property/add`, {
        method: 'POST',
        headers: {
          // 'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadData
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Property added successfully!");
        navigate('/dashboard/properties');
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.log("Fetch Error:", error.message);
      alert("Network Error. Is your backend server running?");
    } finally {
      setLoading(false);
    }

    setFormData({
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
    })
  };

  return (
    <div className={styles.add_property}>
      <h1>Add New Property</h1>
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
          <label>Price ($):</label>
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
          <label>Property Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button type="submit">
          {loading ? 'Uploading...' : 'Add Property'}
          </button>
      </form>
    </div>
  );
};

export default AddProperty;
