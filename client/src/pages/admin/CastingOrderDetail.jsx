import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import './CastingOrderDetail.css';

const CastingOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await clientAPI.getCastingOrderById(id);
            setOrder(response.data);
        } catch (err) {
            setError('Failed to load casting order details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading order details...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="page-container">
                <div className="error-message show">{error || 'Order not found'}</div>
                <button onClick={() => navigate('/admin/casting-orders')} className="button-secondary">
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="content-wrapper">
                <button
                    onClick={() => navigate('/admin/casting-orders')}
                    className="back-button"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>

                <div className="order-detail-header">
                    <h1 className="page-title">{order.companyName}</h1>
                    <p className="order-finalized-date">
                        Finalized on {formatDateTime(order.createdAt)}
                    </p>
                </div>

                <div className="order-info-section">
                    <div className="info-card">
                        <h2 className="section-title">Commercial Description</h2>
                        <p className="commercial-description">{order.commercialDescription}</p>
                    </div>

                    <div className="info-card">
                        <h2 className="section-title">
                            Selected Performers ({order.selectedPerformers?.length || 0})
                        </h2>
                    </div>
                </div>

                <div className="performers-grid">
                    {order.selectedPerformers && order.selectedPerformers.length > 0 ? (
                        order.selectedPerformers.map((performer) => (
                            <div key={performer.id} className="performer-detail-card">
                                <div className="performer-image">
                                    {performer.images && performer.images.length > 0 ? (
                                        <img
                                            src={performer.images[performer.profileImageIndex || 0]}
                                            alt={`${performer.firstName} ${performer.lastName}`}
                                        />
                                    ) : (
                                        <div className="no-image">No Photo</div>
                                    )}
                                </div>
                                <div className="performer-info">
                                    <h3>{performer.firstName} {performer.lastName}</h3>
                                    <div className="performer-details">
                                        <span>{performer.gender}</span>
                                        <span>•</span>
                                        <span>{calculateAge(performer.birthday)} yrs</span>
                                        <span>•</span>
                                        <span>{performer.height}cm</span>
                                    </div>
                                    <div className="performer-attributes">
                                        <span>{performer.hairColor} hair</span>
                                        <span>•</span>
                                        <span>{performer.eyeColor} eyes</span>
                                    </div>
                                    <div className="performer-contact">
                                        <p>{performer.email}</p>
                                        <p>{performer.phone}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No performers selected for this order</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CastingOrderDetail;
