import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [theme, setTheme] = useState('dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        closeMenu();
        logout();
        navigate('/');
    };

    return (
        <nav id="navbar">
            <Link to="/" onClick={closeMenu}>
                <img
                    src={theme === 'light' ? '/images/logo-black.png' : '/images/logo-white.png'}
                    alt="Lumos Logo"
                    id="navbar-logo"
                    className="no-select"
                />
            </Link>

            <button
                id="menu-toggle"
                className={isMenuOpen ? 'open' : ''}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div id="navlink-container" className={isMenuOpen ? 'open' : ''}>
                <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
                <Link to="/work" className="nav-link" onClick={closeMenu}>Work</Link>
                <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
                <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
                <a
                    href="https://www.instagram.com/lumos_videos/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link"
                    onClick={closeMenu}
                >
                    IG
                </a>
                {isAuthenticated && (
                    <>
                        <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>Dashboard</Link>
                        <button onClick={handleLogout} className="nav-link admin-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                            Logout
                        </button>
                    </>
                )}
                <button id="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                    <svg className="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <svg className="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
