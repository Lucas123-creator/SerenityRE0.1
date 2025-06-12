import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Lead Assigned',
    message: 'A new lead has been assigned to you: Alice Smith.',
    date: '2024-03-10',
    read: false,
  },
  {
    id: '2',
    title: 'Booking Confirmed',
    message: 'Booking for Cozy Suburban House has been confirmed.',
    date: '2024-03-09',
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data for now
    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-3xl mb-10 text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Notifications</h1>
        <p className="text-lg text-gray-500 mb-6">Stay up to date with your latest alerts and updates.</p>
      </div>
      <div className="w-full max-w-2xl card bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-2xl p-6">
        {loading ? (
          <div className="p-4 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className={`card bg-white/80 shadow-none border-0 ${n.read ? 'opacity-60' : ''}`}> 
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-gray-900">{n.title}</h2>
                    <p className="text-gray-600 text-sm">{n.message}</p>
                  </div>
                  <span className="text-xs text-gray-400">{n.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 