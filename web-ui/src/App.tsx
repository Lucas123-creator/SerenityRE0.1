import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { ModernLayout } from './components/ui/layout/ModernLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/properties';
import Leads from './pages/leads';
import Analytics from './pages/analytics';
import Settings from './pages/settings';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Files from './pages/Files';
import Login from './pages/Login';
import Preview from './pages/Preview';
import Bookings from './pages/Bookings';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<div>Register page coming soon.</div>} />
          <Route path="/preview/:id" element={<Preview />} />

          {/* Protected routes with ModernLayout */}
          <Route element={<ModernLayout><></></ModernLayout>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/messages/:leadId?" element={<Messages />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/files" element={<Files />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/bookings" element={<Bookings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 