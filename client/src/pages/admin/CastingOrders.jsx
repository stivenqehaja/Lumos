import { useState, useEffect } from 'react';
import { clientAPI } from '../../services/api';

const CastingOrders = () => {
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
                <h1 className="page-title">Casting Orders</h1>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <p>No casting orders yet.</p>
                    </div>
                ) : (
                    <div className="grid-2">
                        {orders.map((order) => (
                            <div key={order.id} className="card">
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
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {order.selectedPerformers?.length || 0} performers selected
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
