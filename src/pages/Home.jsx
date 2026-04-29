import { useCallback, useState } from 'react';
import Loader from '../components/Loader/Loader';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../sections/home/Hero';
import TextInterlude from '../sections/home/TextInterlude';
import Projects from '../sections/home/Projects';
import Footer from '../components/Footer/Footer';
import { useLenis } from '../hooks/useLenis';

const Home = () => {
  useLenis();

  const [showLoader, setShowLoader] = useState(() => {
    return sessionStorage.getItem('home-loader-complete') !== '1';
  });

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem('home-loader-complete', '1');
    setShowLoader(false);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-transparent">
      {showLoader && <Loader onComplete={handleLoaderComplete} />}
      <Navbar />
      <main>
        <Hero />
        <TextInterlude />
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default Home;