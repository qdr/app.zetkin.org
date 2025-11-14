'use client';

import { useEffect, useState } from 'react';

export default function TestSessionPage() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/session')
      .then((res) => res.json())
      .then((data) => setSessionData(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Session Test Page</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {sessionData && (
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(sessionData, null, 2)}
        </pre>
      )}
    </div>
  );
}
