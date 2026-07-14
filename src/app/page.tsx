import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import GithubStatus from '@/components/GithubStatus';
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SiteBackground from '@/components/SiteBackground';
import ChatBot from '@/components/ChatBot';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <SiteBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <GithubStatus />
        <Certificates />
        <Contact />
        <Footer />
        <ChatBot />
        <ToastContainer />
      </div>
    </main>
  );
}
