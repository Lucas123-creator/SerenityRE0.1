import React, { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  listings?: any[];
  escalate?: boolean;
}

const AgentEscalationBanner = () => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
    <strong>Agent Escalation:</strong> This lead is hot! An agent will follow up immediately.
  </div>
);

const ListingCard = ({ listing }: { listing: any }) => (
  <div className="min-w-[220px] max-w-xs bg-white rounded-lg shadow p-4 flex flex-col gap-2 mr-4">
    <div className="font-semibold text-lg">{listing.title}</div>
    <div className="text-gray-500 text-sm">{listing.location}</div>
    <div className="text-blue-700 font-bold text-xl">€{listing.price.toLocaleString()}</div>
    <div className="text-xs text-gray-400">{listing.type} • {listing.bedrooms}BR</div>
    {listing.url && (
      <a href={listing.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">View Listing</a>
    )}
  </div>
);

export const AIAssistantPanel = () => {
  const [messages, setMessages] = useState<Message[]>([{
    sender: 'ai',
    text: 'Hi! I am your real estate AI assistant. How can I help you today?'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/respond_to_client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        {
          sender: 'ai',
          text: data.reply,
          listings: data.listings,
          escalate: data.lead?.escalate
        }
      ]);
    } catch (e) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', text: 'Sorry, something went wrong. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="max-w-2xl mx-auto my-8 card p-0 flex flex-col h-[70vh]">
      <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 rounded-t-lg">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white text-gray-900 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {/* Escalation Banner and Listings for last AI message */}
        {(() => {
          const lastAI = [...messages].reverse().find((m) => m.sender === 'ai');
          return lastAI ? (
            <>
              {lastAI.escalate && <AgentEscalationBanner />}
              {lastAI.listings && lastAI.listings.length > 0 && (
                <div className="flex overflow-x-auto mt-2 pb-2">
                  {lastAI.listings.map((listing, i) => (
                    <ListingCard key={i} listing={listing} />
                  ))}
                </div>
              )}
            </>
          ) : null;
        })()}
      </div>
      <div className="border-t bg-white rounded-b-lg p-4 flex items-center gap-2">
        <input
          className="input flex-1"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}; 