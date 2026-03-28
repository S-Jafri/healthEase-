import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Stethoscope, Building2 } from "lucide-react";

export default function SearchHospitals() {
    const [searchTerm, setSearchTerm] = useState('');
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHospitalsList = async () => {
            try {
                const [hospRes, docRes, deptRes] = await Promise.all([
                    apiClient.get('/hospitals'),
                    apiClient.get('/doctors'),
                    apiClient.get('/departments')
                ]);

                const activeHosps = hospRes.data.filter((h: any) => h.isActive);
                const enriched = activeHosps.map((h: any) => {
                    const hDocs = docRes.data.filter((d: any) => d.hospitalId === h.id);
                    const hDepts = deptRes.data.filter((d: any) => d.hospitalId === h.id);

                    return {
                        ...h,
                        rating: 4.8, // Default since rating isn't in DB
                        doctorCount: hDocs.length,
                        departments: hDepts.map((d: any) => d.name)
                    };
                });
                setHospitals(enriched);
            } catch (error) {
                console.error("Failed to load hospitals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHospitalsList();
    }, []);

    const filtered = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.city && h.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-8 text-center flex flex-col items-center"><Search className="h-8 w-8 animate-spin text-primary mb-4" />Loading hospital network...</div>;

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-4">
                        <Link to="/" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 w-fit mb-3">
                            &larr; Back to Home
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Find a Hospital</h1>
                    <p className="text-muted-foreground mb-6">Explore top-rated hospitals and healthcare facilities near you</p>
                    <div className="relative max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by hospital name or city..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 h-11" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-sm font-medium text-muted-foreground mb-6">{filtered.length} hospitals found</p>

                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-card border border-border rounded-xl shadow-sm">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <h3 className="text-lg font-bold text-foreground">No hospitals found</h3>
                        <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(h => (
                            <Card key={h.id} className="hover:shadow-md transition-shadow overflow-hidden border-border flex flex-col h-full">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="h-40 bg-teal-50/50 flex flex-col items-center justify-center border-b border-border">
                                        <div className="h-16 w-16 bg-teal-100 rounded-2xl flex items-center justify-center shadow-sm border border-teal-200 mb-3">
                                            <Building2 className="h-8 w-8 text-teal-600" />
                                        </div>
                                        <h3 className="font-bold text-foreground text-center px-4 line-clamp-1">{h.name}</h3>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <MapPin className="h-4 w-4 shrink-0" />
                                            <span className="line-clamp-1 font-medium">{h.address}{h.city ? `, ${h.city}` : ''}</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 mb-5 p-3 bg-muted/40 rounded-lg border border-border text-sm font-medium">
                                            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 shrink-0 text-amber-400 fill-amber-400" /> {h.rating} Rating</span>
                                            <span className="flex items-center gap-1.5"><Stethoscope className="h-4 w-4 shrink-0 text-primary" /> {h.doctorCount} Doctors</span>
                                        </div>

                                        <div className="mt-auto">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Key Departments</p>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {h.departments.slice(0, 3).map((d: string) => <Badge key={d} variant="secondary" className="text-xs font-semibold">{d}</Badge>)}
                                                {h.departments.length > 3 && <Badge variant="outline" className="text-xs font-semibold bg-background">+{h.departments.length - 3}</Badge>}
                                            </div>

                                            <Button className="w-full shadow-sm" asChild>
                                                <Link to="/login">Login to Connect</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
