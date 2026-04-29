import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Story from '../sections/about/Story';
import Clients from '../sections/about/Clients';
import Team from '../sections/about/Team';

const About = () => {
    return (
        <div className="relative w-full min-h-screen bg-transparent text-[#0D0D0D]">
            <Navbar />
            <main>
                <Story />
                <Clients />
                <Team />
            </main>
            
            <Footer />
        </div>
    );
};

export default About;