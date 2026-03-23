'use client';

import { useState, useCallback } from 'react';

export default function CoachAdvice() {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvice = useCallback(async () => {
    setAdvice('');
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/coach', { method: 'POST' });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed (${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        const text = await response.text();
        setAdvice(text);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setAdvice(accumulated);
      }

      // Flush any remaining bytes
      accumulated += decoder.decode();
      setAdvice(accumulated);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Coach Advice</h2>
        <button
          onClick={getAdvice}
          disabled={loading}
          className="bg-accent text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Thinking...' : advice ? 'Refresh Advice' : 'Get Weekly Advice'}
        </button>
      </div>

      {loading && !advice && (
        <p className="text-text-muted text-sm animate-pulse">Analyzing your data...</p>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {advice && (
        <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
          {advice}
        </div>
      )}

      {!advice && !loading && !error && (
        <p className="text-text-muted text-sm">
          Tap the button to get personalized advice based on your check-ins and nutrition logs.
        </p>
      )}
    </div>
  );
}
