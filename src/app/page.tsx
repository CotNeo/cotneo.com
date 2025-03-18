import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import TechStack from '@/components/TechStack';
import Projects from '@/components/Projects';
import GithubStatus from '@/components/GithubStatus';
import Certificates from '@/components/Certificates';
import Footer from '@/components/Footer';
import Background3D from '@/components/Background3D';
import ChatBot from '@/components/ChatBot';

export default function Home() {
  return (
    <main className="relative min-h-screen text-white">
      <Background3D />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <GithubStatus />
        <Certificates />
        <Footer />
        <ChatBot />
      </div>
    </main>
  );
}