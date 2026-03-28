import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Loader2, User, Stethoscope, Building2, Shield } from "lucide-react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const user = response.data;

            login(user);

            // Navigate based on role string
            if (user.role === 'SUPER_ADMIN') {
                navigate('/admin');
            } else if (user.role === 'PATIENT') {
                navigate('/patient');
            } else if (user.role === 'DOCTOR') {
                navigate('/doctor');
            } else if (user.role === 'HOSPITAL_ADMIN') {
                navigate('/hospital');
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            setError('Account not found. Check test credentials below.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 space-y-4 text-center border-b border-border bg-muted/30">
                    <Link to="/" className="flex items-center justify-center space-x-2">
                        <div className="bg-primary rounded-lg p-2">
                            <Heart className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tight">HealthEase</span>
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Welcome Back</h2>
                        <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">Email</label>
                            <input
                                type="email"
                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">Password</label>
                            <input
                                type="password"
                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full shadow-sm"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center mt-2 mb-4">
                        <Link to="/register" className="text-sm text-primary hover:underline font-medium">
                            Don't have an account? Sign Up
                        </Link>
                    </div>


                </div>
            </div>
        </div>
    );
}
