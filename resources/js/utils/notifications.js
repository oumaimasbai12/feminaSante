/**
 * Resolve in-app navigation target for a user notification.
 */
export function getNotificationUrl(notification) {
    const type = notification?.type;
    const data = notification?.data || {};

    switch (type) {
        case 'consultation_message':
            if (data.gynecologist_id) {
                return `/gynecologists/${data.gynecologist_id}?tab=messages`;
            }
            return '/appointments';

        case 'visit_summary':
        case 'appointment_completed':
            if (data.appointment_id) {
                return `/appointments?appointment=${data.appointment_id}&expand=summary&tab=past`;
            }
            if (data.gynecologist_id) {
                return `/appointments?tab=past&expand=summary&gynecologist=${data.gynecologist_id}`;
            }
            return '/appointments?tab=past&expand=summary';

        case 'appointment_confirmed':
        case 'appointment_reminder':
        case 'appointment':
            if (data.appointment_id) {
                const tab =
                    data.status === 'completed' || data.status === 'cancelled'
                        ? 'past'
                        : 'upcoming';
                return `/appointments?appointment=${data.appointment_id}&tab=${tab}`;
            }
            return '/appointments';

        case 'appointment_cancelled':
            if (data.gynecologist_id) {
                return `/gynecologists/${data.gynecologist_id}?book=1`;
            }
            if (data.appointment_id) {
                return `/appointments?appointment=${data.appointment_id}&tab=past`;
            }
            return '/appointments?tab=past';

        case 'follow_up_suggested':
            if (data.gynecologist_id) {
                return `/gynecologists/${data.gynecologist_id}?book=1`;
            }
            return '/gynecologists';

        case 'pregnancy':
            if (data.pregnancy_id) {
                return `/pregnancies?pregnancy=${data.pregnancy_id}`;
            }
            return '/pregnancies';

        case 'menopause':
            return '/menopause';

        default:
            return null;
    }
}

export function getNotificationActionLabel(notification) {
    const type = notification?.type;

    switch (type) {
        case 'consultation_message':
            return 'Voir le message';
        case 'visit_summary':
        case 'appointment_completed':
            return 'Voir le compte-rendu';
        case 'appointment_confirmed':
        case 'appointment_reminder':
        case 'appointment':
            return 'Voir le rendez-vous';
        case 'appointment_cancelled':
            return 'Reprendre un RDV';
        case 'follow_up_suggested':
            return 'Prendre rendez-vous';
        case 'pregnancy':
            return 'Voir la grossesse';
        case 'menopause':
            return 'Voir le suivi';
        default:
            return 'Voir';
    }
}
