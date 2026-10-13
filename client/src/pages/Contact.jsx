import { useState } from 'react';
import Footer from '../components/common/Footer';
import Reveal from '../components/common/Reveal';
import { useToast } from '../contexts/ToastContext';
import { CATEGORIES } from '../data/projects';
import './Contact.css';

const initialForm = {
    name: '',
    email: '',
    phone: '',
    category: '',
    timeline: '',
    message: '',
};

const Contact = () => {
    const { showSuccess, showError } = useToast();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.name.trim()) nextErrors.name = 'Please enter your name.';
        if (!form.email.trim()) {
            nextErrors.email = 'Please enter your email.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = 'Please enter a valid email.';
        }
        if (!form.category) nextErrors.category = 'Please select a service.';
        if (!form.message.trim()) nextErrors.message = 'Tell us a bit about the project.';
        return nextErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error('Request failed');

            showSuccess("Thanks — we've got your inquiry and will be in touch within a day.");
            setForm(initialForm);
            setErrors({});
        } catch {
            showError('Something went wrong sending your inquiry. Please try again or email us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container contact-page">
            <div className="content-wrapper contact-wrapper">
                <header className="page-header contact-header">
                    <Reveal>
                        <span className="eyebrow">Get In Touch</span>
                        <h1 className="page-title section-heading">Book Your Shoot</h1>
                        <p className="page-description">
                            Tell us about your project and we&apos;ll get back to you within a day with next steps.
                        </p>
                    </Reveal>
                </header>

                <Reveal as="form" className="card booking-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Name</label>
                            <input
                                id="name"
                                name="name"
                                className="form-input"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                            />
                            {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                className="form-input"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                            {errors.email && <span className="form-error">{errors.email}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone (optional)</label>
                            <input
                                id="phone"
                                name="phone"
                                className="form-input"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+1 555 000 0000"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="category">Service</label>
                            <select
                                id="category"
                                name="category"
                                className="form-select"
                                value={form.category}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select a service</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            {errors.category && <span className="form-error">{errors.category}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="timeline">Preferred timeline (optional)</label>
                        <input
                            id="timeline"
                            name="timeline"
                            className="form-input"
                            type="text"
                            value={form.timeline}
                            onChange={handleChange}
                            placeholder="e.g. within the next 2 weeks"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="message">Project details</label>
                        <textarea
                            id="message"
                            name="message"
                            className="form-textarea"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="What are you looking to shoot?"
                        />
                        {errors.message && <span className="form-error">{errors.message}</span>}
                    </div>

                    <button type="submit" className="button-primary button-lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending…' : 'Send Inquiry'}
                    </button>
                </Reveal>

                <Reveal className="contact-alt">
                    <p>
                        Prefer social? Reach us on{' '}
                        <a href="https://www.instagram.com/lumos_videos/" target="_blank" rel="noopener noreferrer">
                            Instagram
                        </a>.
                    </p>
                </Reveal>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
