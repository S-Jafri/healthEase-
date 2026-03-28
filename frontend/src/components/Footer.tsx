import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <Heart className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="tracking-tight text-foreground">HealthEase</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            A modern platform for patients and doctors. Book appointments, manage queues in real-time, and streamline your clinic's workflow.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/login" className="hover:text-primary transition-colors">Patient Portal</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">Doctor Dashboard</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">Hospital Admin</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">Book Appointment</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>123 Health Avenue, Cyber City<br />Gurugram, Haryana 122002<br />India</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span>support@healthease.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} HealthEase. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Made with ❤️ in India</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
