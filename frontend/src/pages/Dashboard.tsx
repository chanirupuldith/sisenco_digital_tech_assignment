import React from 'react';
import { getStoredUser } from '../services/authService';

const Dashboard: React.FC = () => {
    const auth = getStoredUser();

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Welcome, {auth?.user.username}!
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Here's your financial overview for today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Balance</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2">LKR 0.00</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;