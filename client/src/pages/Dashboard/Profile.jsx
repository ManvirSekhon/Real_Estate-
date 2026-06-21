import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Settings } from 'lucide-react';
import './Profile.css'
import profileImage from '../../assets/profile_image.webp';
import { Camera, Home, Star, MessageCircle } from 'lucide-react';


const Profile = () => {
    const getColor = (name) => {
        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const [preview, setPreview] = useState(null);
    const [user, setUser] = useState(null);

    const [stats, setStats] = useState({
        properties: 0,
        bookmarks: 0,
        revenue: 0,
        messages: 0
    });
    const navigate = useNavigate();
    const [setting, setSetting] = useState(false);

    // const [userName, setUserName] = useState('');

    // fetch the user for avatar
    useEffect(() => {
        const rawId = localStorage.getItem('userId');
        const cleanId = rawId.replace(/['"]+/g, '');
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/api/users/getuser/${cleanId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const data = await res.json();

                console.log(data.data.name);


                setUser(data.data);

            } catch (err) {
                console.error(err);
            }
        };

        const fetchStats = async () => {
            try {
                const statRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/stat`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const statData = await statRes.json();

                setStats({
                    properties: statData.data.totalProperties,
                    bookmarks: statData.data.totalBookmarks,
                    revenue: statData.data.totalCost,
                    messages: statData.data.totalQueries
                })
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchStats();

        fetchUser();
    }, []);

    const [recentActivity, setRecentActivity] = useState([
        { id: 1, type: 'booking', text: 'New booking from John Doe - Ocean View Villa', time: '2h ago' },
        { id: 2, type: 'message', text: 'New inquiry about Downtown Apartment', time: '5h ago' },
        { id: 3, type: 'payment', text: 'Payment received for Property #123', time: '1d ago' }
    ]);

    const handleSetting = () => {
        setSetting(!setting);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        navigate('/login');
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        const rawId = localStorage.getItem('userId');
        const cleanId = rawId.replace(/['"]+/g, '');
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/${cleanId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                localStorage.removeItem('role');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/');
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleEditProfile = () => {

        const rawId = localStorage.getItem('userId');
        const cleanId = rawId.replace(/['"]+/g, '');
        console.log(cleanId);
        navigate(`/dashboard/users/edit/${cleanId}`);
    }

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // preview instantly
        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/users/avatar`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: formData
                }
            );

            const result = await res.json();

            // depending on your backend structure
            const updatedUser = result.data || result;

            // 🔥 update UI
            setUser(updatedUser);

        } catch (err) {
            console.error(err);
        }
    };

    const firstletter = user?.name?.charAt(0).toUpperCase();


    return (
        <div className="dashboard-home">

            <div className="profile-header">
                <div
                    className="profile_image"
                >
                    {preview || user?.avatar ? (
                        <img
                            src={preview || user?.avatar}
                            alt="profile"
                            className="avatar-img"
                        />
                    ) : (
                        <div className="avatar-placeholder"
                            style={{ background: getColor(user?.name) }}>
                            {firstletter}
                        </div>
                    )}

                    {/* Hidden input */}
                    <input
                        type="file"
                        id="avatarInput"
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                    />

                    {/* Camera overlay */}
                    <label htmlFor="avatarInput" className="avatar-overlay">
                        <Camera size={24} />
                    </label>
                </div>

                <section className='user_info'>
                    <h3>{user?.name || 'User'}</h3>
                    <h4 className="profile_role">{localStorage.getItem('role') || 'Role'}</h4>
                </section>
                <div className='settingsIcon' >
                    <Settings onClick={handleSetting} />
                    {setting ? <div className='settings'>
                        <li onClick={handleEditProfile}>Edit Profile</li>
                        <li className='logout' onClick={handleLogout}>Logout</li>
                        <li className='deleteAccount' onClick={handleDelete}>Delete Account</li>
                    </div> : null
                    }
                </div>
            </div>

            {/* Stats Cards */}
            <section className="stats-grid mb-8">
                <div className="stat-card stat-properties">
                    <div className="stat-number">{stats.properties}</div>
                    <div className="stat-label">Total Properties</div>
                </div>
                <div className="stat-card stat-bookings">
                    <div className="stat-number">{stats.bookmarks}</div>
                    <div className="stat-label">Active BookMarks</div>
                </div>
                <div className="stat-card stat-revenue">
                    <div className="stat-number">₹{stats.revenue.toLocaleString()}</div>
                    <div className="stat-label">Total Cost</div>
                </div>
                <div className="stat-card stat-messages">
                    <div className="stat-number">{stats.messages}</div>
                    <div className="stat-label">New Messages</div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions mb-8">
                <Link to="/dashboard/properties" className="quick-action manage-properties">
                    <div className="quick-icon">
                        <Home />
                    </div>
                    <div>
                        <h3>Manage Properties</h3>
                        <p>View, edit, add listings</p>
                    </div>
                </Link>
                <Link to="/dashboard/Bookmarks" className="quick-action bookings">
                    <div className="quick-icon">
                        <Star />
                    </div>
                    <div>
                        <h3>Bookmark</h3>
                        <p>Manage favourite</p>
                    </div>
                </Link>
                <Link to="/Messages" className="quick-action messages">
                    <div className="quick-icon">
                        <MessageCircle />
                    </div>
                    <div>
                        <h3>Messages</h3>
                        <p>Query History</p>
                    </div>
                </Link>
            </section>

        </div>
    );
};

export default Profile;