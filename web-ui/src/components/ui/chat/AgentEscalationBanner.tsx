import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AgentEscalationBannerProps {
  isHotLead: boolean;
  agentName?: string;
  agentAvatar?: string;
}

export function AgentEscalationBanner({
  isHotLead,
  agentName = 'Sarah Johnson',
  agentAvatar = '/images/agent-avatar.jpg',
}: AgentEscalationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isHotLead) {
      setIsVisible(true);
    }
  }, [isHotLead]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 transform transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="container mx-auto max-w-4xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white">
            <Image
              src={agentAvatar}
              alt={agentName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium opacity-90">Live agent has joined the conversation</p>
            <p className="text-lg font-semibold">{agentName}</p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close banner"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 