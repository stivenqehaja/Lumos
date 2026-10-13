import { useNavigate } from 'react-router-dom';
import './ExpiredLink.css';

const ExpiredLink = () => {
    const navigate = useNavigate();

    return (
        <div className="expired-page">
            <div className="expired-container">
                <div className="expired-icon">⏱️</div>
                <h1 className="expired-title">Access Expired</h1>
                <p className="expired-message">
                    Your access link has expired or is no longer valid.
                </p>
                <p className="expired-submessage">
                    Please contact the administrator to request a new access link and continue browsing the talent roster.
                </p>

                <div className="expired-actions">
                    <button onClick={() => navigate('/')} className="button-primary">
                        Go to Home
                    </button>
                    <button onClick={() => navigate('/contact')} className="button-secondary">
                        Contact Us
                    </button>
                </div>

                <div className="expired-info">
                    <h3>Need Help?</h3>
                    <p>If you believe this is an error or need immediate assistance, please reach out to the administrator who sent you the original link.</p>
                </div>
            </div>
        </div>
    );
};

export default ExpiredLink;
