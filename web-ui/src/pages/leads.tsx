import React from 'react';
import LeadManagement from '../components/LeadManagement';

export default function Leads() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-3xl mb-10 text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Leads</h1>
        <p className="text-lg text-gray-500 mb-6">Track and manage your leads efficiently.</p>
      </div>
      <div className="w-full max-w-5xl card bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-2xl p-6">
        <LeadManagement />
      </div>
    </div>
  );
} 