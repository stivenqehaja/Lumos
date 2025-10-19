import { useState, useEffect } from 'react';
import ImageUpload from '../common/ImageUpload';
import './PerformerForm.css';

const PerformerForm = ({ performer = null, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthday: '',
        phoneNumber: '',
        email: '',
        gender: '',
        height: '',
        hairColor: '',
        eyeColor: '',
        skinTone: '',
        distinctiveMarks: '',
        images: [],
    });

    useEffect(() => {
        if (performer) {
            setFormData({
                firstName: performer.firstName || '',
                lastName: performer.lastName || '',
                birthday: performer.birthday || '',
                phoneNumber: performer.phoneNumber || '',
                email: performer.email || '',
                gender: performer.gender || '',
                height: performer.height || '',
                hairColor: performer.hairColor || '',
                eyeColor: performer.eyeColor || '',
                skinTone: performer.skinTone || '',
                distinctiveMarks: performer.distinctiveMarks || '',
                images: performer.images || [],
            });
        }
    }, [performer]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImagesChange = (images) => {
        setFormData({
            ...formData,
            images,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="performer-form">
            <h2 className="form-title">
                {performer ? 'Edit Performer' : 'Add New Performer'}
            </h2>

            <div className="form-section">
                <h3 className="section-title">Personal Information</h3>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="firstName">
                            First Name *
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="form-input"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="lastName">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="form-input"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="birthday">
                            Birthday *
                        </label>
                        <input
                            type="date"
                            id="birthday"
                            name="birthday"
                            className="form-input"
                            value={formData.birthday}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="gender">
                            Gender *
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            className="form-select"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="phoneNumber">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="form-input"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3 className="section-title">Physical Attributes</h3>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="height">
                            Height (cm) *
                        </label>
                        <input
                            type="number"
                            id="height"
                            name="height"
                            className="form-input"
                            value={formData.height}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="hairColor">
                            Hair Color *
                        </label>
                        <input
                            type="text"
                            id="hairColor"
                            name="hairColor"
                            className="form-input"
                            value={formData.hairColor}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="eyeColor">
                            Eye Color *
                        </label>
                        <input
                            type="text"
                            id="eyeColor"
                            name="eyeColor"
                            className="form-input"
                            value={formData.eyeColor}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="skinTone">
                            Skin Tone *
                        </label>
                        <input
                            type="text"
                            id="skinTone"
                            name="skinTone"
                            className="form-input"
                            value={formData.skinTone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="distinctiveMarks">
                        Distinctive Marks
                    </label>
                    <textarea
                        id="distinctiveMarks"
                        name="distinctiveMarks"
                        className="form-textarea"
                        value={formData.distinctiveMarks}
                        onChange={handleChange}
                        placeholder="Tattoos, scars, piercings, etc."
                    />
                </div>
            </div>

            <div className="form-section">
                <h3 className="section-title">Portfolio Images</h3>
                <ImageUpload
                    images={formData.images}
                    onChange={handleImagesChange}
                    maxImages={9}
                />
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="button-secondary"
                >
                    Cancel
                </button>
                <button type="submit" className="button-primary">
                    {performer ? 'Update Performer' : 'Add Performer'}
                </button>
            </div>
        </form>
    );
};

export default PerformerForm;
