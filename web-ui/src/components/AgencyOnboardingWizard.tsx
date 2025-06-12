import React, { useState } from 'react';

// --- Step 1: Brand Setup ---
const BrandStep = ({ data, onChange }: any) => (
  <div className="space-y-4">
    <div>
      <label className="block font-medium mb-1">Agency Name *</label>
      <input
        className="input w-full"
        type="text"
        value={data.name || ''}
        onChange={e => onChange({ ...data, name: e.target.value })}
        required
      />
    </div>
    <div>
      <label className="block font-medium mb-1">Logo</label>
      <input
        className="input w-full"
        type="file"
        accept="image/*"
        onChange={e => onChange({ ...data, logo: e.target.files?.[0] })}
      />
    </div>
    <div>
      <label className="block font-medium mb-1">Brand Color</label>
      <input
        className="input w-24 h-10 p-0"
        type="color"
        value={data.color || '#2563eb'}
        onChange={e => onChange({ ...data, color: e.target.value })}
      />
    </div>
  </div>
);

// --- Step 2: Language ---
const LanguageStep = ({ data, onChange }: any) => (
  <div className="space-y-4">
    <div>
      <label className="block font-medium mb-1">Default Language *</label>
      <select
        className="input w-full"
        value={data.language || 'en'}
        onChange={e => onChange({ ...data, language: e.target.value })}
        required
      >
        <option value="en">English</option>
        <option value="ro">Romanian</option>
        <option value="es">Spanish</option>
      </select>
    </div>
    <div>
      <label className="block font-medium mb-1">Assistant Tone</label>
      <select
        className="input w-full"
        value={data.tone || 'friendly'}
        onChange={e => onChange({ ...data, tone: e.target.value })}
      >
        <option value="friendly">Friendly</option>
        <option value="professional">Professional</option>
        <option value="concise">Concise</option>
      </select>
    </div>
  </div>
);

// --- Step 3: CRM Integration ---
const CRMStep = ({ data, onChange }: any) => (
  <div className="space-y-4">
    <div>
      <label className="block font-medium mb-1">CRM Provider *</label>
      <select
        className="input w-full"
        value={data.crm || ''}
        onChange={e => onChange({ ...data, crm: e.target.value })}
        required
      >
        <option value="">Select CRM</option>
        <option value="hubspot">HubSpot</option>
        <option value="salesforce">Salesforce</option>
        <option value="pipedrive">Pipedrive</option>
        <option value="custom">Custom</option>
      </select>
    </div>
    <div>
      <label className="block font-medium mb-1">API Key *</label>
      <input
        className="input w-full"
        type="text"
        value={data.apiKey || ''}
        onChange={e => onChange({ ...data, apiKey: e.target.value })}
        required
      />
    </div>
  </div>
);

// --- Step 4: Calendar Sync ---
const CalendarStep = ({ data, onChange }: any) => (
  <div className="space-y-4">
    <label className="block font-medium mb-1">Calendar Provider</label>
    <div className="flex gap-4">
      <button
        className={`btn ${data.calendar === 'google' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onChange({ ...data, calendar: 'google' })}
        type="button"
      >
        Google
      </button>
      <button
        className={`btn ${data.calendar === 'outlook' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onChange({ ...data, calendar: 'outlook' })}
        type="button"
      >
        Outlook
      </button>
    </div>
  </div>
);

// --- Step 5: WhatsApp Number ---
const WhatsAppStep = ({ data, onChange }: any) => (
  <div className="space-y-4">
    <label className="block font-medium mb-1">WhatsApp Number *</label>
    <input
      className="input w-full"
      type="tel"
      value={data.whatsapp || ''}
      onChange={e => {
        // Auto-format phone number (simple)
        let val = e.target.value.replace(/[^\d+]/g, '');
        if (!val.startsWith('+')) val = '+' + val;
        onChange({ ...data, whatsapp: val });
      }}
      required
      placeholder="+40712345678"
    />
  </div>
);

// --- Step 6: Preview ---
const PreviewStep = ({ data }: any) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      {data.logo && (
        <img
          src={data.logo instanceof File ? URL.createObjectURL(data.logo) : data.logo}
          alt="Logo preview"
          className="h-16 w-16 rounded-full object-cover border"
        />
      )}
      <div>
        <div className="text-xl font-bold">{data.name}</div>
        <div className="text-sm text-gray-500">{data.language?.toUpperCase()} • {data.tone}</div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="font-medium">Brand Color</div>
        <div className="w-8 h-8 rounded-full border" style={{ background: data.color }} />
      </div>
      <div>
        <div className="font-medium">CRM</div>
        <div>{data.crm}</div>
      </div>
      <div>
        <div className="font-medium">Calendar</div>
        <div>{data.calendar}</div>
      </div>
      <div>
        <div className="font-medium">WhatsApp</div>
        <div>{data.whatsapp}</div>
      </div>
    </div>
  </div>
);

// --- useWizard Hook ---
const steps = [
  { label: 'Brand Setup', component: BrandStep },
  { label: 'Language', component: LanguageStep },
  { label: 'CRM Integration', component: CRMStep },
  { label: 'Calendar Sync', component: CalendarStep },
  { label: 'WhatsApp Number', component: WhatsAppStep },
  { label: 'Preview', component: PreviewStep },
];

function useWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({});
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const goTo = (idx: number) => setStep(idx);
  return { step, setStep: goTo, next, back, data, setData };
}

// --- File Upload Stub ---
async function uploadFile(file: File) {
  // Simulate upload
  return new Promise<string>((resolve) => setTimeout(() => resolve(URL.createObjectURL(file)), 1000));
}

// --- Main Wizard Component ---
export const AgencyOnboardingWizard = () => {
  const { step, setStep, next, back, data, setData } = useWizard();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const StepComponent = steps[step].component;

  const handleNext = async () => {
    setError('');
    // Validate required fields
    if (step === 0 && !data.name) return setError('Agency name is required.');
    if (step === 1 && !data.language) return setError('Language is required.');
    if (step === 2 && (!data.crm || !data.apiKey)) return setError('CRM and API key required.');
    if (step === 4 && !data.whatsapp) return setError('WhatsApp number required.');
    if (step === 5) {
      setSubmitting(true);
      let logoUrl = data.logo;
      if (data.logo instanceof File) {
        logoUrl = await uploadFile(data.logo);
      }
      // Simulate save to /api/settings
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, logo: logoUrl }),
      });
      setSubmitting(false);
      alert('Onboarding complete!');
      return;
    }
    next();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <button
                key={s.label}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  i === step
                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500 hover:bg-blue-100'
                }`}
                onClick={() => setStep(i)}
                aria-label={s.label}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="text-lg font-semibold text-gray-700">{steps[step].label}</div>
        </div>
        <div className="mb-6 min-h-[220px] transition-all duration-300">
          <StepComponent data={data} onChange={setData} />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex justify-between items-center mt-6">
          <button
            className="btn btn-secondary"
            onClick={back}
            disabled={step === 0 || submitting}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : step === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}; 