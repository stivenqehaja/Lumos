import { useState, useEffect } from 'react';
import { performerAPI } from '../../services/api';
import PerformerForm from '../../components/admin/PerformerForm';
import './Performers.css';

const Performers = () => {
    const [performers, setPerformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedPerformer, setSelectedPerformer] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPerformers();
    }, []);

    const fetchPerformers = async () => {
        try {
            const response = await performerAPI.getAll();
            setPerformers(response.data.performers || []);
        } catch (err) {
            setError('Failed to load performers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedPerformer) {
                await performerAPI.update(selectedPerformer.id, formData);
            } else {
                await performerAPI.create(formData);
            }
            setShowForm(false);
            setSelectedPerformer(null);
            fetchPerformers();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save performer');
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
        } catch (err) {
            alert('Failed to delete performer');
        }
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
                                        {performer.images?.[0] ? (
                                            <img src={performer.images[0]} alt={`${performer.firstName} ${performer.lastName}`} />
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
        </div>
    );
};

export default Performers;
