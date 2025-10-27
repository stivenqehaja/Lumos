import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import './ManageClients.css';

const ManageClients = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEnableModal, setShowEnableModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [customHours, setCustomHours] = useState(24);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientAPI.getAllClients();
            setClients(response.data.clients);
        } catch (error) {
            showToast('Failed to load clients', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEnableClick = (client) => {
        setSelectedClient(client);
        setCustomHours(24);
        setShowEnableModal(true);
    };

    const handleEnableClient = async () => {
        if (!selectedClient) return;

        try {
            await clientAPI.updateClientStatus(selectedClient.id, {
                customHours: parseInt(customHours)
            });
            showToast(`Link enabled for ${customHours} hours`, 'success');
            setShowEnableModal(false);
            setSelectedClient(null);
            fetchClients();
        } catch (error) {
            showToast('Failed to enable link', 'error');
        }
    };

    const handleToggleStatus = async (client) => {
        try {
            await clientAPI.updateClientStatus(client.id, {
                isActive: !client.isActive
            });
            showToast(`Client ${!client.isActive ? 'activated' : 'deactivated'}`, 'success');
            fetchClients();
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    const handleCopyLink = (url, code) => {
        navigator.clipboard.writeText(url);
        setCopiedCode(code);
        showToast('Link copied to clipboard!', 'success');
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: 'status-badge status-active',
            inactive: 'status-badge status-inactive',
            expired: 'status-badge status-expired'
        };
        return <span className={statusClasses[status]}>{status.toUpperCase()}</span>;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="page-container">
            <button
                onClick={() => navigate('/admin')}
                className="back-button"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            </button>
            <div className="content-wrapper">
                <div className="page-header">
                    <h1 className="page-title">Manage Clients</h1>
                    <button
                        className="button-primary"
                        onClick={() => navigate('/admin/generate-link')}
                    >
                        + Generate New Link
                    </button>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading clients...</div>
                ) : clients.length === 0 ? (
                    <div className="empty-state">
                        <p>No clients found</p>
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/admin/generate-link')}
                        >
                            Generate First Link
                        </button>
                    </div>
                ) : (
                    <div className="clients-table-container">
                        <table className="clients-table">
                            <thead>
                                <tr>
                                    <th>Company Name</th>
                                    <th>Access Code</th>
                                    <th>Link</th>
                                    <th>Status</th>
                                    <th>Expires At</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client) => (
                                    <tr key={client.id}>
                                        <td className="company-name">{client.companyName}</td>
                                        <td className="access-code">{client.accessCode}</td>
                                        <td className="link-cell">
                                            <div className="link-container">
                                                <span className="link-text">{client.url}</span>
                                                <button
                                                    className="copy-btn"
                                                    onClick={() => handleCopyLink(client.url, client.accessCode)}
                                                    title="Copy link"
                                                >
                                                    {copiedCode === client.accessCode ? '✓' : '📋'}
                                                </button>
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(client.status)}</td>
                                        <td className="date-cell">{formatDate(client.expiresAt)}</td>
                                        <td className="date-cell">{formatDate(client.createdAt)}</td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-enable"
                                                onClick={() => handleEnableClick(client)}
                                                title="Enable with custom hours"
                                            >
                                                Enable
                                            </button>
                                            <button
                                                className={`btn-toggle ${client.isActive ? 'btn-deactivate' : 'btn-activate'}`}
                                                onClick={() => handleToggleStatus(client)}
                                                title={client.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {client.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showEnableModal && (
                <div className="modal-overlay" onClick={() => setShowEnableModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Enable Link</h2>
                        <p>Enable link for <strong>{selectedClient?.companyName}</strong></p>
                        <div className="form-group">
                            <label htmlFor="customHours">Hours:</label>
                            <input
                                id="customHours"
                                type="number"
                                min="1"
                                max="8760"
                                value={customHours}
                                onChange={(e) => setCustomHours(e.target.value)}
                                className="hours-input"
                            />
                            <small className="help-text">Enter number of hours (1-8760)</small>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowEnableModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleEnableClient}
                            >
                                Enable Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageClients;
