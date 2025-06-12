import React, { useEffect, useState } from 'react';
import {
  Bot,
  Home,
  Star,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  FileText,
  User,
} from 'lucide-react';

const eventIcons: Record<string, React.ReactNode> = {
  'ai_intent': <Bot className="text-blue-500" />,
  'property_suggested': <Home className="text-green-500" />,
  'lead_scored': <Star className="text-yellow-500" />,
  'escalated': <ArrowUpRight className="text-red-500" />,
  'viewing_booked': <Calendar className="text-purple-500" />,
  'crm_synced': <CheckCircle className="text-teal-500" />,
  'note_added': <FileText className="text-gray-400" />,
};

// Mock fetch function
const fetchTimeline = async (leadId: string) => {
  return [
    {
      type: 'ai_intent',
      timestamp: '2024-06-20T09:00:00Z',
      summary: 'AI detected intent: Buy 2BR in Bucharest',
      meta: { intent: 'buy', location: 'Bucharest' },
    },
    {
      type: 'property_suggested',
      timestamp: '2024-06-20T09:01:00Z',
      summary: 'Recommended 3 villas',
      meta: { properties: ['Villa Verde', 'Sunset House', 'Central Loft'] },
    },
    {
      type: 'lead_scored',
      timestamp: '2024-06-20T09:02:00Z',
      summary: 'Lead scored: 0.92 (hot)',
      meta: { score: 0.92 },
    },
    {
      type: 'escalated',
      timestamp: '2024-06-20T09:03:00Z',
      summary: 'Escalated to agent: Sarah Johnson',
      meta: { agent: 'Sarah Johnson' },
    },
    {
      type: 'viewing_booked',
      timestamp: '2024-06-20T09:10:00Z',
      summary: 'Viewing booked for Villa Verde',
      meta: { property: 'Villa Verde', date: '2024-06-22', time: '15:00' },
    },
    {
      type: 'crm_synced',
      timestamp: '2024-06-20T09:15:00Z',
      summary: 'Lead synced to CRM',
      meta: { crm: 'HubSpot', status: 'success' },
    },
    {
      type: 'note_added',
      timestamp: '2024-06-20T09:20:00Z',
      summary: 'Note added by agent',
      meta: { note: 'Client prefers afternoon viewings.' },
    },
  ];
};

export const LeadTimeline = ({ leadId }: { leadId: string }) => {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchTimeline(leadId).then((data) => {
      if (mounted) {
        setTimeline(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [leadId]);

  return (
    <div className="overflow-y-auto max-h-[70vh] px-2">
      <div className="border-l-2 border-gray-200 pl-4">
        {loading ? (
          <div className="text-gray-400">Loading timeline...</div>
        ) : (
          timeline.map((event, idx) => (
            <div
              key={idx}
              className={`relative mb-8 pl-6 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded-lg py-4 transition-all`}
            >
              <span className="absolute -left-6 top-6 flex items-center justify-center w-10 h-10 bg-white border-2 border-blue-100 rounded-full shadow">
                {eventIcons[event.type] || <User className="text-gray-400" />}
              </span>
              <div className="text-xs text-gray-400 mb-1">
                {new Date(event.timestamp).toLocaleString()}
              </div>
              <div className="font-semibold text-gray-800 mb-1">{event.summary}</div>
              {event.meta && (
                <div className="text-xs text-gray-600">
                  {Object.entries(event.meta).map(([k, v]) => (
                    <span key={k} className="mr-2">
                      <span className="font-medium text-gray-500">{k}:</span> {Array.isArray(v) ? v.join(', ') : String(v)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 