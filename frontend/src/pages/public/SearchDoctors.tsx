import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Clock } from "lucide-react";

export default function SearchDoctors() {
    const [searchTerm, setSearchTerm] = useState('');
    const [specialization, setSpecialization] = useState('all');
    const [hospitalFilter, setHospitalFilter] = useState('all');

    const [doctors, setDoctors] = useState<any[]>([]);
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const [docRes, hospRes] = await Promise.all([
                    apiClient.get('/doctors'),
                    apiClient.get('/hospitals')
                ]);

                const activeHosps = hospRes.data.filter((h: any) => h.isActive);
                setHospitals(activeHosps);

                const activeDocs = docRes.data.filter((d: any) => d.isActive);
                const enrichedDocs = activeDocs.map((d: any) => {
                    const hosp = activeHosps.find((h: any) => h.id === d.hospitalId);
                    return {
                        ...d,
                        hospital: hosp ? hosp.name : 'Unknown Facility',
                        experience: d.experienceYears,
                        rating: 4.9,
                        reviewCount: Math.floor(Math.random() * 150) + 20,
                        status: 'online', // Default mock status for UI
                        availableSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:15 PM']
                    };
                });
                setDoctors(enrichedDocs);

                const uniqueSpecs = Array.from(new Set(activeDocs.map((d: any) => d.specialization)));
                setSpecializations(uniqueSpecs as string[]);

            } catch (error) {
                console.error("Failed to fetch doctors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorData();
    }, []);

    const filtered = doctors.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpec = specialization === 'all' || d.specialization === specialization;
        const matchesHosp = hospitalFilter === 'all' || d.hospitalId === hospitalFilter;
        return matchesSearch && matchesSpec && matchesHosp;
    });

    if (loading) return <div className="p-8 text-center flex flex-col items-center"><Search className="h-8 w-8 animate-spin text-primary mb-4" />Loading medical professionals...</div>;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-4">
                        <Link to="/" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 w-fit mb-3">
                            &larr; Back to Home
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Find a Doctor</h1>
                    <p className="text-muted-foreground mb-6">Search from verified healthcare professionals in our network</p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by doctor name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 h-11" />
                        </div>

                        <select
                            value={specialization}
                            onChange={e => setSpecialization(e.target.value)}
                            className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="all">All Specializations</option>
                            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <select
                            value={hospitalFilter}
                            onChange={e => setHospitalFilter(e.target.value)}
                            className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="all">All Hospitals</option>
                            {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>

                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-sm font-medium text-muted-foreground mb-6">{filtered.length} doctors found</p>

                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-card border border-border rounded-xl shadow-sm">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <h3 className="text-lg font-bold text-foreground">No doctors found</h3>
                        <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filtered.map(doc => (
                            <Card key={doc.id} className="hover:shadow-md transition-shadow overflow-hidden border-border">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-5">
                                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 mt-1">
                                                <span className="text-xl font-bold text-primary">{doc.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap mb-1">
                                                    <h3 className="text-xl font-bold text-foreground">{doc.name}</h3>
                                                    <Badge variant="outline" className={
                                                        doc.status === 'online' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            doc.status === 'delayed' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''
                                                    }>
                                                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${doc.status === 'online' ? 'bg-green-500' : doc.status === 'delayed' ? 'bg-amber-500' : 'bg-muted-foreground'}`} />
                                                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <p className="font-medium text-primary mb-2">{doc.specialization} • {doc.experience} yrs exp</p>
                                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 text-sm text-muted-foreground font-medium">
                                                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 shrink-0" />{doc.hospital}</span>
                                                    <span className="flex items-center gap-1.5"><Star className="h-4 w-4 shrink-0 text-amber-400 fill-amber-400" />{doc.rating} ({doc.reviewCount} reviews)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                                            <div className="text-left md:text-right">
                                                <p className="text-sm font-medium text-muted-foreground mb-0.5">Consultation Fee</p>
                                                <p className="text-2xl font-black text-foreground">₹{doc.consultationFee}</p>
                                            </div>
                                            <Button asChild className="w-full md:w-auto shadow-sm">
                                                <Link to="/login">Login to Book</Link>
                                            </Button>
                                        </div>
                                    </div>

                                    {doc.availableSlots.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-border flex items-center gap-3 flex-wrap bg-muted/30 p-3 rounded-lg">
                                            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="text-sm font-medium text-foreground">Next Available:</span>
                                            {doc.availableSlots.slice(0, 4).map((slot: string) => (
                                                <Badge key={slot} variant="secondary" className="font-semibold bg-background border-border">{slot}</Badge>
                                            ))}
                                            {doc.availableSlots.length > 4 && <span className="text-xs font-semibold text-muted-foreground ml-1">+{doc.availableSlots.length - 4} more</span>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
