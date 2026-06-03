export const MENOPAUSE_MIN_AGE = 45;

export function computeAge(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
    }
    return age;
}

export function isMenopauseEligible(user) {
    if (!user) return false;
    if (user.menopause_eligible !== undefined && user.menopause_eligible !== null) {
        return Boolean(user.menopause_eligible);
    }
    const age = user.age ?? computeAge(user.birth_date);
    return age !== null && age >= MENOPAUSE_MIN_AGE;
}

export function menopauseEligibilityMessage(age) {
    const n = parseInt(age, 10);
    if (!n || n < 13) return null;
    if (n >= MENOPAUSE_MIN_AGE) {
        return 'Le module ménopause sera accessible après inscription — configurez votre profil quand vous le souhaitez.';
    }
    return `Le suivi ménopause sera disponible à partir de ${MENOPAUSE_MIN_AGE} ans.`;
}

const STAGE_LABELS = {
    perimenopause: 'Périménopause',
    menopause: 'Ménopause',
    postmenopause: 'Post-ménopause',
};

export function menopauseStageLabel(stage) {
    if (!stage) return '—';
    const value = typeof stage === 'object' ? stage.value ?? stage.name : stage;
    return STAGE_LABELS[value] || String(value).replace(/_/g, ' ');
}
