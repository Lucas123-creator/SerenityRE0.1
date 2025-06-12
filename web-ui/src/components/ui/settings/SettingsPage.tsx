import React, { useState } from 'react';

interface Settings {
  agencyName: string;
  primaryColor: string;
  secondaryColor: string;
  crmKey: string;
  whatsappNumber: string;
  calendarId: string;
}

export const SettingsPage = () => {
  const [settings, setSettings] = useState<Settings>({
    agencyName: '',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    crmKey: '',
    whatsappNumber: '',
    calendarId: '',
  });

  const [logo, setLogo] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Settings:', settings);
    console.log('Logo:', logo);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agency Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your agency's branding and integration settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Branding Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Branding</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700">
                  Agency Name
                </label>
                <input
                  type="text"
                  name="agencyName"
                  id="agencyName"
                  value={settings.agencyName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                  Logo
                </label>
                <div className="mt-1 flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                    {logo ? (
                      <img
                        src={URL.createObjectURL(logo)}
                        alt="Preview"
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <span className="text-gray-400">Logo</span>
                    )}
                  </div>
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="ml-5 block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    name="primaryColor"
                    id="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleInputChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    name="secondaryColor"
                    id="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={handleInputChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Integrations Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Integrations</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="crmKey" className="block text-sm font-medium text-gray-700">
                  CRM API Key
                </label>
                <input
                  type="password"
                  name="crmKey"
                  id="crmKey"
                  value={settings.crmKey}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  id="whatsappNumber"
                  value={settings.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="calendarId" className="block text-sm font-medium text-gray-700">
                  Google Calendar ID
                </label>
                <input
                  type="text"
                  name="calendarId"
                  id="calendarId"
                  value={settings.calendarId}
                  onChange={handleInputChange}
                  placeholder="calendar@group.calendar.google.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 