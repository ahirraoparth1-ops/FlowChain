import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const certifications = [
    {
      id: 1,
      name: "SOC 2 Type II",
      description: "Security & Availability",
      icon: "Shield",
      verified: true
    },
    {
      id: 2,
      name: "GDPR Compliant",
      description: "Data Protection",
      icon: "Lock",
      verified: true
    },
    {
      id: 3,
      name: "ISO 27001",
      description: "Information Security",
      icon: "Award",
      verified: true
    },
    {
      id: 4,
      name: "SSL Encrypted",
      description: "256-bit Encryption",
      icon: "Key",
      verified: true
    }
  ];

  const stats = [
    {
      id: 1,
      value: "500+",
      label: "Enterprise Clients",
      icon: "Building2"
    },
    {
      id: 2,
      value: "95%",
      label: "Forecast Accuracy",
      icon: "Target"
    },
    {
      id: 3,
      value: "$50M+",
      label: "Cost Savings Generated",
      icon: "DollarSign"
    },
    {
      id: 4,
      value: "99.9%",
      label: "Platform Uptime",
      icon: "Activity"
    }
  ];

  return (
    <section className="py-20 px-4 lg:px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Trust Badges */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Trusted by Industry Leaders
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {certifications?.map((cert) => (
              <motion.div
                key={cert?.id}
                whileHover={{ scale: 1.05 }}
                className="data-card p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={cert?.icon} size={24} className="text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{cert?.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{cert?.description}</p>
                {cert?.verified && (
                  <div className="flex items-center justify-center gap-1 text-success text-sm">
                    <Icon name="CheckCircle" size={16} />
                    <span>Verified</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-foreground text-center mb-12">
            Platform Performance Metrics
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats?.map((stat) => (
              <motion.div
                key={stat?.id}
                whileHover={{ y: -4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={stat?.icon} size={28} className="text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat?.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat?.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-6 bg-card rounded-2xl border border-border text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Shield" size={24} className="text-success" />
            <h4 className="text-lg font-semibold text-foreground">
              Enterprise-Grade Security
            </h4>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your data is protected with bank-level encryption, regular security audits, 
            and compliance with international data protection standards. We never store 
            sensitive business information longer than necessary for processing.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;