const Contact = () => {
    return (
        <div className="page-container">
            <div className="content-wrapper">
                <h1 style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 'clamp(2rem, 6vw, 4rem)',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    Contact Us
                </h1>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    textAlign: 'center',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    Get in touch with us for casting inquiries and collaborations.
                </p>
            </div>
        </div>
    );
};

export default Contact;
