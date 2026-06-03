export const APPOINTMENT_STATUS_LABELS = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé',
};

export const APPOINTMENT_STATUS_CLASSES = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    cancelled: 'badge-cancelled',
    completed: 'badge-completed',
};

export function appointmentStatusLabel(status) {
    return APPOINTMENT_STATUS_LABELS[status] || status;
}

export function appointmentStatusClass(status) {
    return APPOINTMENT_STATUS_CLASSES[status] || 'badge-inactive';
}

export const PRIORITY_LABELS = {
    emergency: 'Urgence',
    follow_up: 'Suivi',
    routine: 'Routine',
};

export const PRIORITY_CLASSES = {
    emergency: 'badge-cancelled',
    follow_up: 'badge-pending',
    routine: 'badge-inactive',
};

export function priorityLabel(priority) {
    return PRIORITY_LABELS[priority] || priority;
}

export function priorityClass(priority) {
    return PRIORITY_CLASSES[priority] || 'badge-inactive';
}
