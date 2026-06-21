import React from 'react';
import { useState, useEffect } from 'react';
import QueryCard from '../../components/layout/QueryCard'
import styles from './Messages.module.css';


const Messages = () => {
    const [queries, setQueries] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/api/users/my-queries`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => setQueries(data));
    }, []);

    return (
        <>
            <div className={styles.title}>My Messages History</div>
            {queries .slice().reverse().map((q) => (
                <QueryCard key={q._id} query={q} />
            ))}
        </>

    )
}

export default Messages