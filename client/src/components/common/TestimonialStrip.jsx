import { testimonials } from '../../data/testimonials';
import Reveal from './Reveal';
import './TestimonialStrip.css';

const TestimonialStrip = () => {
    return (
        <section className="testimonial-strip">
            <div className="testimonial-strip-inner">
                <Reveal>
                    <span className="eyebrow">What Clients Say</span>
                    <h2 className="testimonial-strip-title section-heading">Trusted Across Every Set</h2>
                </Reveal>

                <div className="testimonial-grid">
                    {testimonials.map((item, index) => (
                        <Reveal key={item.name + index} delay={index * 0.1} className="card testimonial-card">
                            <p className="testimonial-quote">{item.quote}</p>
                            <div className="testimonial-author">
                                <span className="testimonial-name">{item.name}</span>
                                <span className="testimonial-role">{item.role}</span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialStrip;
