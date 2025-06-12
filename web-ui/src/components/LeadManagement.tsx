import React, { useState, useEffect } from 'react';
import { crmService } from '../config/services';
import { whatsappService } from '../config/services';
import { aiService } from '../config/services';

interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeadAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  intent: string;
  suggestedActions: string[];
  priority: 'high' | 'medium' | 'low';
}

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const fetchedLeads = await crmService.getLeads();
      setLeads(fetchedLeads);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelect = async (lead: Lead) => {
    setSelectedLead(lead);
    try {
      const leadAnalysis = await aiService.analyzeLead(lead);
      setAnalysis(leadAnalysis);
    } catch (err) {
      console.error('Failed to analyze lead:', err);
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: Lead['status']) => {
    try {
      await crmService.updateLead(leadId, { status: newStatus });
      await fetchLeads();
    } catch (err) {
      setError('Failed to update lead status');
      console.error(err);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedLead) return;

    try {
      const success = await whatsappService.sendMessage({
        to: selectedLead.phone,
        type: 'text',
        content: { text: message },
      });

      if (success) {
        // Update lead notes or status as needed
        await crmService.updateLead(selectedLead.id!, {
          notes: `${selectedLead.notes || ''}\nSent message: ${message}`,
        });
        await fetchLeads();
      }
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      lost: 'bg-red-100 text-red-800',
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
      <h1 className="text-3xl font-bold mb-8">Lead Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leads List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Leads</h2>
          </div>
          <div className="divide-y">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedLead?.id === lead.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleLeadSelect(lead)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{lead.name}</h3>
                    <p className="text-sm text-gray-600">{lead.email}</p>
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Details and Actions */}
        <div className="lg:col-span-2">
          {selectedLead ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedLead.name}</h2>
                    <p className="text-gray-600">{selectedLead.email}</p>
                    <p className="text-gray-600">{selectedLead.phone}</p>
                  </div>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusUpdate(selectedLead.id!, e.target.value as Lead['status'])}
                    className="rounded-lg border-gray-300"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                {analysis && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">AI Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Sentiment</p>
                        <p className="font-medium">{analysis.sentiment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Priority</p>
                        <p className="font-medium">{analysis.priority}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Intent</p>
                        <p className="font-medium">{analysis.intent}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Suggested Actions</p>
                        <ul className="list-disc list-inside">
                          {analysis.suggestedActions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold">Send Message</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border-gray-300"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input');
                        if (input) {
                          handleSendMessage(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Select a lead to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 