import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <section className="landing-section">
                <div className="landing-content">
                    <h1 className="landing-title">WE ARE <br/>LUMOS</h1>
                </div>
            </section>

            <section className="three-video-section">
                <div className="video-container">
                    <video className="video-vertical" autoPlay muted loop>
                        <source src="/videos/plate.mp4" type="video/mp4" />
                    </video>

                    <video className="video-vertical" autoPlay muted loop>
                        <source src="/videos/horse.mp4" type="video/mp4" />
                    </video>

                    <video className="video-vertical" autoPlay muted loop>
                        <source src="/videos/bell.mp4" type="video/mp4" />
                    </video>
                </div>
                <p className="intro-text">
                    We Strive to Elevate what it means to Create Exceptional Real Estate Videos
                </p>
                <button className="button-normal" onClick={() => navigate('/about')}>
                    About Us
                </button>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
