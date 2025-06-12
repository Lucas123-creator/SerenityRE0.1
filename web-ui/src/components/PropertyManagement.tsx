import React, { useState, useEffect } from 'react';
import { crmService } from '../config/services';
import { aiService } from '../config/services';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  status: 'available' | 'sold' | 'pending';
  images: string[];
  features: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
}

export default function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API call
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Modern Apartment in City Center',
          description: 'Beautiful modern apartment with great views',
          price: 250000,
          location: 'City Center',
          status: 'available',
          images: ['/images/property1.jpg'],
          features: ['Parking', 'Gym', 'Pool'],
          bedrooms: 2,
          bathrooms: 2,
          area: 120,
        },
        // Add more mock properties as needed
      ];
      setProperties(mockProperties);
      setError(null);
    } catch (err) {
      setError('Failed to fetch properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleStatusUpdate = async (propertyId: string, newStatus: Property['status']) => {
    try {
      // This would be replaced with actual API call
      setProperties(properties.map(p => 
        p.id === propertyId ? { ...p, status: newStatus } : p
      ));
    } catch (err) {
      setError('Failed to update property status');
      console.error(err);
    }
  };

  const handleGenerateDescription = async () => {
    if (!selectedProperty) return;

    try {
      setIsGeneratingDescription(true);
      const description = await aiService.generatePropertyDescription(selectedProperty);
      setSelectedProperty({ ...selectedProperty, description });
    } catch (err) {
      setError('Failed to generate description');
      console.error(err);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const getStatusColor = (status: Property['status']) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sold: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Property Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Properties List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Properties</h2>
          </div>
          <div className="divide-y">
            {properties.map((property) => (
              <div
                key={property.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedProperty?.id === property.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => handlePropertySelect(property)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.location}</p>
                    <p className="text-sm font-medium">${property.price.toLocaleString()}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="lg:col-span-2">
          {selectedProperty ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
                    <p className="text-gray-600">{selectedProperty.location}</p>
                    <p className="text-xl font-bold mt-2">
                      ${selectedProperty.price.toLocaleString()}
                    </p>
                  </div>
                  <select
                    value={selectedProperty.status}
                    onChange={(e) => handleStatusUpdate(selectedProperty.id, e.target.value as Property['status'])}
                    className="rounded-lg border-gray-300"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-medium">{selectedProperty.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-medium">{selectedProperty.bathrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="font-medium">{selectedProperty.area} m²</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Description</h3>
                    <button
                      onClick={handleGenerateDescription}
                      disabled={isGeneratingDescription}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                    >
                      {isGeneratingDescription ? 'Generating...' : 'Generate with AI'}
                    </button>
                  </div>
                  <p className="text-gray-700">{selectedProperty.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Select a property to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 