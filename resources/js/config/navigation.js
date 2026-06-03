import {
    Home, Heart, Baby, BookOpen, MessageCircle, Stethoscope, Calendar, Brain, Moon,
    Users, Shield, FileText, LayoutDashboard, CalendarClock,
} from 'lucide-react';
import { isMenopauseEligible, MENOPAUSE_MIN_AGE } from '@/utils/menopause';

export function patientNav(user = {}) {
    const menopauseOk = isMenopauseEligible(user);
    return [
        { label: 'Tableau de bord', href: '/dashboard', icon: Home },
        { label: 'Suivi du cycle', href: '/cycles', icon: Heart },
        { label: 'Grossesse', href: '/pregnancies', icon: Baby },
        {
            label: 'Ménopause',
            href: '/menopause',
            icon: Moon,
            disabled: !menopauseOk,
            disabledTitle: `Disponible à partir de ${MENOPAUSE_MIN_AGE} ans`,
            badge: !menopauseOk ? 'Bientôt' : undefined,
        },
        { label: 'Articles', href: '/articles', icon: BookOpen },
        { label: 'Quiz', href: '/quizzes', icon: Brain },
        { label: 'Assistant IA', href: '/chat', icon: MessageCircle },
        { label: 'Gynécologues', href: '/gynecologists', icon: Stethoscope },
        { label: 'Rendez-vous', href: '/appointments', icon: Calendar },
    ];
}

export function patientNavSections(user = {}) {
    const sections = [];
    if (user.is_admin) {
        sections.push({
            title: 'Administration',
            items: [
                { label: "Vue d'ensemble", href: '/admin/dashboard', icon: Shield },
                { label: 'Utilisatrices', href: '/admin/users', icon: Users },
                { label: 'Contenus', href: '/admin/articles', icon: FileText },
                { label: 'Praticiens', href: '/admin/gynecologists', icon: Stethoscope },
            ],
        });
    }
    if (user.is_gynecologist) {
        sections.push({
            title: 'Praticien',
            items: [
                { label: 'Espace praticien', href: '/gynecologist/dashboard', icon: Stethoscope },
            ],
        });
    }
    return sections;
}

export const adminNav = [
    { label: "Vue d'ensemble", href: '/admin/dashboard', icon: LayoutDashboard, match: (url) => url === '/admin/dashboard' },
    { label: 'Rendez-vous', href: '/admin/appointments', icon: Calendar, match: (url) => url.startsWith('/admin/appointments') },
    { label: 'Praticiens', href: '/admin/gynecologists', icon: Stethoscope, match: (url) => url.startsWith('/admin/gynecologists') },
    { label: 'Utilisatrices', href: '/admin/users', icon: Users, match: (url) => url.startsWith('/admin/users') },
    { label: 'Contenus', href: '/admin/articles', icon: FileText, match: (url) => url.startsWith('/admin/articles') },
];

export const gynecologistNav = [
    { label: 'Tableau de bord', href: '/gynecologist/dashboard', icon: LayoutDashboard, match: (url) => url === '/gynecologist/dashboard' },
    { label: 'Rendez-vous', href: '/gynecologist/appointments', icon: Calendar, match: (url) => url.startsWith('/gynecologist/appointments') },
    { label: 'Mes patientes', href: '/gynecologist/patients', icon: Users, match: (url) => url.startsWith('/gynecologist/patients') },
    { label: 'Disponibilités', href: '/gynecologist/availability', icon: CalendarClock, match: (url) => url.startsWith('/gynecologist/availability') },
];
