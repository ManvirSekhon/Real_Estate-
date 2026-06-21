import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import styles from './Style/Login.module.css'


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json();

            // Log the response to see exactly what the backend returned
            console.log("Login response data:", data);

            if (res.ok) {
                const userName = data.data.name || "User";
                const userId = data.data.id;
                const email = data.data.email;
                const number = data.data.number;

                console.log(userId);
                localStorage.setItem('userId', userId);
                localStorage.setItem('user', JSON.stringify(userName));
                localStorage.setItem('email', email);
                localStorage.setItem('number', number);
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.data.role);
                // alert("Login Successfull");
                // alert(`Welcome, ${localStorage.getItem('role')}!`);

                toast.success(`Welcome, ${userName}!`, {
                    duration: 3000,
                    position: 'top-right',
                });
                { localStorage.getItem('role') === 'admin' ? navigate('/admin_dashboard') : navigate('/dashboard'); }
            } else {
                toast.error(data.message || 'Login failed', {
                    duration: 3000,
                    position: 'top-right',
                });

                if (data.code === 'EMAIL_NOT_VERIFIED') {
                    navigate('/resend-verification', { state: { email } });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className={styles.login}>
            <button className={styles.back} onClick={() => navigate(-1)}>
                <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                Back
            </button>
            <form onSubmit={handleSubmit} className={styles.login_form}>
                <h1>Login</h1>
                <div>
                    <label htmlFor="email">Enter your Email: </label>
                    <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>

                <div>
                    <label htmlFor="password">Enter your Password:</label>
                    <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login