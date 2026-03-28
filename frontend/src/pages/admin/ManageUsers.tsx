import React, { useState, useEffect } from 'react';
import { ShieldAlert, UserX, UserCheck, Shield } from 'lucide-react';
import apiClient from '../../api/client';

type UserListType = {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
};

export default function ManageUsers() {
    const [users, setUsers] = useState<UserListType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [patRes, docRes] = await Promise.all([
                    apiClient.get('/patients'),
                    apiClient.get('/doctors')
                ]);

                setUsers([
                    ...patRes.data.map((p: any) => ({ ...p, role: 'PATIENT', isActive: true })),
                    ...docRes.data.map((d: any) => ({ ...d, role: 'DOCTOR' }))
                ]);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const [filterRole, setFilterRole] = useState<string>('ALL');

    const handleToggleStatus = (id: string) => {
        if (window.confirm("Are you sure you want to change this user's platform access?")) {
            setUsers(prev => prev.map(u =>
                u.id === id ? { ...u, isActive: !u.isActive } : u
            ));
        }
    };

    const filteredUsers = filterRole === 'ALL' ? users : users.filter(u => u.role === filterRole);

    if (loading) return <div className="p-8">Loading user details...</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Access Control Center</h2>
                    <p className="text-muted-foreground font-medium mt-1 text-sm">Manage platform-wide user access and suspensions.</p>
                </div>

                <div className="flex bg-muted/80 p-1 rounded-md border border-slate-300">
                    {['ALL', 'PATIENT', 'DOCTOR'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterRole(f)}
                            className={`px-4 py-1.5 text-sm font-bold rounded transition-all ${filterRole === f ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-card rounded-lg border-2 border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-muted border-b-2 border-border text-sm font-black text-foreground uppercase tracking-wider">
                                <th className="p-4">User Identity</th>
                                <th className="p-4">Account Type</th>
                                <th className="p-4">System Status</th>
                                <th className="p-4 text-right">Admin Override Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-background transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-foreground text-lg">{u.name}</div>
                                        <div className="text-sm font-mono text-muted-foreground mt-0.5">{u.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md ${u.role === 'DOCTOR' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-foreground'
                                            }`}>
                                            {u.role === 'DOCTOR' ? <Shield className="h-3 w-3" /> : null}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {u.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-600">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div> ACTIVE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600">
                                                <div className="h-2 w-2 rounded-full bg-red-500"></div> SUSPENDED
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {u.isActive ? (
                                            <button
                                                onClick={() => handleToggleStatus(u.id)}
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-card border border-red-200 rounded text-sm font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                                            >
                                                <UserX className="h-4 w-4" />
                                                Force Suspend
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleStatus(u.id)}
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded text-sm font-bold text-green-700 hover:bg-green-100 hover:border-green-300 transition-colors shadow-sm"
                                            >
                                                <UserCheck className="h-4 w-4" />
                                                Restore Access
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
