import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Calendar, BarChart2, FileText, Settings } from 'lucide-react';

const features = [
  {
    name: 'Properties',
    description: 'Manage and view all property listings.',
    icon: <Home className="h-7 w-7 text-pink-500" />, // Use a unique color per icon
    to: '/properties',
    badge: 1,
  },
  {
    name: 'Leads',
    description: 'Track and manage your leads efficiently.',
    icon: <Users className="h-7 w-7 text-purple-600" />, 
    to: '/leads',
    badge: 2,
  },
  {
    name: 'Bookings',
    description: 'View and manage property viewings and appointments.',
    icon: <Calendar className="h-7 w-7 text-indigo-500" />, 
    to: '/bookings',
    badge: 3,
  },
  {
    name: 'Analytics',
    description: 'Analyze performance metrics over time.',
    icon: <BarChart2 className="h-7 w-7 text-fuchsia-600" />, 
    to: '/analytics',
    badge: 4,
  },
  {
    name: 'Files',
    description: 'Access and manage important files.',
    icon: <FileText className="h-7 w-7 text-violet-600" />, 
    to: '/files',
    badge: 5,
  },
  {
    name: 'Settings',
    description: 'Configure personalized account preferences.',
    icon: <Settings className="h-7 w-7 text-blue-600" />, 
    to: '/settings',
    badge: 6,
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {/* Greeting and Search */}
      <div className="w-full max-w-3xl text-center mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-green-400 mr-2"></span>
            <span className="font-bold text-lg text-blue-900">Serenity AI</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-full hover:bg-blue-100">
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">1</span>
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="h-8 w-8 rounded-full border-2 border-white shadow" />
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search properties, leads, or messages..."
            className="input w-full max-w-xl mx-auto text-base shadow focus:shadow-lg"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 text-left">Hello, John!</h1>
        <p className="text-lg text-gray-500 text-left">Track and manage your property inquiries today.</p>
      </div>
      {/* Feature Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <Link
            key={f.name}
            to={f.to}
            className="relative card card-hover flex flex-col items-start gap-3 bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-2xl min-h-[150px] transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gray-100">
                {f.icon}
              </span>
              <span className="text-lg font-semibold text-gray-900">{f.name}</span>
              <span className="badge badge-primary ml-2">{f.badge}</span>
            </div>
            <p className="text-gray-500 text-sm mb-2">{f.description}</p>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-4 right-6 text-gray-400 text-sm select-none cursor-pointer">Share</div>
    </div>
  );
} 