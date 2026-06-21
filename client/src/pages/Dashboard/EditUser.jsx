import React from 'react'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import styles from '../Style/Register.module.css'
import { ArrowLeft } from 'lucide-react'


const EditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        number: "",
        city: "",
        state: "",
        zipcode: ""
    })

    const getaddress = localStorage.getItem('role') === 'admin' ? 'api/admin/edituser' : 'api/users/getuser';
    const putaddress = localStorage.getItem('role') === 'admin' ? 'api/admin/updateuser' : 'api/users/edituser';


    useEffect(() => {
        const fetchUser = async () => {
            try {
                // const res = await fetch(`http://localhost:8000/api/admin/edituser/${id}`, {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/${getaddress}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })

                const data = await res.json();
                if (res.ok) {
                    setFormData({
                        name: data.data.name || "",
                        email: data.data.email || "",
                        password: "", // Usually keep password empty for security
                        number: data.data.number || "",
                        city: data.data.city || "",
                        state: data.data.state || "",
                        zipcode: data.data.zipcode || ""
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch user data.');
                }
            } catch (error) {
                toast.error(error.message);
                { localStorage.getItem('role') === 'admin' ? navigate('/admin_dashboard/users') : navigate('/dashboard') };
            }
        };
        fetchUser();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/${putaddress}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            if (res.ok) {
                toast.success('User updated successfully.');


                { localStorage.getItem('role') === 'admin' ? navigate('/admin_dashboard/users') : navigate('/dashboard') };

            } else {
                throw new Error(data.message || 'Failed to update user.');
            }
        } catch (error) {
            toast.error(error.message);
        }

    }
    return (
        <div className={styles.register}>
            <button className={styles.back} onClick={() => navigate(-1)}>
                <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                Back
            </button>
            <form className={styles.register_form} onSubmit={handleSubmit}>
                <h1>Update User</h1>
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

                <button>Update</button>
            </form>
        </div>
    )
}

export default EditUser