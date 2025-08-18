import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyAndCompliance from "./pages/PrivacyAndCompliance";

const App = () => (
  <>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route
          path="/privacyandcompliance"
          element={<PrivacyAndCompliance />}
        />
      </Routes>
    </Router>
  </>
);

export default App;
