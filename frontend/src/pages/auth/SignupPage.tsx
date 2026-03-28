import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Loader2 } from "lucide-react";
import { UserRole } from '../../data/types';

export default function SignupPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState<UserRole>('patient');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Shared Form Fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    // Patient Fields
    const [dob, setDob] = useState('');
    const [bloodGroup, setBloodGroup] = useState('O+');

    // Doctor Fields
    const [specialization, setSpecialization] = useState('');
    const [experience, setExperience] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [license, setLicense] = useState('');
    const [fee, setFee] = useState('');
    const [hospitalId, setHospitalId] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    // Hospital Fields
    const [hospitalAddress, setHospitalAddress] = useState('');
    const [regNumber, setRegNumber] = useState('');

    const [hospitals, setHospitals] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => {
        const fetchRegistrationData = async () => {
            try {
                const [hospRes, deptRes] = await Promise.all([
                    apiClient.get('/hospitals'),
                    apiClient.get('/departments')
                ]);
                setHospitals(hospRes.data);
                setDepartments(deptRes.data);
                if (hospRes.data.length > 0) {
                    setHospitalId(hospRes.data[0].id);
                }
            } catch (error) {
                console.error("Failed to load registration dictionaries", error);
            }
        };
        fetchRegistrationData();
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (role === 'patient') {
                const response = await apiClient.post('/patients', {
                    name,
                    email,
                    password,
                    role: 'PATIENT',
                    contactNumber: phone,
                    dob,
                    bloodGroup,
                    medicalHistorySummary: 'No medical history available.',
                    age: calculateAge(dob)
                });
                login(response.data);
                navigate('/patient');
                return;
            }

            if (role === 'doctor') {
                if (!hospitalId || !departmentId) {
                    setError("Please select a valid Hospital and Department");
                    setLoading(false);
                    return;
                }
                const response = await apiClient.post('/doctors', {
                    name,
                    email,
                    password,
                    role: 'DOCTOR',
                    contactNumber: phone,
                    hospitalId,
                    departmentId,
                    specialization,
                    experienceYears: parseInt(experience) || 0,
                    qualifications,
                    licenseNumber: license,
                    consultationFee: parseInt(fee) || 0,
                    isActive: false
                });
                login(response.data);
                navigate('/doctor');
                return;
            }

            if (role === 'hospital_admin') {
                const response = await apiClient.post('/hospital-admins', {
                    name,
                    email,
                    password,
                    role: 'HOSPITAL_ADMIN',
                    contactNumber: phone,
                    hospitalId: 'h-1' // FK placeholder since mock UI doesn't create hospital object natively
                });
                login(response.data);
                navigate('/hospital');
                return;
            }
        } catch (err: any) {
            console.error("Signup failed", err);
            setError(err.response?.data?.detail || "Network request failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (dobString: string) => {
        if (!dobString) return 0;
        const today = new Date();
        const birthDate = new Date(dobString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };


    const availableDepartments = role === 'doctor' && hospitalId
        ? departments.filter(d => d.hospitalId === hospitalId)
        : [];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12">
            <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 space-y-4 text-center border-b border-border bg-muted/30">
                    <Link to="/" className="flex items-center justify-center space-x-2">
                        <div className="bg-primary rounded-lg p-2">
                            <Heart className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tight">HealthEase Registration</span>
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Create a New Account</h2>
                        <p className="text-sm text-muted-foreground mt-1">Join the network to continue</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md font-medium text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex bg-muted p-1 rounded-lg">
                        <button
                            className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${role === 'patient' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setRole('patient')}
                        >
                            Patient
                        </button>
                        <button
                            className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${role === 'doctor' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setRole('doctor')}
                        >
                            Doctor
                        </button>
                        <button
                            className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${role === 'hospital_admin' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setRole('hospital_admin')}
                        >
                            Hospital
                        </button>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Full Name</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email Address</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="name@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Phone Number</label>
                                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="+91 9876543210" />
                            </div>
                        </div>

                        {role === 'patient' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Date of Birth</label>
                                    <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Blood Group</label>
                                    <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {role === 'doctor' && (
                            <div className="space-y-4 pt-2 border-t border-border mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Select Hospital</label>
                                        <select required value={hospitalId} onChange={e => { setHospitalId(e.target.value); setDepartmentId(''); }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                            {hospitals.map(h => (
                                                <option key={h.id} value={h.id}>{h.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Select Department</label>
                                        <select required value={departmentId} onChange={e => setDepartmentId(e.target.value)} disabled={!hospitalId} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50">
                                            <option value="">Select a Dept...</option>
                                            {availableDepartments.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Specialization</label>
                                        <input type="text" required value={specialization} onChange={e => setSpecialization(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Cardiologist" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Qualifications</label>
                                        <input type="text" required value={qualifications} onChange={e => setQualifications(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="MBBS, MD" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">License Number</label>
                                        <input type="text" required value={license} onChange={e => setLicense(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="MCI-12345" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Experience (Years)</label>
                                        <input type="number" required min="0" value={experience} onChange={e => setExperience(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="5" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'hospital_admin' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Govt. Registration No.</label>
                                    <input type="text" required value={regNumber} onChange={e => setRegNumber(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="GOVT-HOSP-XYZ" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-foreground">Full Address</label>
                                    <textarea required value={hospitalAddress} onChange={e => setHospitalAddress(e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="123 Health Street, Medical District..." />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full shadow-sm"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <Link to="/login" className="text-sm text-primary hover:underline font-medium">
                            Already have an account? Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
