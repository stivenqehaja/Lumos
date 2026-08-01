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
    const [editingClientId, setEditingClientId] = useState(null);
    const [editedName, setEditedName] = useState('');

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

    const handleStartEdit = (client) => {
        setEditingClientId(client.id);
        setEditedName(client.companyName);
    };

    const handleCancelEdit = () => {
        setEditingClientId(null);
        setEditedName('');
    };

    const handleSaveEdit = async (clientId) => {
        if (!editedName.trim()) {
            showToast('Company name cannot be empty', 'error');
            return;
        }

        try {
            await clientAPI.updateClientStatus(clientId, {
                companyName: editedName.trim()
            });
            showToast('Company name updated successfully', 'success');
            setEditingClientId(null);
            setEditedName('');
            fetchClients();
        } catch (error) {
            showToast('Failed to update company name', 'error');
        }
    };

    return (
        <div className="page-container manage-clients">
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
                <div className="manage-clients-header">
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
                                    <th>Status</th>
                                    <th>Expires At</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client) => (
                                    <tr key={client.id}>
                                        <td className="company-name-cell">
                                            {editingClientId === client.id ? (
                                                <div className="edit-name-container">
                                                    <input
                                                        type="text"
                                                        className="edit-name-input"
                                                        value={editedName}
                                                        onChange={(e) => setEditedName(e.target.value)}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') handleSaveEdit(client.id);
                                                            if (e.key === 'Escape') handleCancelEdit();
                                                        }}
                                                        autoFocus
                                                    />
                                                    <button
                                                        className="edit-btn save-btn"
                                                        onClick={() => handleSaveEdit(client.id)}
                                                        title="Save"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="edit-btn cancel-btn"
                                                        onClick={handleCancelEdit}
                                                        title="Cancel"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="company-name-display">
                                                    <span className="company-name">{client.companyName}</span>
                                                    <button
                                                        className="edit-name-btn"
                                                        onClick={() => handleStartEdit(client)}
                                                        title="Edit company name"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="access-code-cell">
                                            <div className="access-code-container">
                                                <span className="access-code">{client.accessCode}</span>
                                                <button
                                                    className="copy-btn-prominent"
                                                    onClick={() => handleCopyLink(client.url, client.accessCode)}
                                                    title="Copy access link"
                                                >
                                                    {copiedCode === client.accessCode ? (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    ) : (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                        </svg>
                                                    )}
                                                    <span className="copy-text">Copy</span>
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
