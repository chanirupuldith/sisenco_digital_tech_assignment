import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService';
import { toast } from 'sonner';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ username: '', email: '', password: '' });
        setError('');
        setShowPassword(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await loginUser({ email: formData.email, password: formData.password });
                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                await registerUser(formData);
                toast.success('Account created! Please sign in.');
                setIsLogin(true);
                setFormData({ ...formData, password: '' });
            }
        } catch (err: any) {
            const responseData = err.response?.data;
            let errorMsg = 'An unexpected error occurred.';

            if (responseData?.errors && Array.isArray(responseData.errors)) {
                errorMsg = responseData.errors[0].msg;
            } else if (responseData?.message) {
                errorMsg = responseData.message;
            }

            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

                <div className="p-8 pb-4 text-center">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {isLogin ? 'Enter your details to access your account' : 'Fill in the information to get started'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
                    {error && (
                        <div className={`p-3 rounded-lg text-sm border ${error.includes('created')
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                            : 'bg-rose-50 border-rose-100 text-rose-700'
                            }`}>
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                            <input
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                placeholder="Enter your username"
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                            placeholder="Enter your email"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none pr-12"
                                placeholder="Enter your password"
                                onChange={handleInputChange}
                            />
                            
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors px-2"
                            >
                                {showPassword ? (
                                    <span className="text-xs font-bold">HIDE</span>
                                ) : (
                                    <span className="text-xs font-bold">SHOW</span>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Processing...' : isLogin ? 'Log In' : 'Register'}
                    </button>
                </form>

                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors"
                    >
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="text-blue-600 font-bold underline underline-offset-4">
                            {isLogin ? 'Register' : 'Log In'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;    