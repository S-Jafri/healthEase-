import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Basic loading skeleton
        return <div className="flex h-screen w-screen items-center justify-center p-4">Loading application...</div>;
    }

    if (!isAuthenticated || !user) {
        // Redirect to login but save the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have the right role
        // Redirect to their respective dashboard instead
        switch (user.role) {
            case 'PATIENT': return <Navigate to="/patient" replace />;
            case 'DOCTOR': return <Navigate to="/doctor" replace />;
            case 'HOSPITAL_ADMIN': return <Navigate to="/hospital" replace />;
            case 'SUPER_ADMIN': return <Navigate to="/admin" replace />;
            default: return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
}
