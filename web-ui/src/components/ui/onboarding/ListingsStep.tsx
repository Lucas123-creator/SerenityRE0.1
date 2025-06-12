import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ListingsStepProps {
  onNext: () => void;
  onBack: () => void;
  onSave: (data: ListingsData) => void;
  initialData?: ListingsData;
}

interface ListingsData {
  importMethod: 'api' | 'csv' | 'manual';
  apiEndpoint?: string;
  apiKey?: string;
  csvFile?: File;
  mlsProvider?: string;
}

export default function ListingsStep({ onNext, onBack, onSave, initialData }: ListingsStepProps) {
  const [formData, setFormData] = useState<ListingsData>({
    importMethod: initialData?.importMethod || 'api',
    apiEndpoint: initialData?.apiEndpoint || '',
    apiKey: initialData?.apiKey || '',
    mlsProvider: initialData?.mlsProvider || ''
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxSize: 10485760, // 10MB
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setFormData(prev => ({ ...prev, csvFile: file }));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Import Your Property Listings</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Import Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Choose Import Method
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['api', 'csv', 'manual'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, importMethod: method as 'api' | 'csv' | 'manual' }))}
                className={`
                  p-4 border-2 rounded-lg text-left
                  ${formData.importMethod === method
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${formData.importMethod === method ? 'bg-primary' : 'bg-gray-100'}
                  `}>
                    {method === 'api' && (
                      <svg className={`w-6 h-6 ${formData.importMethod === method ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {method === 'csv' && (
                      <svg className={`w-6 h-6 ${formData.importMethod === method ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {method === 'manual' && (
                      <svg className={`w-6 h-6 ${formData.importMethod === method ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {method === 'api' ? 'API Integration' : method === 'csv' ? 'CSV Upload' : 'Manual Entry'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {method === 'api'
                        ? 'Connect via MLS or custom API'
                        : method === 'csv'
                        ? 'Upload a CSV file'
                        : 'Add properties manually'
                      }
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* API Configuration */}
        {formData.importMethod === 'api' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="mlsProvider" className="block text-sm font-medium text-gray-700 mb-2">
                MLS Provider
              </label>
              <select
                id="mlsProvider"
                value={formData.mlsProvider}
                onChange={(e) => setFormData(prev => ({ ...prev, mlsProvider: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="">Select a provider</option>
                <option value="rets">RETS</option>
                <option value="bridge">Bridge API</option>
                <option value="spark">Spark Platform</option>
                <option value="custom">Custom Integration</option>
              </select>
            </div>

            <div>
              <label htmlFor="apiEndpoint" className="block text-sm font-medium text-gray-700 mb-2">
                API Endpoint
              </label>
              <input
                type="url"
                id="apiEndpoint"
                value={formData.apiEndpoint}
                onChange={(e) => setFormData(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="https://api.example.com/v1/listings"
              />
            </div>

            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={formData.apiKey}
                onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Enter your API key"
              />
            </div>
          </div>
        )}

        {/* CSV Upload */}
        {formData.importMethod === 'csv' && (
          <div>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
              `}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
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
                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">
                    {isDragActive
                      ? "Drop your CSV file here"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    CSV files up to 10MB
                  </p>
                </div>
                {formData.csvFile && (
                  <div className="mt-4 text-sm text-gray-900">
                    Selected file: {formData.csvFile.name}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
              <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>First row must contain column headers</li>
                <li>Required columns: title, price, location, beds, baths, area</li>
                <li>Optional columns: description, amenities, images</li>
                <li>Use comma (,) as delimiter</li>
              </ul>
            </div>
          </div>
        )}

        {/* Manual Entry Guide */}
        {formData.importMethod === 'manual' && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Entry Instructions</h3>
            <div className="prose prose-sm text-gray-500">
              <p>
                After completing the onboarding process, you'll be able to add properties manually through the dashboard:
              </p>
              <ol className="list-decimal list-inside mt-4 space-y-2">
                <li>Navigate to the Properties section in your dashboard</li>
                <li>Click the "Add New Property" button</li>
                <li>Fill in the property details form</li>
                <li>Upload property images</li>
                <li>Set pricing and availability</li>
                <li>Publish the listing</li>
              </ol>
              <p className="mt-4">
                You can also bulk import properties later using the API or CSV upload methods if needed.
              </p>
            </div>
          </div>
        )}

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