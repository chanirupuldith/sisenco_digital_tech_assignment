import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [dbStatus, setDbStatus] = useState<string>('Connecting...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calling the health check endpoint we created in the backend
    axios
      .get('http://localhost:5000/api/health')
      .then((res) => {
        setDbStatus(res.data.message);
      })
      .catch((err) => {
        setError(
          'Could not connect to backend. Check CORS or if server is running.'
        );
        console.error(err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          System Initialization Test
        </h1>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <span className="text-slate-300 font-medium">Tailwind CSS:</span>
            <span className="text-green-400 font-bold">Active</span>
          </div>

          <div className="flex flex-col p-4 bg-slate-700 rounded-lg">
            <span className="text-slate-300 font-medium mb-1">
              Database Status:
            </span>
            {error ? (
              <span className="text-red-400 text-sm">{error}</span>
            ) : (
              <span className="text-blue-400 font-mono text-sm">
                {dbStatus}
              </span>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-slate-500 text-xs">
          If both are green/blue, initialization is complete.
        </p>
      </div>
    </div>
  );
}

export default App;
