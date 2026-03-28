import React, { useState, useEffect } from 'react';
import { Calendar, UserPlus, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Hospital, Department, Doctor } from '../../types';

export default function PatientBook() {
    const { user } = useAuth();
    const [selectedHospital, setSelectedHospital] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const navigate = useNavigate();

    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hospRes = await apiClient.get('/hospitals');
                const deptRes = await apiClient.get('/departments');
                const docRes = await apiClient.get('/doctors');
                setHospitals(hospRes.data);
                setDepartments(deptRes.data);
                setDoctors(docRes.data);
            } catch (err) {
                console.error("Failed to load booking data", err);
            }
        };
        fetchData();
    }, []);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            await apiClient.post('/appointments', {
                patientId: user.id,
                doctorId: selectedDoctor,
                hospitalId: selectedHospital,
                date: new Date(selectedDate).toISOString(),
                tokenNumber: Math.floor(Math.random() * 50) + 1 // mock queue mechanic
            });
            navigate('/patient/appointments');
        } catch (err) {
            console.error("Booking failed", err);
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        (!selectedHospital || doc.hospitalId === selectedHospital) &&
        (!selectedDept || doc.departmentId === selectedDept)
    );

    const validDeptIds = new Set(
        doctors.filter(doc => !selectedHospital || doc.hospitalId === selectedHospital)
            .map(doc => doc.departmentId)
    );
    const filteredDepts = departments.filter(d =>
        d.hospitalId === selectedHospital && validDeptIds.has(d.id)
    );

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Book Appointment</h2>
                <p className="text-muted-foreground">Find a doctor and book your smart queue token.</p>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <form onSubmit={handleBook} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Step 1: Select Hospital
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <select
                                    className="w-full border border-slate-300 rounded-md pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card appearance-none"
                                    value={selectedHospital}
                                    onChange={(e) => {
                                        setSelectedHospital(e.target.value);
                                        setSelectedDept('');
                                        setSelectedDoctor('');
                                    }}
                                    required
                                >
                                    <option value="">-- Choose a Hospital --</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Step 2: Select Department (Optional)
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <select
                                    className="w-full border border-slate-300 rounded-md pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card appearance-none disabled:bg-background disabled:text-muted-foreground"
                                    value={selectedDept}
                                    onChange={(e) => {
                                        setSelectedDept(e.target.value);
                                        setSelectedDoctor('');
                                    }}
                                    disabled={!selectedHospital}
                                >
                                    <option value="">-- All Departments --</option>
                                    {filteredDepts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Step 3: Select Doctor
                            </label>
                            <div className="relative">
                                <UserPlus className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <select
                                    className="w-full border border-slate-300 rounded-md pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card appearance-none"
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a Doctor --</option>
                                    {filteredDoctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization} (Fee: ₹{doc.consultationFee})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Step 4: Select Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="date"
                                    className="w-full border border-slate-300 rounded-md pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {selectedDoctor && selectedDate && selectedDate === new Date().toISOString().split('T')[0] && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-md text-foreground">
                            <p className="font-medium text-primary mb-2">Estimated Queue Status</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Current Token Running:</p>
                                    <p className="font-bold text-lg">12</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Your Estimated Token:</p>
                                    <p className="font-bold text-lg">#24</p>
                                </div>
                                <div className="col-span-2 text-muted-foreground mt-2">
                                    Approximate waiting time from current patient: <span className="font-semibold text-foreground">1 hr 45 mins</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-border flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                            disabled={!selectedDoctor || !selectedDate}
                        >
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
