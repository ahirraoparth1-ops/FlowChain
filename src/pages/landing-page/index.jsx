import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import BenefitCards from './components/BenefitCards';
import TrustSignals from './components/TrustSignals';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/data-upload');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        <HeroSection onGetStarted={handleGetStarted} />
        <BenefitCards />
        <TrustSignals />
        <CallToAction onGetStarted={handleGetStarted} />
      </motion.main>
      <Footer />
    </div>
  );
};

export default LandingPage;