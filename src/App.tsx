import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyAndCompliance from "./pages/PrivacyAndCompliance";
import CustomerBrowsePage from "./pages/CustomerBrowsePage";
import CustomerVendorPage from "./pages/CustomerVendorPage";
import CustomerCheckoutPage from "./pages/CustomerCheckoutPage";
import CustomerOrderTrackingPage from "./pages/CustomerOrderTrackingPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import { useSocketNotifications } from "./hooks/useSocketNotifications";
import NotificationToastContainer from "./components/ui/NotificationToastContainer";
import CookieConsentBanner from "./components/ui/CookieConsentBanner";

import ErrorBoundary from "./components/ErrorBoundary";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const NotificationHandler = () => {
  useSocketNotifications();
  return null;
};

const App = () => (
  <ErrorBoundary>
    <Router>
      <ScrollToTop />
      <NotificationHandler />
      <NotificationToastContainer />
      <CookieConsentBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route
          path="/privacyandcompliance"
          element={<PrivacyAndCompliance />}
        />
        <Route path="/customer/browse" element={<CustomerBrowsePage />} />
        <Route path="/customer/vendor/:id" element={<CustomerVendorPage />} />
        <Route path="/customer/checkout" element={<CustomerCheckoutPage />} />
        <Route path="/customer/order/:id" element={<CustomerOrderTrackingPage />} />
        <Route path="/vendor/auth" element={<ComingSoonPage />} />
        <Route path="/vendor/dashboard" element={<ComingSoonPage />} />
        {/* <Route path="/vendor/menu" element={<VendorMenuPage />} /> */}
        <Route path="/rider/auth" element={<ComingSoonPage />} />
        <Route path="/rider/dashboard" element={<ComingSoonPage />} />
      </Routes>
    </Router>
  </ErrorBoundary>
);

export default App;
