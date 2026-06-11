import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyAndCompliance from "./pages/PrivacyAndCompliance";
import CustomerBrowsePage from "./pages/CustomerBrowsePage";
import VendorAuthPage from "./pages/VendorAuthPage";
import RiderAuthPage from "./pages/RiderAuthPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const App = () => (
  <>
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route
          path="/privacyandcompliance"
          element={<PrivacyAndCompliance />}
        />
        <Route path="/customer/browse" element={<CustomerBrowsePage />} />
        <Route path="/vendor/auth" element={<VendorAuthPage />} />
        <Route path="/rider/auth" element={<RiderAuthPage />} />
      </Routes>
    </Router>
  </>
);

export default App;
