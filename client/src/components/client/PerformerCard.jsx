import './PerformerCard.css';

const PerformerCard = ({ performer, isSelected, onToggleSelect, onViewDetails, showSelectButton }) => {
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

    return (
        <div className={`performer-card ${isSelected ? 'selected' : ''}`}>
            <div className="performer-image" onClick={onViewDetails}>
                {performer.images && performer.images.length > 0 ? (
                    <img src={performer.images[performer.profileImageIndex || 0]} alt={`${performer.firstName} ${performer.lastName}`} />
                ) : (
                    <div className="no-image">No Photo</div>
                )}
                {isSelected && showSelectButton && (
                    <div className="selected-badge">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                )}
            </div>
            <div className="performer-info">
                <h3>{performer.firstName} {performer.lastName}</h3>
                <div className="performer-details">
                    <span>{performer.gender}</span>
                    <span>•</span>
                    <span>{calculateAge(performer.birthday)} yrs</span>
                    <span>•</span>
                    <span>{performer.height}cm</span>
                </div>
                <div className="performer-attributes">
                    <span>{performer.hairColor} hair</span>
                    <span>•</span>
                    <span>{performer.eyeColor} eyes</span>
                </div>
            </div>
            <div className="performer-actions">
                <button onClick={onViewDetails} className="button-secondary">
                    View Details
                </button>
                {showSelectButton && (
                    <button
                        onClick={onToggleSelect}
                        className={isSelected ? 'button-selected' : 'button-primary'}
                    >
                        {isSelected ? 'Remove' : 'Select'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PerformerCard;
