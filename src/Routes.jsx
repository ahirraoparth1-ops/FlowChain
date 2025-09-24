import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ForecastDashboard from './pages/forecast-dashboard';
import LandingPage from './pages/landing-page';
import DataUpload from './pages/data-upload';
import AIInsights from './pages/ai-insights';
import Profile from './pages/profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIInsights />} />
        <Route path="/forecast-dashboard" element={<ForecastDashboard />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/data-upload" element={<DataUpload />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
