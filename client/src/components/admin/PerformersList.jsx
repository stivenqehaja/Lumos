import { useState, useEffect } from 'react';
import { performerAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import PerformerForm from './PerformerForm';
import ConfirmModal from '../common/ConfirmModal';
import './PerformersList.css';

const PerformersList = ({ onClose }) => {
    const { showSuccess, showError, showDelete } = useToast();
    const [performers, setPerformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedPerformer, setSelectedPerformer] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, performerId: null, step: 1 });
    const [deletedPerformer, setDeletedPerformer] = useState(null);

    useEffect(() => {
        fetchPerformers();
    }, []);

    const fetchPerformers = async () => {
        try {
            const response = await performerAPI.getAll();
            setPerformers(response.data || []);
        } catch (error) {
            console.error('Failed to load performers');
        } finally {
            setLoading(false);
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
                    } catch (error) {
                        showError('Failed to restore performer');
                        // Refresh to get accurate state
                        fetchPerformers();
                    }
                }
            );
        } catch (error) {
            showError('Failed to delete performer');
            setDeletedPerformer(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ isOpen: false, performerId: null, step: 1 });
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
        } catch (error) {
            console.error('Error saving performer:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Failed to save performer';
            showError(errorMsg);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedPerformer(null);
    };

    if (showForm) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content performers-modal-large" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose}>×</button>
                    <PerformerForm
                        performer={selectedPerformer}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content performers-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="performers-modal-header">
                    <h2 className="modal-title">Manage Performers</h2>
                    <button onClick={() => setShowForm(true)} className="button-primary">
                        Add New Performer
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading performers...</div>
                ) : (
                    <>
                        <div className="performers-count">
                            Total Performers: <span className="count-badge">{performers.length}</span>
                        </div>

                        <div className="performers-list">
                            {performers.map((performer) => (
                                <div key={performer.id} className="performer-list-item">
                                    <div className="performer-thumb">
                                        {performer.images?.length > 0 ? (
                                            <img src={performer.images[performer.profileImageIndex || 0]} alt={performer.firstName} />
                                        ) : (
                                            <div className="no-thumb">No Photo</div>
                                        )}
                                    </div>

                                    <div className="performer-details-compact">
                                        <h3>{performer.firstName} {performer.lastName}</h3>
                                        <div className="performer-meta">
                                            <span>{performer.gender}</span>
                                            <span>•</span>
                                            <span>{performer.height}cm</span>
                                            <span>•</span>
                                            <span>{performer.hairColor}</span>
                                            <span>•</span>
                                            <span>{performer.eyeColor}</span>
                                        </div>
                                        <div className="performer-contact">
                                            <span>{performer.email}</span>
                                        </div>
                                    </div>

                                    <div className="performer-actions-compact">
                                        <button
                                            onClick={() => handleEdit(performer)}
                                            className="button-secondary"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(performer.id)}
                                            className="button-danger"
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
                                <button onClick={() => setShowForm(true)} className="button-primary">
                                    Add Performer
                                </button>
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

export default PerformersList;
