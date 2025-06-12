import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  properties?: Property[];
}

interface Property {
  title: string;
  price: string;
  location: string;
  imageUrl: string;
  beds: number;
  baths: number;
  area: string;
  type: 'sale' | 'rent';
}

interface AIAssistantPanelProps {
  agencyConfig: {
    name: string;
    logo?: string;
  };
}

// WhatsApp-style message bubble
function MessageBubble({ msg, isUser, time }: { msg: string; isUser: boolean; time: string }) {
  return (
    <div
      className={`relative flex ${isUser ? 'justify-end' : 'justify-start'} w-full animate-fade-in`}
    >
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md transition-all duration-300
          ${isUser
            ? 'bg-gradient-to-br from-green-400 to-green-600 text-white rounded-br-sm'
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'}
        `}
        style={{
          borderBottomRightRadius: isUser ? '0.5rem' : undefined,
          borderBottomLeftRadius: !isUser ? '0.5rem' : undefined,
        }}
      >
        <span className="block text-base whitespace-pre-line break-words">{msg}</span>
        <span className={`block text-xs mt-1 ${isUser ? 'text-green-100' : 'text-gray-400'}`}>{time}</span>
      </div>
    </div>
  );
}

export default function AIAssistantPanel({ agencyConfig }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'I found some properties that match your criteria:',
          timestamp: new Date(),
          properties: [
            {
              title: 'Modern Downtown Apartment',
              price: '$450,000',
              location: 'Downtown District',
              imageUrl: '/api/placeholder/300/200',
              beds: 2,
              baths: 2,
              area: '1,200 sq ft',
              type: 'sale'
            },
            {
              title: 'Luxury Waterfront Villa',
              price: '$2,500/mo',
              location: 'Marina Bay',
              imageUrl: '/api/placeholder/300/200',
              beds: 3,
              baths: 2,
              area: '1,800 sq ft',
              type: 'rent'
            }
          ]
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {agencyConfig.logo ? (
                <img
                  src={agencyConfig.logo}
                  alt={agencyConfig.name}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AI</span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{agencyConfig.name}</h1>
                <p className="text-sm text-gray-500">AI Real Estate Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
              <button className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Settings</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[70%] rounded-2xl px-6 py-4
                  ${msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 shadow-sm'
                  }
                `}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{agencyConfig.name}</span>
                  </div>
                )}
                
                <div className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                  {msg.text}
                </div>
                
                <div className={`text-xs mt-2 ${
                  msg.role === 'user' ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                </div>

                {msg.properties && msg.properties.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {msg.properties.map((property, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-medium text-gray-900">{property.title}</h3>
                        <p className="text-primary font-semibold mt-1">{property.price}</p>
                        <p className="text-sm text-gray-500 mt-1">{property.location}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{property.beds} beds</span>
                          <span>{property.baths} baths</span>
                          <span>{property.area}</span>
                        </div>
                        <button className="w-full mt-3 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              title="Voice input"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about properties, schedule viewings, or get market insights..."
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-4"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
            >
              <span>Send</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 