import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LumixHero.css';

const CameraScene = lazy(() => import('./CameraScene'));

/**
 * Keeps a WebGL failure — blocked context, exhausted GPU, driver crash — from
 * taking the hero copy down with it. The CSS stage underneath stands on its own.
 */
class StageBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { failed: false };
    }

    static getDerivedStateFromError() {
        return { failed: true };
    }

    render() {
        return this.state.failed ? null : this.props.children;
    }
}

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const LumixHero = () => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const scrollRef = useRef(0);

    const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
    const [mountScene, setMountScene] = useState(false);
    const [inView, setInView] = useState(true);
    const [sceneReady, setSceneReady] = useState(false);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = (event) => setReducedMotion(event.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    // Hold three.js back until the browser is idle, so the hero paints its copy
    // and the CSS stage first.
    useEffect(() => {
        const schedule = window.requestIdleCallback ?? ((fn) => window.setTimeout(fn, 200));
        const cancel = window.cancelIdleCallback ?? window.clearTimeout;
        const handle = schedule(() => setMountScene(true));
        return () => cancel(handle);
    }, []);

    // Park the render loop whenever the hero scrolls out of the viewport.
    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return undefined;

        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            threshold: 0,
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    // Hero scroll progress, 0 at rest to 1 once scrolled past. Written to a ref
    // so the scene can read it per frame without re-rendering React.
    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return undefined;

        let frame = 0;
        const measure = () => {
            frame = 0;
            const height = node.offsetHeight || 1;
            const progress = Math.min(Math.max(-node.getBoundingClientRect().top / height, 0), 1);
            scrollRef.current = progress;
            node.style.setProperty('--hero-scroll', progress.toFixed(3));
        };

        const onScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <section className="landing-section" ref={sectionRef}>
            {/* Backlit scrim the camera sits against, and which stands in for it
                before the scene loads or if WebGL is unavailable. */}
            <div className="landing-stage" aria-hidden="true">
                <div className="landing-halo" />
                <div className="landing-kicker" />
                <div className={`landing-canvas ${sceneReady ? 'is-ready' : ''}`}>
                    {mountScene && (
                        <StageBoundary>
                            <Suspense fallback={null}>
                                <SceneLoader
                                    scrollRef={scrollRef}
                                    reducedMotion={reducedMotion}
                                    active={inView}
                                    onReady={() => setSceneReady(true)}
                                />
                            </Suspense>
                        </StageBoundary>
                    )}
                </div>
            </div>

            <div className="landing-content">
                <div className="landing-copy">
                    <span className="eyebrow landing-eyebrow">Video &amp; Photo Production</span>
                    <h1 className="landing-title">
                        WE ARE <br />
                        LUMOS
                    </h1>
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
            </div>

            <span className="scroll-cue" aria-hidden="true">
                <span className="scroll-cue-dot" />
            </span>
        </section>
    );
};

/** Fades the canvas in once the scene has actually mounted. */
const SceneLoader = ({ onReady, ...props }) => {
    useEffect(() => {
        onReady();
    }, [onReady]);

    return <CameraScene {...props} />;
};

export default LumixHero;
