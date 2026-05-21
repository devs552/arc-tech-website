'use client';

import { useEffect, useState } from 'react';

export default function DebugFavicon() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
        console.log('Full API response:', data);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', color: '#fff' }}>
      <h1>Favicon Debug</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {settings && (
        <div style={{ backgroundColor: '#222', padding: '10px', borderRadius: '5px' }}>
          <p><strong>Full Settings Object:</strong></p>
          <pre>{JSON.stringify(settings, null, 2)}</pre>
          
          <p><strong>Favicon Value:</strong> {settings.favicon || 'EMPTY'}</p>
          <p><strong>Favicon Type:</strong> {typeof settings.favicon}</p>
          <p><strong>Favicon Length:</strong> {settings.favicon?.length || 0}</p>
          
          {settings.favicon && (
            <>
              <p><strong>Favicon URL Preview:</strong></p>
              <a href={settings.favicon} target="_blank" rel="noopener noreferrer">
                {settings.favicon}
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
