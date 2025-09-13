import React from 'react';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API Documentation", href: "#api" },
      { name: "Integrations", href: "#integrations" }
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
      { name: "Contact", href: "#contact" }
    ],
    resources: [
      { name: "Blog", href: "#blog" },
      { name: "Help Center", href: "#help" },
      { name: "Case Studies", href: "#cases" },
      { name: "Webinars", href: "#webinars" }
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "GDPR", href: "#gdpr" }
    ]
  };

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", href: "#twitter" },
    { name: "LinkedIn", icon: "Linkedin", href: "#linkedin" },
    { name: "GitHub", icon: "Github", href: "#github" },
    { name: "YouTube", icon: "Youtube", href: "#youtube" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <Icon name="TrendingUp" size={24} color="white" />
              </div>
              <span className="font-bold text-xl text-foreground">
                AI Supply Chain
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transform your inventory management with AI-powered demand forecasting 
              and intelligent supply chain optimization.
            </p>
            <div className="flex space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.href}
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  aria-label={social?.name}
                >
                  <Icon name={social?.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks?.product?.map((link) => (
                <li key={link?.name}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link?.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks?.company?.map((link) => (
                <li key={link?.name}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link?.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks?.resources?.map((link) => (
                <li key={link?.name}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link?.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks?.legal?.map((link) => (
                <li key={link?.name}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link?.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© {currentYear} AI Supply Chain. All rights reserved.</span>
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={14} />
                <span>San Francisco, CA</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-success">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Globe" size={14} />
                <span>English (US)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;