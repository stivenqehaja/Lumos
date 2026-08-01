import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Reveal from '../components/common/Reveal';
import TestimonialStrip from '../components/common/TestimonialStrip';
import { CATEGORIES, projects } from '../data/projects';
import './Home.css';

const featuredProjects = projects.filter((p) => p.featured);

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <section className="landing-section">
                <div className="landing-bg" />
                <div className="landing-scrim" />
                <div className="landing-content">
                    <span className="eyebrow landing-eyebrow">Video &amp; Photo Production</span>
                    <h1 className="landing-title">WE ARE <br />LUMOS</h1>
                    <p className="landing-subtitle">
                        Real estate, hospitality, healthcare, automotive, broadcast &mdash; one crew,
                        every industry, cinematic results.
                    </p>
                    <div className="landing-actions">
                        <button className="button-normal" onClick={() => navigate('/work')}>
                            See Our Work
                        </button>
                        <Link to="/contact" className="button-ghost-link">
                            Book a Shoot &rarr;
                        </Link>
                    </div>
                </div>
                <span className="scroll-cue" aria-hidden="true"><span className="scroll-cue-dot" /></span>
            </section>

            <section className="category-section">
                <Reveal>
                    <span className="eyebrow">What We Shoot</span>
                    <h2 className="section-heading category-title">Nine Industries. One Crew.</h2>
                </Reveal>

                <div className="category-grid">
                    {CATEGORIES.map((category, index) => (
                        <Reveal key={category} delay={index * 0.05} as={Link} to={`/work?category=${encodeURIComponent(category)}`} className="category-tile">
                            <span className="category-tile-name">{category}</span>
                            <span className="category-tile-arrow">&rarr;</span>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="three-video-section">
                <Reveal>
                    <span className="eyebrow">Selected Work</span>
                    <h2 className="section-heading">Recent Highlights</h2>
                </Reveal>

                <div className="video-container">
                    {featuredProjects.map((project, index) => (
                        <Reveal key={project.id} delay={index * 0.1} className="video-card">
                            <video className="video-vertical" autoPlay muted loop playsInline>
                                <source src={project.src} type="video/mp4" />
                            </video>
                            <div className="video-card-caption">
                                <span className="video-card-category">{project.category}</span>
                                <span className="video-card-title">{project.title}</span>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <p className="intro-text">
                    We strive to elevate what it means to create exceptional video and photo content,
                    whatever the industry.
                </p>
                <button className="button-normal" onClick={() => navigate('/work')}>
                    View Full Portfolio
                </button>
            </section>

            <TestimonialStrip />

            <section className="cta-band">
                <Reveal>
                    <h2 className="section-heading">Ready to Start Your Project?</h2>
                    <p className="cta-band-text">Tell us about your shoot and we&apos;ll get back to you within a day.</p>
                    <button className="button-normal" onClick={() => navigate('/contact')}>
                        Book Now
                    </button>
                </Reveal>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
