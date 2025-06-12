import React from 'react';
import { WhatsAppConnectPage } from '../components/WhatsAppConnectPage';
// If you use a hook like useSettings, add error/loading fallback here
// Example:
// const { settings, loading, error } = useSettings();
// if (error) return <div className="p-4 text-red-500">Failed to load settings.</div>;
// if (loading) return <div className="p-4 text-gray-400">Loading...</div>;

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-3xl mb-10 text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Settings</h1>
        <p className="text-lg text-gray-500 mb-6">Configure your personalized account preferences.</p>
      </div>
      <div className="w-full max-w-2xl card bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-2xl p-6 mb-8">
        <div className="text-gray-500">Settings page coming soon.</div>
      </div>
      {/* WhatsApp QR Code Connection Section */}
      <div className="w-full max-w-2xl card bg-white/80 backdrop-blur-xl border-0 shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Connect WhatsApp</h2>
        <WhatsAppConnectPage />
      </div>
    </div>
  );
} 