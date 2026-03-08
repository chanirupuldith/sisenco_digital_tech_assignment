import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const [status, setStatus] = useState<string>('Connecting...');

    useEffect(() => {
        axios.get('http://localhost:5000/api/health')
            .then(res => setStatus(res.data.message))
            .catch(() => setStatus('Backend Offline ❌'));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to the ERP System</h1>
            <p className="text-xl text-green-400 mb-8">{status}</p>

            <div className="flex gap-4">
                <Link to="/login" className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
                    Login
                </Link>
                <Link to="/register" className="px-6 py-2 border border-gray-600 rounded hover:bg-gray-800 transition">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Home;