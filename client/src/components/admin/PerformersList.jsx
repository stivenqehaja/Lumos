import { useState, useEffect } from 'react';
import { performerAPI } from '../../services/api';
import PerformerForm from './PerformerForm';
import './PerformersList.css';

const PerformersList = ({ onClose }) => {
    const [performers, setPerformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedPerformer, setSelectedPerformer] = useState(null);

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

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this performer?')) return;

        try {
            await performerAPI.delete(id);
            fetchPerformers();
        } catch (error) {
            alert('Failed to delete performer');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedPerformer) {
                console.log('Updating performer:', selectedPerformer.id, formData);
                await performerAPI.update(selectedPerformer.id, formData);
            } else {
                console.log('Creating new performer:', formData);
                await performerAPI.create(formData);
            }
            setShowForm(false);
            setSelectedPerformer(null);
            fetchPerformers();
        } catch (error) {
            console.error('Error saving performer:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
            const statusCode = error.response?.status || 'No status';
            alert(`Failed to save performer\n\nError: ${errorMsg}\nStatus: ${statusCode}\n\nCheck browser console for details.`);
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
        </div>
    );
};

export default PerformersList;
