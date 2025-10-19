import { useState } from 'react';
import { clientAPI } from '../../services/api';
import './ClientLinkGenerator.css';

const ClientLinkGenerator = ({ onClose }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        commercialDescription: '',
    });
    const [generatedLink, setGeneratedLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await clientAPI.generateLink(formData);
            const accessCode = response.data.accessCode;
            const link = `${window.location.origin}/client?code=${accessCode}`;
            setGeneratedLink(link);
        } catch (error) {
            alert('Failed to generate client link');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content client-link-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>

                <h2 className="modal-title">Generate Client Link</h2>

                {!generatedLink ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="companyName">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                className="form-input"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="commercialDescription">
                                Commercial Description *
                            </label>
                            <textarea
                                id="commercialDescription"
                                name="commercialDescription"
                                className="form-textarea"
                                value={formData.commercialDescription}
                                onChange={handleChange}
                                placeholder="Describe the commercial project..."
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={onClose}
                                className="button-secondary"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="button-primary"
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Link'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="link-result">
                        <p className="success-message">
                            Client link generated successfully! This link expires in 24 hours.
                        </p>

                        <div className="link-display">
                            <input
                                type="text"
                                value={generatedLink}
                                readOnly
                                className="form-input"
                            />
                            <button onClick={copyToClipboard} className="button-primary">
                                Copy Link
                            </button>
                        </div>

                        <div className="client-info">
                            <h3>Client Information</h3>
                            <p><strong>Company:</strong> {formData.companyName}</p>
                            <p><strong>Project:</strong> {formData.commercialDescription}</p>
                        </div>

                        <button onClick={onClose} className="button-normal">
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientLinkGenerator;
