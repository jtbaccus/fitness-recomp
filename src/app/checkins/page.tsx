'use client';

import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import { toLocalDateString, formatDate } from '@/lib/utils';
import type { CheckIn } from '@/types/database';

function ScoreInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-xs text-text-muted">{label}</label>
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-default ${
              n <= value ? 'bg-accent text-white' : 'bg-bg text-text-muted border border-border'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CheckInsPage() {
  const [date, setDate] = useState(toLocalDateString());
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [sleep, setSleep] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [compliance, setCompliance] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<CheckIn[]>([]);

  useEffect(() => {
    fetch('/api/checkins')
      .then(r => r.json())
      .then(setHistory)
      .catch(() => {});
  }, [saved]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          weight_lbs: parseFloat(weight) || null,
          waist_inches: parseFloat(waist) || null,
          sleep_score: sleep || null,
          energy_score: energy || null,
          compliance_score: compliance || null,
          notes: notes || null,
        }),
      });
      setSaved(true);
      setWeight('');
      setWaist('');
      setSleep(0);
      setEnergy(0);
      setCompliance(0);
      setNotes('');
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell title="Check-In" subtitle="Weekly body composition tracking">
      <div className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
        />

        <div className="bg-card rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-sm">Measurements</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted">Weight (lbs)</label>
              <input type="number" inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)}
                className="w-full mt-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none" placeholder="175" />
            </div>
            <div>
              <label className="text-xs text-text-muted">Waist (in)</label>
              <input type="number" inputMode="decimal" value={waist} onChange={e => setWaist(e.target.value)}
                className="w-full mt-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none" placeholder="33" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-sm">Scores</h3>
          <ScoreInput label="Sleep Quality" value={sleep} onChange={setSleep} />
          <ScoreInput label="Energy / Recovery" value={energy} onChange={setEnergy} />
          <ScoreInput label="Nutrition Compliance" value={compliance} onChange={setCompliance} />
        </div>

        <div className="bg-card rounded-xl p-4">
          <label className="text-xs text-text-muted">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            className="w-full mt-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none resize-none h-20"
            placeholder="How was the week? Visual changes? Clothes fit?" />
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-default disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Check-In'}
        </button>

        {history.length > 0 && (
          <div className="bg-card rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">History</h3>
            <div className="space-y-2">
              {history.slice(0, 8).map(ci => (
                <div key={ci.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-text-secondary">{formatDate(ci.date)}</span>
                  <div className="flex items-center gap-3 text-xs">
                    {ci.weight_lbs && <span>{ci.weight_lbs} lbs</span>}
                    {ci.waist_inches && <span>{ci.waist_inches}&quot;</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
