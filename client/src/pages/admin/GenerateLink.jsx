import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import './GenerateLink.css';

const GenerateLink = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingClients, setLoadingClients] = useState(true);
    const [showNewClientModal, setShowNewClientModal] = useState(false);

    const [formData, setFormData] = useState({
        companyName: '',
        commercialDescription: '',
        customHours: 24
    });

    const [newClientData, setNewClientData] = useState({
        companyName: '',
        commercialDescription: '',
        customHours: 24
    });

    const [generatedLink, setGeneratedLink] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoadingClients(true);
            const response = await clientAPI.getAllClients();
            setClients(response.data.clients);
        } catch (error) {
            showToast('Failed to load clients', 'error');
        } finally {
            setLoadingClients(false);
        }
    };

    const handleCompanyChange = (e) => {
        const value = e.target.value;

        if (value === '__ADD_NEW__') {
            setShowNewClientModal(true);
            setFormData({ ...formData, companyName: '' });
        } else if (value) {
            const selectedClient = clients.find(c => c.companyName === value);
            setFormData({
                companyName: value,
                commercialDescription: selectedClient?.commercialDescription || '',
                customHours: 24
            });
        } else {
            setFormData({ ...formData, companyName: value });
        }
    };

    const handleCreateNewClient = async () => {
        if (!newClientData.companyName.trim() || !newClientData.commercialDescription.trim()) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await clientAPI.generateLink(newClientData);
            setGeneratedLink(response.data);
            showToast('Client link generated successfully!', 'success');
            setShowNewClientModal(false);
            setNewClientData({
                companyName: '',
                commercialDescription: '',
                customHours: 24
            });
            fetchClients();
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to generate link', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.companyName.trim() || !formData.commercialDescription.trim()) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await clientAPI.generateLink(formData);
            setGeneratedLink(response.data);
            showToast('Link generated successfully!', 'success');
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to generate link', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink.url);
            showToast('Link copied to clipboard!', 'success');
        }
    };

    const handleReset = () => {
        setFormData({
            companyName: '',
            commercialDescription: '',
            customHours: 24
        });
        setGeneratedLink(null);
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
                <h1 className="page-title">Generate Client Link</h1>

                {!generatedLink ? (
                    <div className="form-card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="companyName">Company Name *</label>
                                <select
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={handleCompanyChange}
                                    required
                                    disabled={loadingClients}
                                >
                                    <option value="">Select a company...</option>
                                    <option value="__ADD_NEW__">+ Add New Client</option>
                                    <optgroup label="Existing Clients">
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.companyName}>
                                                {client.companyName}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="commercialDescription">Commercial Description *</label>
                                <textarea
                                    id="commercialDescription"
                                    value={formData.commercialDescription}
                                    onChange={(e) =>
                                        setFormData({ ...formData, commercialDescription: e.target.value })
                                    }
                                    placeholder="Describe the commercial project..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="customHours">Link Validity (Hours) *</label>
                                <input
                                    id="customHours"
                                    type="number"
                                    min="1"
                                    max="8760"
                                    value={formData.customHours}
                                    onChange={(e) =>
                                        setFormData({ ...formData, customHours: parseInt(e.target.value) })
                                    }
                                    required
                                />
                                <small className="help-text">Default: 24 hours (max: 8760)</small>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="button-secondary"
                                    onClick={() => navigate('/admin/manage-clients')}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="button-primary" disabled={loading}>
                                    {loading ? 'Generating...' : 'Generate Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="result-card">
                        <div className="success-icon">✓</div>
                        <h2>Link Generated Successfully!</h2>

                        <div className="result-details">
                            <div className="detail-item">
                                <label>Company Name:</label>
                                <span>{generatedLink.client.companyName}</span>
                            </div>
                            <div className="detail-item">
                                <label>Access Code:</label>
                                <span className="access-code">{generatedLink.accessCode}</span>
                            </div>
                            <div className="detail-item">
                                <label>Expires At:</label>
                                <span>
                                    {new Date(generatedLink.client.expiresAt).toLocaleString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="link-box">
                            <input type="text" value={generatedLink.url} readOnly />
                            <button onClick={handleCopyLink} className="copy-button">
                                Copy Link
                            </button>
                        </div>

                        <div className="result-actions">
                            <button className="button-secondary" onClick={handleReset}>
                                Generate Another
                            </button>
                            <button
                                className="button-primary"
                                onClick={() => navigate('/admin/manage-clients')}
                            >
                                View All Clients
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* New Client Modal */}
            {showNewClientModal && (
                <div className="modal-overlay" onClick={() => setShowNewClientModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Client</h2>
                        <div className="form-group">
                            <label htmlFor="newCompanyName">Company Name *</label>
                            <input
                                id="newCompanyName"
                                type="text"
                                value={newClientData.companyName}
                                onChange={(e) =>
                                    setNewClientData({ ...newClientData, companyName: e.target.value })
                                }
                                placeholder="Enter company name..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newCommercialDescription">Commercial Description *</label>
                            <textarea
                                id="newCommercialDescription"
                                value={newClientData.commercialDescription}
                                onChange={(e) =>
                                    setNewClientData({
                                        ...newClientData,
                                        commercialDescription: e.target.value
                                    })
                                }
                                placeholder="Describe the commercial project..."
                                rows="4"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newCustomHours">Link Validity (Hours) *</label>
                            <input
                                id="newCustomHours"
                                type="number"
                                min="1"
                                max="8760"
                                value={newClientData.customHours}
                                onChange={(e) =>
                                    setNewClientData({
                                        ...newClientData,
                                        customHours: parseInt(e.target.value)
                                    })
                                }
                            />
                            <small className="help-text">Default: 24 hours</small>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="button-secondary"
                                onClick={() => setShowNewClientModal(false)}
                            >
                                Cancel
                            </button>
                            <button className="button-primary" onClick={handleCreateNewClient} disabled={loading}>
                                {loading ? 'Creating...' : 'Create Client & Generate Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerateLink;
