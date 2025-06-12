import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface BrandingStepProps {
  onNext: () => void;
  onBack: () => void;
  onSave: (data: BrandingData) => void;
  initialData?: BrandingData;
}

interface BrandingData {
  agencyName: string;
  logo: File | null;
  primaryColor: string;
  secondaryColor: string;
  welcomeMessage: string;
}

export default function BrandingStep({ onNext, onBack, onSave, initialData }: BrandingStepProps) {
  const [formData, setFormData] = useState<BrandingData>({
    agencyName: initialData?.agencyName || '',
    logo: null,
    primaryColor: initialData?.primaryColor || '#2563EB',
    secondaryColor: initialData?.secondaryColor || '#1E40AF',
    welcomeMessage: initialData?.welcomeMessage || ''
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setFormData(prev => ({ ...prev, logo: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Brand Your Real Estate AI Assistant</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Agency Name */}
        <div>
          <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-2">
            Agency Name
          </label>
          <input
            type="text"
            id="agencyName"
            value={formData.agencyName}
            onChange={(e) => setFormData(prev => ({ ...prev, agencyName: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Enter your agency name"
            required
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agency Logo
          </label>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
            `}
          >
            <input {...getInputProps()} />
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Logo preview"
                  className="w-32 h-32 object-contain mb-4"
                />
                <p className="text-sm text-gray-500">Click or drag to replace</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  {isDragActive
                    ? "Drop your logo here"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Color Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                id="primaryColor"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="#2563EB"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                id="secondaryColor"
                value={formData.secondaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="#1E40AF"
              />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div>
          <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 mb-2">
            Welcome Message
          </label>
          <textarea
            id="welcomeMessage"
            value={formData.welcomeMessage}
            onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary h-32"
            placeholder="Enter a welcome message for your clients..."
            required
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
} 