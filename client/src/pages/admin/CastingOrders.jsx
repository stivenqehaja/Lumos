import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';

const CastingOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await clientAPI.getCastingOrders();
            setOrders(response.data.orders || []);
        } catch (err) {
            console.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleOrderClick = (orderId) => {
        navigate(`/admin/casting-orders/${orderId}`);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading casting orders...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="content-wrapper">
                <button
                    onClick={() => navigate('/admin')}
                    className="back-button"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h1 className="page-title">Casting Orders</h1>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <p>No casting orders yet.</p>
                    </div>
                ) : (
                    <div className="grid-2">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="card card-clickable"
                                onClick={() => handleOrderClick(order.id)}
                            >
                                <h3 style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    color: 'var(--accent-primary)',
                                    marginBottom: '1rem'
                                }}>
                                    {order.companyName}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {order.commercialDescription}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                                    {order.selectedPerformers?.length || 0} performers selected
                                </p>
                                <p style={{
                                    color: 'var(--accent-primary)',
                                    fontSize: '0.85rem',
                                    fontFamily: 'Orbitron, sans-serif',
                                    fontWeight: '500'
                                }}>
                                    Finalized: {formatDateTime(order.createdAt)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CastingOrders;
