import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="page-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <div className="loading" style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '1.5rem',
                    color: 'var(--accent-primary)'
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
