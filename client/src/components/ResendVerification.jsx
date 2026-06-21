import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import './VerifyEmail.css';

const ResendVerification = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/users/resend-verification`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Unable to resend verification email.');
        setMessage(data.message || 'Unable to resend verification email.');
        return;
      }

      toast.success(data.message || 'Verification email sent successfully.');
      setMessage(data.message || 'Verification email sent successfully.');
    } catch (error) {
      toast.error('Network error. Please check if the backend server is running.');
      setMessage('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h2>Resend Verification Email</h2>
        <p className="info-message">Enter your registered email address and we will send you a new verification link.</p>

        <form className="resend-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Verification Email'}
          </button>
        </form>

        {message && <p className="info-message">{message}</p>}
        <Link to="/login" className="secondary-link">Back to Login</Link>
      </div>
    </div>
  );
};

export default ResendVerification;
