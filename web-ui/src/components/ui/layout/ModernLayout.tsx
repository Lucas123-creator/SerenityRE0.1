import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Home,
  Users,
  MessageCircle,
  BarChart2,
  FileText,
  Bell,
  Settings,
  Menu,
  X,
  Globe,
  User as UserIcon,
} from 'lucide-react';
import { DarkModeToggle } from '../../DarkModeToggle';

const navItems = [
  { name: 'Properties', icon: <Home />, path: '/properties', tooltip: 'Properties' },
  { name: 'Leads', icon: <Users />, path: '/leads', tooltip: 'Leads' },
  { name: 'Messages', icon: <MessageCircle />, path: '/messages', tooltip: 'Messages' },
  { name: 'Analytics', icon: <BarChart2 />, path: '/analytics', tooltip: 'Analytics' },
  { name: 'Files', icon: <FileText />, path: '/files', tooltip: 'Files' },
  { name: 'Notifications', icon: <Bell />, path: '/notifications', tooltip: 'Notifications' },
  { name: 'Settings', icon: <Settings />, path: '/settings', tooltip: 'Settings' },
];

const titleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/properties': 'Properties',
  '/leads': 'Leads',
  '/messages': 'Messages',
  '/analytics': 'Analytics',
  '/files': 'Files',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/bookings': 'Bookings',
};

export const ModernLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState('EN');

  const currentPath = Object.keys(titleMap).find((key) => location.pathname.startsWith(key)) || '/';
  const pageTitle = titleMap[currentPath];

  // Sidebar width classes
  const sidebarWidth = sidebarOpen ? 'w-64' : 'w-16';
  const contentMargin = sidebarOpen ? 'ml-64' : 'ml-16';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen ${sidebarWidth} z-40 transition-all duration-300 bg-white/80 backdrop-blur-md shadow-lg rounded-tr-3xl rounded-br-3xl flex flex-col justify-between border-r border-gray-200`}
      >
        <div>
          {/* Hamburger Toggle */}
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} px-4 py-5`}>
            {sidebarOpen && (
              <span className="font-extrabold text-lg tracking-tight text-blue-700">RE</span>
            )}
            <button
              className="p-2 rounded hover:bg-blue-100 transition"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <Menu size={22} /> : <X size={22} />}
            </button>
          </div>
          {/* Nav Icons */}
          <nav className="flex flex-col gap-2 mt-8">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center h-12 mx-2 my-1 rounded-xl transition-all duration-200 hover:bg-blue-100/70 relative ${
                    isActive ? 'bg-blue-100 text-blue-700 shadow' : 'text-gray-500'
                  } ${sidebarOpen ? 'px-4' : 'justify-center px-0 w-12'}`}
                  title={item.tooltip}
                >
                  <span className="flex items-center justify-center w-8 h-8">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="ml-4 text-base font-medium transition-opacity duration-200 opacity-100">{item.name}</span>
                  )}
                  {/* Tooltip for collapsed */}
                  {!sidebarOpen && (
                    <span className="absolute left-14 whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.tooltip}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        {/* User Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <button className="avatar avatar-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserIcon size={24} />
            </button>
            {sidebarOpen && (
              <div className="absolute left-14 bottom-0 bg-white shadow-lg rounded-lg p-2 min-w-[120px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <div className="px-2 py-1 text-sm text-gray-700">John Doe</div>
                <button className="w-full text-left px-2 py-1 text-sm text-gray-500 hover:text-blue-700">Logout</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Topbar */}
      <header className={`fixed top-0 left-0 w-full z-30 h-16 flex items-center bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm transition-all duration-300 ${contentMargin}`} style={{ marginLeft: 0 }}>
        <div className={`flex items-center w-full max-w-7xl mx-auto px-6`}>
          <h1 className="text-xl font-bold text-gray-900 flex-1 truncate">{pageTitle}</h1>
          {/* Search Bar */}
          <div className="relative w-64 mr-4">
            <input
              type="text"
              placeholder="Search..."
              className="input pl-10 pr-4 py-2 w-full transition-all duration-200 focus:w-72 focus:shadow-lg"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
          {/* Notification Icon */}
          <button className="relative mr-4 p-2 rounded hover:bg-blue-100">
            <Bell className="h-6 w-6 text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">2</span>
          </button>
          {/* Language Switcher */}
          <div className="relative mr-4">
            <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">
              <Globe className="h-4 w-4" /> {lang}
            </button>
          </div>
          <DarkModeToggle />
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="ml-4 h-8 w-8 rounded-full border-2 border-white shadow" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`transition-all duration-300 pt-24 ${contentMargin}`}>
        <div className="max-w-7xl mx-auto p-6">
          <div className="rounded-xl bg-white shadow-md p-6 min-h-[70vh]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}; 