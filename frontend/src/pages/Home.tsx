import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Activity, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';

import { ThemeToggle } from '../components/theme/ThemeToggle';

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <Heart className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="tracking-tight">HealthEase</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link to="/doctors" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">Find a Doctor</Link>
                        <Link to="/hospitals" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">Find a Hospital</Link>
                        <ThemeToggle />
                        <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
                        <Link to="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                    <div className="text-center max-w-3xl mx-auto space-y-8">
                        <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-semibold bg-muted/50 text-muted-foreground mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                            Smart Healthcare Platform
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-foreground">
                            Healthcare management, <br /><span className="text-primary">simplified.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            A modern platform for patients and doctors. Book appointments, manage queues in real-time, and streamline your clinic's workflow.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Link to="/login" className="inline-flex items-center justify-center rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 shadow-md">
                                Get Started <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link to="/doctors" className="inline-flex items-center justify-center rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-border bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8">
                                Find a Doctor
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-muted/40 border-y border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Live Queue Tracking</h3>
                                <p className="text-muted-foreground leading-relaxed">No more waiting rooms. Track your exact token number and arrival time from anywhere in real-time.</p>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Smart Booking</h3>
                                <p className="text-muted-foreground leading-relaxed">Filter specialized doctors across multiple hospitals. Instantly secure an appointment slot.</p>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Verified Doctors</h3>
                                <p className="text-muted-foreground leading-relaxed">Every professional is thoroughly vetted and registered. Authentic reviews and credentials.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">What People Say</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Trusted by thousands of patients and healthcare providers</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { name: 'Sarah M.', role: 'Patient', text: 'HealthEase made booking appointments so easy. The queue tracking is a game changer!', rating: 5 },
                                { name: 'Dr. R. Kumar', role: 'Doctor', text: 'Managing my patient queue has never been simpler. Highly recommend to fellow doctors.', rating: 5 },
                                { name: 'Metro Healthcare', role: 'Hospital', text: 'Streamlined our entire appointment system. Reduced wait times by 40%.', rating: 4 },
                            ].map((t, i) => (
                                <div key={i} className="bg-background border border-border rounded-xl p-8 shadow-sm">
                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <Star key={j} className={`h-4 w-4 ${j < t.rating ? 'text-warning fill-warning' : 'text-muted'}`} />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">"{t.text}"</p>
                                    <div>
                                        <p className="font-bold text-foreground">{t.name}</p>
                                        <p className="text-sm text-muted-foreground mt-0.5">{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-4 bg-primary text-primary-foreground border-y border-border">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-4xl font-extrabold tracking-tight">Ready to Transform Your Healthcare Experience?</h2>
                        <p className="text-primary-foreground/90 text-xl font-medium max-w-2xl mx-auto">Join thousands of patients and doctors using HealthEase.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/login" className="inline-flex items-center justify-center rounded-md text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-primary hover:bg-muted h-14 px-10 shadow-lg">
                                Access Patient Portal
                            </Link>
                            <Link to="/login" className="inline-flex items-center justify-center rounded-md text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border-2 border-primary-foreground/30 hover:bg-primary-foreground hover:text-primary h-14 px-10">
                                Doctor Login
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
