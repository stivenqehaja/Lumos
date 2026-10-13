import { useState } from 'react';
import './PerformerModal.css';

const PerformerModal = ({ performer, isSelected, onToggleSelect, onClose, showSelectButton }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(performer.profileImageIndex || 0);

    const calculateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const nextImage = () => {
        if (performer.images && performer.images.length > 0) {
            setCurrentImageIndex((currentImageIndex + 1) % performer.images.length);
        }
    };

    const prevImage = () => {
        if (performer.images && performer.images.length > 0) {
            setCurrentImageIndex(
                currentImageIndex === 0 ? performer.images.length - 1 : currentImageIndex - 1
            );
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>

                <div className="modal-body">
                    {/* Image Gallery */}
                    <div className="modal-gallery">
                        {performer.images && performer.images.length > 0 ? (
                            <>
                                <img
                                    src={performer.images[currentImageIndex]}
                                    alt={`${performer.firstName} ${performer.lastName}`}
                                    className="modal-main-image"
                                />
                                {performer.images.length > 1 && (
                                    <>
                                        <button className="gallery-nav prev" onClick={prevImage}>
                                            ‹
                                        </button>
                                        <button className="gallery-nav next" onClick={nextImage}>
                                            ›
                                        </button>
                                        <div className="gallery-dots">
                                            {performer.images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="no-image-large">No Photos Available</div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="modal-details">
                        <h2 className="modal-title">
                            {performer.firstName} {performer.lastName}
                        </h2>

                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Age</span>
                                <span className="detail-value">{calculateAge(performer.birthday)} years</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Gender</span>
                                <span className="detail-value">{performer.gender}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Height</span>
                                <span className="detail-value">{performer.height} cm</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Hair Color</span>
                                <span className="detail-value">{performer.hairColor}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Eye Color</span>
                                <span className="detail-value">{performer.eyeColor}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Skin Tone</span>
                                <span className="detail-value">{performer.skinTone}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">{performer.email}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Phone</span>
                                <span className="detail-value">{performer.phone}</span>
                            </div>
                        </div>

                        {performer.distinctiveMarks && (
                            <div className="detail-full">
                                <span className="detail-label">Distinctive Marks</span>
                                <p className="detail-value">{performer.distinctiveMarks}</p>
                            </div>
                        )}

                        {showSelectButton && (
                            <button
                                onClick={onToggleSelect}
                                className={`modal-select-btn ${isSelected ? 'selected' : ''}`}
                            >
                                {isSelected ? (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        Selected
                                    </>
                                ) : (
                                    'Select for Casting'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformerModal;
