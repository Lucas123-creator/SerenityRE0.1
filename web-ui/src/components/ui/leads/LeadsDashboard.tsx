import React, { useState } from 'react';
import { format } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  type: 'buy' | 'rent';
  score: 'hot' | 'warm' | 'cold';
  createdAt: Date;
  email: string;
  phone: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    type: 'buy',
    score: 'hot',
    createdAt: new Date('2024-03-01'),
    email: 'john@example.com',
    phone: '+971 50 123 4567',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    type: 'rent',
    score: 'warm',
    createdAt: new Date('2024-02-28'),
    email: 'sarah@example.com',
    phone: '+971 54 987 6543',
  },
  // Add more mock leads...
];

const scoreColors = {
  hot: 'bg-red-100 text-red-800',
  warm: 'bg-yellow-100 text-yellow-800',
  cold: 'bg-blue-100 text-blue-800',
};

export const LeadsDashboard = () => {
  const [selectedScore, setSelectedScore] = useState<string>('all');

  const filteredLeads = selectedScore === 'all'
    ? mockLeads
    : mockLeads.filter(lead => lead.score === selectedScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all leads including their name, type, score, and contact information.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedScore('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedScore === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {['hot', 'warm', 'cold'].map((score) => (
            <button
              key={score}
              onClick={() => setSelectedScore(score)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedScore === score
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {score.charAt(0).toUpperCase() + score.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Score
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-gray-500">{lead.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="capitalize">{lead.type}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${scoreColors[lead.score]}`}>
                          {lead.score.toUpperCase()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(lead.createdAt, 'MMM d, yyyy')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex gap-2 justify-end">
                          <button className="text-blue-600 hover:text-blue-900">
                            View
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            Message
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 