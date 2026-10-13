import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="page-container">
            <div className="content-wrapper">
                <div className="dashboard-header fade-in-up">
                    <h1 className="dashboard-title">
                        Welcome back, <span style={{color: 'var(--accent-primary)'}}>{user?.username}</span>
                    </h1>
                    <p className="dashboard-subtitle">
                        Manage your casting platform from one central location
                    </p>
                </div>

                <div className="dashboard-grid">
                    <Link to="/admin/performers" className="dashboard-card card-clickable fade-in-up stagger-1">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                            </div>
                        </div>
                        <div className="card-content">
                            <h2>Performers Gallery</h2>
                            <p>Full grid view of all performers</p>
                        </div>
                        <div className="card-arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                    </Link>

                    <Link to="/admin/manage-clients" className="dashboard-card card-clickable fade-in-up stagger-2">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="card-content">
                            <h2>Manage Clients</h2>
                            <p>View and manage all client links and status</p>
                        </div>
                        <div className="card-arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                    </Link>

                    <Link to="/admin/generate-link" className="dashboard-card card-clickable fade-in-up stagger-3">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="card-content">
                            <h2>Generate Client Link</h2>
                            <p>Create secure access links for clients</p>
                        </div>
                        <div className="card-arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                    </Link>

                    <Link to="/admin/casting-orders" className="dashboard-card card-clickable fade-in-up stagger-4">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                        </div>
                        <div className="card-content">
                            <h2>Casting Orders</h2>
                            <p>View client casting selections</p>
                        </div>
                        <div className="card-arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                    </Link>

                    <div className="dashboard-card card-disabled fade-in-up stagger-5">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                        </div>
                        <div className="card-content">
                            <h2>Email Management</h2>
                            <p>Send emails to performers with AI assistance</p>
                            <span className="badge badge-warning">Coming Soon</span>
                        </div>
                    </div>

                    <Link to="/client" className="dashboard-card card-clickable fade-in-up stagger-5">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                        </div>
                        <div className="card-content">
                            <h2>Preview Client View</h2>
                            <p>See what clients see when browsing</p>
                        </div>
                        <div className="card-arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
