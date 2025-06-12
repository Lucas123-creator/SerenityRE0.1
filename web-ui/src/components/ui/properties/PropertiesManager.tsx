import React, { useState } from 'react';

interface Property {
  id: string;
  title: string;
  price: number;
  status: 'Available' | 'Sold' | 'Pending';
  image: string;
  location: string;
}

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Villa with Pool',
    price: 1250000,
    status: 'Available',
    image: '/images/properties/villa-1.jpg',
    location: 'Palm Jumeirah',
  },
  {
    id: '2',
    title: 'Downtown Luxury Apartment',
    price: 850000,
    status: 'Pending',
    image: '/images/properties/apartment-1.jpg',
    location: 'Downtown Dubai',
  },
  // Add more mock properties...
];

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  const statusColors = {
    Available: 'bg-green-100 text-green-800',
    Sold: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gray-200">
          {/* Placeholder for image */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Image Placeholder
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[property.status]}`}>
            {property.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{property.location}</p>
        <p className="mt-2 text-xl font-semibold text-gray-900">
          ${property.price.toLocaleString()}
        </p>
        <div className="mt-4 flex gap-2">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            View
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export const PropertiesManager = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = mockProperties.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Add Property
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <input
          type="text"
          placeholder="Search by title, location, or ID..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}; 