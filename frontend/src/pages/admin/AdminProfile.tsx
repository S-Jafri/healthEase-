import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AdminProfile() {
    const { user } = useAuth();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Admin Profile</h2>
                    <p className="text-muted-foreground">View your system administrator credentials.</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" /> Edit Profile
                </Button>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border bg-purple-50/30 flex items-start gap-6">
                    <div className="h-20 w-20 rounded-xl bg-purple-100 border border-purple-200 shadow-sm flex items-center justify-center text-purple-700 shrink-0 text-3xl font-bold">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-foreground">{user?.name}</h3>
                            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200 flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> SUPER ADMIN
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-2">
                            {user?.email}
                        </p>
                    </div>
                </div>

                <div className="p-8">
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-foreground border-b border-border pb-2">
                            System Access
                        </h4>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Role Permissions</label>
                            <div className="font-mono bg-muted text-foreground px-3 py-1.5 rounded inline-block font-semibold border border-border">
                                Full System Access
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
