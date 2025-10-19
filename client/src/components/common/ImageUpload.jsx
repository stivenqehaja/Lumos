import { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ images = [], onChange, maxImages = 9 }) => {
    const [previews, setPreviews] = useState(images);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        if (previews.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        const newPreviews = [];
        const newBase64Images = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file`);
                continue;
            }

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            newPreviews.push(previewUrl);

            // Convert to base64
            const base64 = await fileToBase64(file);
            newBase64Images.push(base64);
        }

        const updatedPreviews = [...previews, ...newPreviews];
        const updatedImages = [...images, ...newBase64Images];

        setPreviews(updatedPreviews);
        onChange(updatedImages);

        // Reset input
        e.target.value = '';
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleRemove = (index) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        const updatedImages = images.filter((_, i) => i !== index);

        setPreviews(updatedPreviews);
        onChange(updatedImages);

        // Revoke object URL to free memory
        if (previews[index].startsWith('blob:')) {
            URL.revokeObjectURL(previews[index]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="image-upload-container">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <div className="image-grid">
                {previews.map((preview, index) => (
                    <div key={index} className="image-preview-wrapper">
                        <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="image-preview"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="image-remove-btn"
                            aria-label="Remove image"
                        >
                            ×
                        </button>
                        <div className="image-number">{index + 1}</div>
                    </div>
                ))}

                {previews.length < maxImages && (
                    <button
                        type="button"
                        onClick={handleClick}
                        className="image-add-btn"
                    >
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Add Image</span>
                    </button>
                )}
            </div>

            <p className="image-upload-hint">
                {previews.length} / {maxImages} images uploaded
            </p>
        </div>
    );
};

export default ImageUpload;
