import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ReportProblemPage from './pages/ReportProblemPage';
import CitizenDashboard from './pages/CitizenDashboard';
import IssuesListPage from './pages/IssuesListPage';
import IssueDetailPage from './pages/IssueDetailPage';
import MapViewPage from './pages/MapViewPage';
import AreaInsightsPage from './pages/AreaInsightsPage';
import ProfilePage from './pages/ProfilePage';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AuthorityIssuesPage from './pages/AuthorityIssuesPage';
import AuthorityAnalyticsPage from './pages/AuthorityAnalyticsPage';
import ContactUsPage from './pages/ContactUsPage';
import AboutUsPage from './pages/AboutUsPage';
import SustainabilityPage from './pages/SustainabilityPage';
import CommunityHubPage from './pages/CommunityHubPage';
import CreateDrivePage from './pages/CreateDrivePage';
import CitizenCreateDrivePage from './pages/CitizenCreateDrivePage';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="cv-animate-fadeIn">
      <div className="cv-page-header">
        <h1>{title}</h1>
        <p>Coming soon.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Citizen */}
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/report" element={<ReportProblemPage />} />
          <Route path="/issues" element={<IssuesListPage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
          <Route path="/issues/:id/create-drive" element={<CitizenCreateDrivePage />} />
          <Route path="/map" element={<MapViewPage />} />
          <Route path="/area-insights" element={<AreaInsightsPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/community" element={<CommunityHubPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Authority */}
          <Route path="/authority" element={<AuthorityDashboard />} />
          <Route path="/authority/issues" element={<AuthorityIssuesPage />} />
          <Route path="/authority/map" element={<MapViewPage />} />
          <Route path="/authority/analytics" element={<AuthorityAnalyticsPage />} />
          <Route path="/authority/create-drive" element={<CreateDrivePage />} />

          {/* Static */}
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Placeholder title="404 — Page Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
