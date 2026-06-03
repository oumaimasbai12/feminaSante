import React from 'react';
import { appointmentStatusClass, appointmentStatusLabel } from '@/utils/statusBadges';

export default function StatusBadge({ status, label, className = '' }) {
    return (
        <span className={`status-badge ${appointmentStatusClass(status)} ${className}`}>
            {label ?? appointmentStatusLabel(status)}
        </span>
    );
}
