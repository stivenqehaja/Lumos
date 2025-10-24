import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { performerAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import PerformerForm from '../../components/admin/PerformerForm';
import ConfirmModal from '../../components/common/ConfirmModal';
import './Performers.css';

const Performers = () => {
    const navigate = useNavigate();
    const { showSuccess, showError, showDelete } = useToast();
    const [performers, setPerformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedPerformer, setSelectedPerformer] = useState(null);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, performerId: null, step: 1 });
    const [deletedPerformer, setDeletedPerformer] = useState(null);

    useEffect(() => {
        fetchPerformers();
    }, []);

    const fetchPerformers = async () => {
        try {
            const response = await performerAPI.getAll();
            setPerformers(response.data || []);
        } catch (err) {
            setError('Failed to load performers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedPerformer) {
                console.log('Updating performer:', selectedPerformer.id, formData);
                await performerAPI.update(selectedPerformer.id, formData);
                showSuccess('Performer updated successfully!');
            } else {
                console.log('Creating new performer:', formData);
                await performerAPI.create(formData);
                showSuccess('Performer created successfully!');
            }
            setShowForm(false);
            setSelectedPerformer(null);
            fetchPerformers();
        } catch (err) {
            console.error('Error saving performer:', err);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to save performer';
            showError(errorMsg);
        }
    };

    const handleEdit = (performer) => {
        setSelectedPerformer(performer);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setDeleteConfirm({ isOpen: true, performerId: id, step: 1 });
    };

    const handleFirstConfirm = () => {
        // Move to step 2 (double-check)
        setDeleteConfirm(prev => ({ ...prev, step: 2 }));
    };

    const handleFinalConfirm = async () => {
        const { performerId } = deleteConfirm;
        setDeleteConfirm({ isOpen: false, performerId: null, step: 1 });

        // Find and store the performer data before deletion
        const performerToDelete = performers.find(p => p.id === performerId);
        setDeletedPerformer(performerToDelete);

        try {
            await performerAPI.delete(performerId);
            // Remove from UI immediately
            setPerformers(prev => prev.filter(p => p.id !== performerId));

            // Show delete toast with undo functionality
            showDelete(
                `${performerToDelete.firstName} ${performerToDelete.lastName} has been deleted`,
                async () => {
                    try {
                        // Restore the performer
                        const restored = await performerAPI.create(performerToDelete);
                        setPerformers(prev => [...prev, restored.data]);
                        showSuccess('Performer restored successfully!');
                        setDeletedPerformer(null);
                    } catch (err) {
                        showError('Failed to restore performer');
                        // Refresh to get accurate state
                        fetchPerformers();
                    }
                }
            );
        } catch (err) {
            showError('Failed to delete performer');
            setDeletedPerformer(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ isOpen: false, performerId: null, step: 1 });
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedPerformer(null);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading performers...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="content-wrapper">
                {showForm ? (
                    <PerformerForm
                        performer={selectedPerformer}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                ) : (
                    <>
                        <button
                            onClick={() => navigate('/admin')}
                            className="back-button"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                            Back
                        </button>
                        <div className="performers-header">
                            <h1 className="page-title">Performers</h1>
                            <button
                                onClick={() => setShowForm(true)}
                                className="button-primary"
                            >
                                Add Performer
                            </button>
                        </div>

                        {error && <div className="error-message show">{error}</div>}

                        <div className="performers-grid">
                            {performers.map((performer) => (
                                <div key={performer.id} className="performer-card">
                                    <div className="performer-image">
                                        {performer.images?.length > 0 ? (
                                            <img src={performer.images[performer.profileImageIndex || 0]} alt={`${performer.firstName} ${performer.lastName}`} />
                                        ) : (
                                            <div className="no-image">No Photo</div>
                                        )}
                                    </div>
                                    <div className="performer-info">
                                        <h3>{performer.firstName} {performer.lastName}</h3>
                                        <p>{performer.gender} • {performer.height}cm</p>
                                        <p>{performer.email}</p>
                                    </div>
                                    <div className="performer-actions">
                                        <button
                                            onClick={() => handleEdit(performer)}
                                            className="button-secondary"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(performer.id)}
                                            className="button-secondary"
                                            style={{ color: 'var(--accent-primary)' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {performers.length === 0 && (
                            <div className="empty-state">
                                <p>No performers yet. Add your first performer!</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* First confirmation */}
            <ConfirmModal
                isOpen={deleteConfirm.isOpen && deleteConfirm.step === 1}
                title="Delete Performer"
                message="Are you sure you want to delete this performer?"
                confirmText="Yes"
                cancelText="No"
                onConfirm={handleFirstConfirm}
                onCancel={cancelDelete}
                danger={true}
            />

            {/* Second confirmation (double-check) */}
            <ConfirmModal
                isOpen={deleteConfirm.isOpen && deleteConfirm.step === 2}
                title="Confirm Deletion"
                message="This action is permanent and cannot be undone. Are you absolutely sure you want to delete this performer?"
                confirmText="Yes, Delete Permanently"
                cancelText="No, Go Back"
                onConfirm={handleFinalConfirm}
                onCancel={cancelDelete}
                danger={true}
            />
        </div>
    );
};

export default Performers;
