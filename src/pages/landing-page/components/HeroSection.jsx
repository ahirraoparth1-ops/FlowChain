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
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg">
              <Icon name="TrendingUp" size={32} color="white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            AI-Powered Supply Chain
            <span className="block text-primary">Forecasting Platform</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
            Transform your inventory management with intelligent demand forecasting. 
            Upload your data, get AI-driven insights, and optimize stock levels to reduce waste 
            while maximizing profitability.
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