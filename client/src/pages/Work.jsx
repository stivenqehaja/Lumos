import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Reveal from '../components/common/Reveal';
import { CATEGORIES, getProjectsByCategory } from '../data/projects';
import './Work.css';

const ALL = 'All';

const Work = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category') || ALL;
    const [lightboxProject, setLightboxProject] = useState(null);

    const filteredProjects = useMemo(() => getProjectsByCategory(activeCategory), [activeCategory]);

    const setCategory = (category) => {
        if (category === ALL) {
            setSearchParams({});
        } else {
            setSearchParams({ category });
        }
    };

    const closeLightbox = useCallback(() => setLightboxProject(null), []);

    useEffect(() => {
        if (!lightboxProject) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxProject, closeLightbox]);

    return (
        <div className="page-container work-page">
            <div className="content-wrapper">
                <header className="page-header work-header">
                    <span className="eyebrow">Portfolio</span>
                    <h1 className="page-title section-heading">Our Work</h1>
                    <p className="page-description">
                        A cross-section of what we&apos;ve shot &mdash; filter by industry to see more.
                    </p>
                </header>

                <div className="category-filter" role="tablist" aria-label="Filter work by category">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeCategory === ALL}
                        className={`filter-chip ${activeCategory === ALL ? 'active' : ''}`}
                        onClick={() => setCategory(ALL)}
                    >
                        All
                    </button>
                    {CATEGORIES.map((category) => (
                        <button
                            type="button"
                            role="tab"
                            key={category}
                            aria-selected={activeCategory === category}
                            className={`filter-chip ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => setCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredProjects.length > 0 ? (
                    <div className="work-grid">
                        {filteredProjects.map((project, index) => (
                            <Reveal
                                key={project.id}
                                delay={(index % 6) * 0.05}
                                as="button"
                                className="work-card card-clickable"
                                onClick={() => setLightboxProject(project)}
                                aria-label={`Open ${project.title}`}
                            >
                                {project.mediaType === 'video' ? (
                                    <video className="work-card-media" muted loop autoPlay playsInline>
                                        <source src={project.src} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img className="work-card-media" src={project.src} alt={project.title} loading="lazy" />
                                )}
                                <div className="work-card-caption">
                                    <span className="work-card-category">{project.category}</span>
                                    <span className="work-card-title">{project.title}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <p className="work-empty">No projects in this category yet &mdash; check back soon.</p>
                )}
            </div>

            {lightboxProject && (
                <div className="lightbox-backdrop" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Close">
                            &times;
                        </button>
                        {lightboxProject.mediaType === 'video' ? (
                            <video className="lightbox-media" controls autoPlay loop playsInline>
                                <source src={lightboxProject.src} type="video/mp4" />
                            </video>
                        ) : (
                            <img className="lightbox-media" src={lightboxProject.src} alt={lightboxProject.title} />
                        )}
                        <div className="lightbox-caption">
                            <span className="video-card-category">{lightboxProject.category}</span>
                            <h3 className="section-heading">{lightboxProject.title}</h3>
                            <p>{lightboxProject.description}</p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Work;
