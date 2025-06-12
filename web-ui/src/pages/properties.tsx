import React from 'react';
import PropertyManagement from '../components/PropertyManagement';

export default function Properties() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-3xl mb-10 text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Properties</h1>
        <p className="text-lg text-gray-500 mb-6">Manage and view all property listings in one place.</p>
      </div>
      <div className="w-full max-w-5xl card bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-2xl p-6">
        <PropertyManagement />
      </div>
    </div>
  );
} 