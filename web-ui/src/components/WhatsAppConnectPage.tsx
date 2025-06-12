import React, { useState } from 'react';

// Mocked QR code and WhatsApp number
const MOCK_QR = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://wa.me/40712345678?text=Hi%20I%27m%20interested%20in%20a%20property';
const AGENCY_NUMBER = '40712345678';
const WA_LINK = `https://wa.me/${AGENCY_NUMBER}?text=Hi%20I'm%20interested%20in%20a%20property`;

export const WhatsAppConnectPage = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(WA_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">Talk to your agent via WhatsApp</h1>
          <p className="text-gray-600 mb-6">Scan the QR to start chatting with our AI assistant.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <img
            src={MOCK_QR}
            alt="WhatsApp QR code"
            className="w-56 h-56 rounded-xl border-4 border-green-200 shadow mb-4"
          />
          <button
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy WhatsApp Link'}
          </button>
        </div>
        {/* Example chat preview */}
        <div className="w-full max-w-xs mt-8">
          <div className="flex flex-col gap-2">
            <div className="self-end bg-green-100 text-green-900 px-4 py-2 rounded-2xl rounded-br-sm shadow text-sm max-w-[80%]">
              Hi, I'm interested in a property!
            </div>
            <div className="self-start bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm shadow text-sm max-w-[80%] border border-green-100">
              Hello! I'm your AI assistant. What type of property are you looking for?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 