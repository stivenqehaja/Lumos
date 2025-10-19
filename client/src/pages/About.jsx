const About = () => {
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
                    About Lumos
                </h1>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    textAlign: 'center',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    Lumos is a premier casting management platform for connecting talented performers with commercial opportunities.
                </p>
            </div>
        </div>
    );
};

export default About;
