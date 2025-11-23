import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ onGetStarted }) => {
  return (
    <motion.div 
      className="relative min-h-screen flex items-center justify-center px-4 lg:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 via-transparent to-blue-50/50" />
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Main Title with Proportionate UI and Smoother Animation */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-16"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center justify-center w-24 h-24 bg-primary rounded-3xl shadow-2xl">
              <Icon name="TrendingUp" size={48} color="white" />
            </div>
          </div>
          <span className="font-extrabold text-7xl text-foreground tracking-tight drop-shadow-md mb-4">
            FlowChain
          </span>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-8 leading-snug">
            AI-Powered Supply Chain
            <span className="block text-primary mt-2">Forecasting Platform</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your inventory management with intelligent demand forecasting.<br className="hidden md:block" />
            Upload your data, get AI-driven insights, and optimize stock levels to reduce waste while maximizing profitability.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            variant="default"
            size="lg"
            onClick={onGetStarted}
            iconName="Upload"
            iconPosition="right"
            className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Now
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg font-semibold"
            iconName="Play"
            iconPosition="left"
          >
            Watch Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={16} color="var(--color-success)" />
            <span>Enterprise Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={16} color="var(--color-warning)" />
            <span>Real-time Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Users" size={16} color="var(--color-primary)" />
            <span>Trusted by 500+ Companies</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;