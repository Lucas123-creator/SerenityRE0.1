import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  description: string;
  image?: string;
}

const AGENCY_DOMAIN = 'https://serenity.agency';

export const PropertySharePanel = ({ property }: { property: Property }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shareLink = `${AGENCY_DOMAIN}/property/${property.id}`;
  const waLink = `https://wa.me/?text=${encodeURIComponent(
    `Check out this property: ${shareLink}`
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const handlePDF = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 48;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 24, 24, imgWidth, imgHeight);
    pdf.save(`${property.title.replace(/\s+/g, '_')}_summary.pdf`);
  };

  return (
    <div className="max-w-lg mx-auto card p-6 bg-white rounded-xl shadow-lg print:shadow-none print:bg-white">
      <div ref={cardRef} className="print:bg-white">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
          {property.image && (
            <img
              src={property.image}
              alt={property.title}
              className="w-40 h-32 object-cover rounded-lg border"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{property.title}</h2>
            <div className="text-blue-700 font-bold text-lg mb-1">€{property.price.toLocaleString()}</div>
            <div className="text-gray-600 text-sm mb-1">{property.location} • {property.type}</div>
            <div className="text-gray-700 text-sm mb-2">{property.description}</div>
            <div className="text-xs text-gray-400 print:hidden">ID: {property.id}</div>
          </div>
        </div>
        {/* Optional: Watermark for preview mode */}
        <div className="absolute top-4 right-4 opacity-10 text-4xl font-bold pointer-events-none select-none print:hidden">
          PREVIEW
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-6 print:hidden">
        <button
          className="btn btn-secondary"
          onClick={handleCopy}
        >
          Copy Share Link
        </button>
        <button
          className="btn btn-primary"
          onClick={handlePDF}
        >
          Export as PDF
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          Send via WhatsApp
        </a>
      </div>
    </div>
  );
}; 