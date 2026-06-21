import React from 'react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import styles from './Style/Register.module.css'

const Register = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    city: "",
    state: "",
    zipcode: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const res = await fetch('http://localhost:8000/api/users/create', {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/create`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();

      if (res.ok) {
        setFormData({
          name: "",
          email: "",
          password: "",
          number: "",
          city: "",
          state: "",
          zipcode: ""
        });

        if(localStorage.getItem('role') === 'admin'){
          navigate('/admin_dashboard/users');
        }else{
          navigate('/login');
        }
        toast.success(data.message || "Registration successful! Please check your email to verify your account.");
      } else {
        toast.error(data.message || "Registration failed. Please try again.", {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.log("Fetch Error:", error.message);
      alert("Network Error. Is your backend server running?");
    }
  }


  return (
    <div className={styles.register}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={18} style={{ marginRight: '8px' }} />
        Back
      </button>
      <form className={styles.register_form} onSubmit={handleSubmit}>
        <h1>Register</h1>
        <div>
          <label htmlFor="name">Enter your Name: </label>
          <input type="text" id='name' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder='Name' required />
        </div>
        <div>
          <label htmlFor="email">Enter your Email: </label>
          <input type="email" id='email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder='Email' required />
        </div>
        <div>
          <label htmlFor="password">Enter Your Password</label>
          <input type="password" id='password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder='Password' required />
        </div>
        <div>
          <label htmlFor="phone">Enter your Number</label>
          <input type="number" id='phone' value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} placeholder='number' required />
        </div>
        <div>
          <label htmlFor="city">Enter your City: </label>
          <input type="text" id='city' value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder='City' required />
        </div>
        <div>
          <label htmlFor="state">Enter your State: </label>
          <input type="text" id='state' value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder='State' required />
        </div>
        <div>
          <label htmlFor="zipcode">Enter your ZipCode: </label>
          <input type="number" id='zipcode' value={formData.zipcode} onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })} placeholder='ZipCode' required />
        </div>

        <button>Register</button>
      </form>
    </div>
  )
}

export default Register