import { useEffect, useRef, useState } from 'react';

/**
 * Wraps children and adds a reveal animation class once the element
 * scrolls into view. Uses IntersectionObserver instead of a motion
 * library to keep the bundle light on video-heavy pages.
 */
const Reveal = ({ children, as, animation = 'fade-in-up', delay = 0, className = '', ...rest }) => {
    const Tag = as || 'div';
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(node);
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal ${isVisible ? animation : ''} ${className}`.trim()}
            style={isVisible ? { animationDelay: `${delay}s` } : undefined}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
