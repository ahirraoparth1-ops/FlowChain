# AI Supply Chain Dashboard

## Overview
A modern React-based AI Supply Chain Dashboard application built with Vite, Redux Toolkit, and TailwindCSS. The application provides data visualization capabilities for supply chain forecasting and AI insights.

## Recent Changes (September 24, 2025)
- Successfully imported and configured for Replit environment
- Fixed vite.config.mjs to use port 5000 and allowedHosts: true for Replit proxy compatibility
- Set up development workflow with Frontend Server
- Configured deployment settings for autoscale with Vite build and serve commands

## Project Architecture

### Technology Stack
- **Frontend**: React 18 with Vite build tool
- **State Management**: Redux Toolkit 
- **Styling**: TailwindCSS with custom configurations
- **Routing**: React Router v6
- **Data Visualization**: D3.js and Recharts
- **Forms**: React Hook Form
- **Animation**: Framer Motion

### Key Pages
- `/ai-insights` - AI insights dashboard (default route)
- `/forecast-dashboard` - Forecasting dashboard with charts and metrics
- `/data-upload` - Data upload interface with file processing
- `/landing-page` - Landing page with features and CTAs

### Project Structure
```
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   │   └── ui/        # Base UI components (Button, Input, etc.)
│   ├── pages/         # Page components organized by feature
│   ├── styles/        # Global styles and Tailwind configuration
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main application component
│   ├── Routes.jsx     # Application routes
│   └── index.jsx      # Application entry point
├── vite.config.mjs    # Vite configuration
├── package.json       # Dependencies and scripts
└── tailwind.config.js # Tailwind CSS configuration
```

## Development Environment

### Setup
- **Node.js**: v20 (installed)
- **Package Manager**: npm
- **Development Server**: Vite on port 5000
- **Host Configuration**: 0.0.0.0 with allowedHosts: true for Replit compatibility

### Workflows
- **Frontend Server**: Runs `npm start` on port 5000 for development

### Deployment
- **Target**: Autoscale deployment
- **Build**: `npm run build` 
- **Serve**: `npm run serve` using Vite preview

## Security Notes
- Addressed allowedHosts configuration for secure Replit proxy access
- Some npm audit vulnerabilities exist (xlsx, esbuild, postcss) - monitored but not blocking functionality

## User Preferences
- Prefers minimal file changes when importing projects
- Follows existing project conventions and structure
- Uses Replit-optimized configurations for development and deployment