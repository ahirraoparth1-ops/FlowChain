import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const BenefitCards = () => {
  const benefits = [
    {
      id: 1,
      icon: "Brain",
      title: "AI-Powered Forecasting",
      description: "Advanced machine learning algorithms analyze historical data patterns to predict future demand with 95% accuracy.",
      color: "text-primary",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      icon: "TrendingDown",
      title: "Reduce Inventory Waste",
      description: "Optimize stock levels to minimize overstock situations and reduce carrying costs by up to 30%.",
      color: "text-success",
      bgColor: "bg-emerald-50"
    },
    {
      id: 3,
      icon: "BarChart3",
      title: "Interactive Dashboards",
      description: "Visualize forecasts with dynamic charts and graphs that update in real-time as new data becomes available.",
      color: "text-accent",
      bgColor: "bg-violet-50"
    },
    {
      id: 4,
      icon: "FileSpreadsheet",
      title: "Multi-Format Support",
      description: "Upload data in CSV, Excel, or JSON formats with automatic validation and preprocessing capabilities.",
      color: "text-warning",
      bgColor: "bg-amber-50"
    },
    {
      id: 5,
      icon: "Lightbulb",
      title: "Actionable Insights",
      description: "Get specific recommendations for inventory adjustments, reorder points, and procurement strategies.",
      color: "text-secondary",
      bgColor: "bg-green-50"
    },
    {
      id: 6,
      icon: "Shield",
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with SOC 2, GDPR, and industry security standards.",
      color: "text-error",
      bgColor: "bg-red-50"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-4 lg:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the powerful features that make our AI supply chain platform 
            the preferred choice for forward-thinking businesses.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits?.map((benefit) => (
            <motion.div
              key={benefit?.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="data-card p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-16 h-16 ${benefit?.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon 
                  name={benefit?.icon} 
                  size={28} 
                  className={benefit?.color}
                />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {benefit?.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {benefit?.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitCards;