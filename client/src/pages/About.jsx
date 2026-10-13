import Footer from '../components/common/Footer';
import Reveal from '../components/common/Reveal';
import { CATEGORIES } from '../data/projects';
import './About.css';

const steps = [
    {
        title: 'Brief',
        description: 'We start with a short call to understand your industry, goals, and what the footage needs to do for you.',
    },
    {
        title: 'Shoot',
        description: 'On-site with a lean crew and the right gear for the job — drone, gimbal, lighting — whatever the brief calls for.',
    },
    {
        title: 'Edit & Grade',
        description: 'Cut, color graded, and sound-designed in-house, with revisions until it’s right.',
    },
    {
        title: 'Deliver',
        description: 'Final files formatted for how you’ll actually use them — web, social, TV, or print.',
    },
];

const About = () => {
    return (
        <div className="page-container about-page">
            <div className="content-wrapper">
                <header className="page-header about-header">
                    <Reveal>
                        <span className="eyebrow">About Lumos</span>
                        <h1 className="page-title section-heading">One Crew, Every Industry</h1>
                        <p className="page-description about-intro">
                            Lumos is a video and photography production studio. We work across real estate,
                            healthcare, hospitality, automotive, and broadcast &mdash; bringing the same
                            cinematic standard to every set, whatever the industry.
                        </p>
                    </Reveal>
                </header>

                <Reveal as="section" className="about-section">
                    <h2 className="section-heading">What We Cover</h2>
                    <div className="about-categories">
                        {CATEGORIES.map((category) => (
                            <span key={category} className="about-category-pill">{category}</span>
                        ))}
                    </div>
                </Reveal>

                <section className="about-section">
                    <Reveal>
                        <h2 className="section-heading">How We Work</h2>
                    </Reveal>
                    <div className="process-grid">
                        {steps.map((step, index) => (
                            <Reveal key={step.title} delay={index * 0.1} className="process-card card">
                                <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </Reveal>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default About;
