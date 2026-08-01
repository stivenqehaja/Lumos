import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="footer-logo">LUMOS</span>
                    <p className="footer-tagline">Video &amp; Photo Production, Every Industry</p>
                </div>

                <nav className="footer-links" aria-label="Footer">
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/work" className="footer-link">Work</Link>
                    <Link to="/about" className="footer-link">About</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                    <a
                        href="https://www.instagram.com/lumos_videos/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        Instagram
                    </a>
                </nav>
            </div>

            <div className="footer-bottom">
                <p>&copy; {year} Lumos Studios. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
