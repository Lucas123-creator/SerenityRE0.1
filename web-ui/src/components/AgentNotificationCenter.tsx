import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

// Mock notifications hook
const useNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New hot lead: John D.',
      subtext: 'Looking to buy in Dubai',
      timestamp: '2 min ago',
      unread: true,
      action: 'View Lead',
    },
    {
      id: '2',
      title: 'Viewing booked',
      subtext: 'Alice S. scheduled for 3pm',
      timestamp: '10 min ago',
      unread: true,
      action: null,
    },
    {
      id: '3',
      title: 'CRM sync error',
      subtext: 'Failed to sync lead Bob J.',
      timestamp: '30 min ago',
      unread: false,
      action: null,
    },
    {
      id: '4',
      title: 'Chat escalation triggered',
      subtext: 'AI flagged urgent lead',
      timestamp: '1 hr ago',
      unread: false,
      action: 'View Lead',
    },
  ]);

  // Polling for updates every 30s (mock)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notification
      setNotifications((prev) => prev);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return {
    notifications: notifications.slice(0, 10),
    unreadCount: notifications.filter((n) => n.unread).length,
    markAsRead,
  };
};

export const AgentNotificationCenter = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold shadow">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in overflow-hidden">
          <div className="p-4 border-b font-semibold text-gray-800">Notifications</div>
          <div className="max-h-96 overflow-y-auto divide-y">
            {notifications.length === 0 && (
              <div className="p-4 text-gray-500">No notifications</div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex flex-col gap-1 px-4 py-3 cursor-pointer transition bg-white hover:bg-blue-50 focus:bg-blue-100 outline-none ${
                  n.unread ? 'font-bold text-gray-900' : 'text-gray-700'
                }`}
                tabIndex={0}
                onClick={() => markAsRead(n.id)}
                onKeyDown={(e) => e.key === 'Enter' && markAsRead(n.id)}
              >
                <div className="flex items-center justify-between">
                  <span>{n.title}</span>
                  {n.action && (
                    <button className="ml-2 btn btn-ghost text-xs px-2 py-1 rounded hover:bg-blue-100 focus:bg-blue-200">
                      {n.action}
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-500">{n.subtext}</span>
                <span className="text-xs text-gray-400">{n.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 