import React, { useState, useRef, useEffect } from 'react';

// Mock agent list hook
const useAgents = () => [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Emily Davis' },
];

interface Lead {
  id: string;
  name: string;
  budget: number;
  location: string;
  score: number;
}

interface AssignLeadModalProps {
  lead: Lead;
  onClose: () => void;
}

export const AssignLeadModal = ({ lead, onClose }: AssignLeadModalProps) => {
  const agents = useAgents();
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus first input
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleAssign = async () => {
    setLoading(true);
    try {
      // POST to /api/crm/sync
      await fetch('/api/crm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: lead.id,
          assigned_agent: selectedAgent,
          note,
        }),
      });
      // Log note
      await fetch(`/api/leads/${lead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 1500);
    } catch (e) {
      alert('Failed to assign lead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 outline-none"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-xl font-bold mb-4">Assign Lead to Agent</h2>
        <div className="mb-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{lead.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Budget:</span>
            <span>€{lead.budget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Location:</span>
            <span>{lead.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Score:</span>
            <span>{lead.score}</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Assign to Agent</label>
          <select
            className="input w-full"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Lead Note</label>
          <textarea
            className="input w-full min-h-[60px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for the CRM..."
          />
        </div>
        <div className="flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleAssign}
            disabled={loading}
          >
            {loading ? 'Assigning...' : 'Assign + Sync'}
          </button>
        </div>
        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
            Lead assigned and synced!
          </div>
        )}
      </div>
    </div>
  );
}; 