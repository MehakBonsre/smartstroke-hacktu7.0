import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Login from './Login';
import AIDashboard from './pages/AIDashboard';
import Inventory from './pages/Inventory';
import DemandIntelligence from './pages/DemandIntelligence';
import DeadStock from './pages/DeadStock';
import Alerts from './pages/Alerts';
import Dealers from './pages/Dealers';
import DealerDashboard from './pages/DealerDashboard';
import BuyerPortal from './pages/BuyerPortal';
import Orders from './pages/Orders';
import PaintCycle from './pages/PaintCycle';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Layout><AIDashboard /></Layout>} />
            <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
            <Route path="/demand" element={<Layout><DemandIntelligence /></Layout>} />
            <Route path="/deadstock" element={<Layout><DeadStock /></Layout>} />
            <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
            <Route path="/dealers" element={<Layout><Dealers /></Layout>} />

            {/* Role specific */}
            <Route path="/dealer-dashboard" element={<Layout><DealerDashboard /></Layout>} />
            <Route path="/portal" element={<Layout><BuyerPortal /></Layout>} />
            <Route path="/orders" element={<Layout><Orders /></Layout>} />
            <Route path="/resell-paint" element={<Layout><PaintCycle /></Layout>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
