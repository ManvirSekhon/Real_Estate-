import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorCode, setErrorCode] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL || '';
        const response = await fetch(`${baseUrl}/api/users/verify-email/${userId}/${token}`);
        const data = await response.json();

        if (!response.ok) {
          setSuccess(false);
          setMessage(data.message || 'Email verification failed. Please try again.');
          setErrorCode(data.code || '');
          return;
        }

        setSuccess(true);
        setMessage(data.message || 'Email verified successfully! You can now login.');

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setSuccess(false);
        setMessage('Network error. Please check if the backend server is running and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      verifyEmail();
    } else {
      setLoading(false);
      setSuccess(false);
      setMessage('Invalid verification link.');
    }
  }, [userId, token, navigate]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Verifying your email address...</p>
          </div>
        ) : success ? (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h2>Email Verified!</h2>
            <p className="success-message">{message}</p>
            <p className="redirect-message">Redirecting to login in 3 seconds...</p>
            <Link to="/login" className="btn-primary">Go to Login Now</Link>
          </div>
        ) : (
          <div className="error-state">
            <div className="error-icon">✕</div>
            <h2>Verification Failed</h2>
            <p className="error-message">{message}</p>
            {errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN' ? (
              <Link to="/resend-verification" className="btn-primary">Resend Verification Email</Link>
            ) : (
              <Link to="/register" className="btn-primary">Register Again</Link>
            )}
            <p className="help-text">Need help? Contact support from the website.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
