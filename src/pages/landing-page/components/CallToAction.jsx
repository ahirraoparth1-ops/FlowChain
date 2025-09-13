import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CallToAction = ({ onGetStarted }) => {
  const features = [
    "Upload data in multiple formats",
    "Get AI-powered demand forecasts",
    "Receive actionable inventory recommendations",
    "Export results for implementation"
  ];

  return (
    <section className="py-20 px-4 lg:px-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Your Supply Chain?
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Join hundreds of companies already using our AI-powered platform to optimize 
            their inventory management and reduce operational costs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features?.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border"
              >
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={16} className="text-success" />
                </div>
                <span className="text-foreground font-medium text-left">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="default"
              size="xl"
              onClick={onGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              className="px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Free Trial
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              className="px-12 py-4 text-lg font-semibold"
              iconName="Calendar"
              iconPosition="left"
            >
              Schedule Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Icon name="CreditCard" size={16} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={16} />
                <span>Setup in under 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Headphones" size={16} />
                <span>24/7 support included</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;