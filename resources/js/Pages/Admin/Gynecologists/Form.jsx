import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import GlassCard from '@/Components/UI/GlassCard';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import PasswordInput from '@/Components/PasswordInput';
import { TableActionButton } from '@/Components/UI/TableActions';
import {
    ChevronLeft,
    Trash2,
    Stethoscope,
    User,
    Mail,
    MapPin,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Info,
} from 'lucide-react';
import { MOROCCAN_CITIES } from '@/data/moroccanCities';

const SPECIALITIES = [
    'Gynécologie-Obstétrique',
    'Gynécologie médicale',
    'Obstétrique',
    'Médecine de la reproduction',
    'Gynécologie oncologique',
];

function FormAlert({ type = 'error', children }) {
    if (!children) return null;
    const isError = type === 'error';
    return (
        <div
            className={`p-4 rounded-xl text-sm font-medium border flex items-start gap-2 ${
                isError
                    ? 'bg-red-50/80 border-red-200 text-red-800'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
            }`}
        >
            {isError ? (
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            ) : (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            )}
            {children}
        </div>
    );
}

function Field({ label, value, onChange, type = 'text', required = false, placeholder = '', hint }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-brand-ink mb-1.5">{label}</label>
            <input
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="input-field py-2.5"
            />
            {hint && <p className="text-xs text-brand-muted mt-1">{hint}</p>}
        </div>
    );
}

function SelectField({ label, value, onChange, required = false, options = [], placeholder = 'Sélectionner une ville…' }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-brand-ink mb-1.5">{label}</label>
            <select
                required={required}
                value={value}
                onChange={onChange}
                className="input-field py-2.5"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function FormSkeleton() {
    return (
        <div className="w-full grid lg:grid-cols-2 gap-4 animate-pulse">
            <div className="glass-card p-6 h-48" />
            <div className="glass-card p-6 h-48" />
            <div className="glass-card p-6 h-40" />
            <div className="glass-card p-6 h-40" />
        </div>
    );
}

export default function GynecologistForm() {
    const { url } = usePage();
    const isEdit = url.includes('/edit');
    const id = isEdit ? url.split('/').filter(Boolean).slice(-2, -1)[0] : null;
    const pageTitle = isEdit ? 'Modifier le praticien' : 'Nouveau praticien';

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        speciality: 'Gynécologie-Obstétrique',
        email: '',
        phone: '',
        city: '',
        consultation_duration: '30',
        consultation_fee: '',
        password: '',
    });
    const [isActive, setIsActive] = useState(false);
    const [upcomingSlots, setUpcomingSlots] = useState(0);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const cityOptions = useMemo(() => {
        if (form.city && !MOROCCAN_CITIES.includes(form.city)) {
            return [form.city, ...MOROCCAN_CITIES];
        }
        return MOROCCAN_CITIES;
    }, [form.city]);

    useEffect(() => {
        if (!isEdit || !id) return;
        setLoading(true);
        window.axios
            .get(`/api/v1/gynecologists/${id}`)
            .then((r) => {
                setForm((f) => ({
                    ...f,
                    first_name: r.data.first_name || '',
                    last_name: r.data.last_name || '',
                    speciality: r.data.speciality || '',
                    email: r.data.email || r.data.user?.email || '',
                    phone: r.data.phone || '',
                    city: r.data.city || '',
                    consultation_duration: String(r.data.consultation_duration ?? 30),
                    consultation_fee:
                        r.data.consultation_fee != null ? String(r.data.consultation_fee) : '',
                    password: '',
                }));
                setIsActive(!!r.data.is_active);
                const future = (r.data.availabilities || []).filter((a) => a.is_available !== false);
                setUpcomingSlots(future.length);
            })
            .catch(() => setMsg({ ok: false, text: 'Impossible de charger le praticien.' }))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

    const buildPayload = () => ({
        first_name: form.first_name,
        last_name: form.last_name,
        speciality: form.speciality,
        email: form.email,
        phone: form.phone,
        city: form.city,
        adress: form.city,
        consultation_duration: parseInt(form.consultation_duration, 10) || 30,
        consultation_fee: form.consultation_fee !== '' ? parseFloat(form.consultation_fee) : null,
        consultation_type: ['in_person', 'online'],
        languages_spoken: ['Français', 'Arabe'],
        ...(form.password ? { password: form.password } : {}),
    });

    const save = async (e) => {
        e?.preventDefault();
        setSaving(true);
        setMsg(null);
        try {
            const payload = buildPayload();
            if (isEdit) {
                await window.axios.put(`/api/v1/admin/gynecologists/${id}`, payload);
                setMsg({ ok: true, text: 'Praticien enregistré.' });
            } else {
                const res = await window.axios.post('/api/v1/admin/gynecologists', payload);
                const tempPass = res.data.temporary_password;
                if (tempPass) {
                    setMsg({
                        ok: true,
                        text: `Praticien créé. Mot de passe temporaire : ${tempPass}`,
                    });
                    setTimeout(() => router.visit('/admin/gynecologists'), 3000);
                } else {
                    router.visit('/admin/gynecologists');
                }
            }
        } catch (err) {
            const errors = err.response?.data?.errors;
            const first = errors
                ? Object.values(errors)[0][0]
                : err.response?.data?.message || 'Erreur.';
            setMsg({ ok: false, text: first });
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        setDeleting(true);
        try {
            await window.axios.delete(`/api/v1/admin/gynecologists/${id}`);
            router.visit('/admin/gynecologists');
        } catch (err) {
            setMsg({ ok: false, text: err.response?.data?.message || 'Erreur lors de la suppression.' });
            setDeleteOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <AdminLayout title={pageTitle}>
            <Head title={`${pageTitle} - FeminaSante`} />

            <ConfirmDialog
                open={deleteOpen}
                title="Supprimer le praticien"
                message="Cette action est définitive. Le compte de connexion sera également supprimé."
                confirmLabel="Supprimer"
                danger
                loading={deleting}
                onConfirm={remove}
                onCancel={() => setDeleteOpen(false)}
            />

            <div className="space-y-6 w-full">
                <Link
                    href="/admin/gynecologists"
                    className="inline-flex items-center gap-2 text-sm text-brand-primary hover:opacity-80 font-semibold transition-opacity"
                >
                    <ChevronLeft size={18} /> Retour aux praticiens
                </Link>

                {!isEdit && (
                    <p className="text-sm text-brand-muted">
                        Créez un compte praticien. Le profil restera invisible pour les patientes jusqu&apos;à
                        ce que le médecin ajoute ses disponibilités.
                    </p>
                )}

                {loading ? (
                    <FormSkeleton />
                ) : (
                    <>
                        {isEdit ? (
                            <GlassCard
                                className={`p-4 ${
                                    isActive
                                        ? 'border-emerald-200/80 bg-emerald-50/40'
                                        : 'border-amber-200/80 bg-amber-50/40'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`p-2 rounded-xl shrink-0 ${
                                            isActive
                                                ? 'bg-emerald-100/80 text-emerald-700'
                                                : 'bg-amber-100/80 text-amber-700'
                                        }`}
                                    >
                                        {isActive ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-brand-ink">
                                            Profil {isActive ? 'actif' : 'inactif'}
                                        </p>
                                        <p className="text-sm text-brand-muted mt-0.5">
                                            {isActive
                                                ? 'Visible dans la recherche de praticiens.'
                                                : 'Invisible — le médecin doit ajouter des disponibilités.'}
                                        </p>
                                        <p className="text-xs text-brand-muted mt-1">
                                            {upcomingSlots} créneau{upcomingSlots > 1 ? 'x' : ''} à venir
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        ) : (
                            <GlassCard className="p-4 border-amber-200/80 bg-amber-50/40">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-xl bg-amber-100/80 text-amber-700 shrink-0">
                                        <Info size={18} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-brand-ink">Compte créé inactif</p>
                                        <p className="text-sm text-brand-muted mt-0.5">
                                            Mot de passe par défaut si non renseigné :{' '}
                                            <span className="font-mono text-brand-ink">Gynecologue123!</span>
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        )}

                        {msg && <FormAlert type={msg.ok ? 'success' : 'error'}>{msg.text}</FormAlert>}

                        <form onSubmit={save} className="space-y-6 w-full">
                            <div className="grid lg:grid-cols-2 gap-6">
                            <GlassCard className="p-6 space-y-4">
                                <h2 className="text-sm font-bold text-brand-ink flex items-center gap-2">
                                    <User size={16} className="text-brand-primary" />
                                    Identité
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field
                                        label="Prénom"
                                        value={form.first_name}
                                        onChange={set('first_name')}
                                        required
                                    />
                                    <Field
                                        label="Nom"
                                        value={form.last_name}
                                        onChange={set('last_name')}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-brand-ink mb-1.5">
                                        Spécialité
                                    </label>
                                    <select
                                        value={form.speciality}
                                        onChange={set('speciality')}
                                        className="input-field py-2.5"
                                    >
                                        {SPECIALITIES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6 space-y-4">
                                <h2 className="text-sm font-bold text-brand-ink flex items-center gap-2">
                                    <MapPin size={16} className="text-brand-primary" />
                                    Coordonnées
                                </h2>
                                <Field
                                    label="E-mail (connexion)"
                                    value={form.email}
                                    onChange={set('email')}
                                    type="email"
                                    required
                                />
                                <Field label="Téléphone" value={form.phone} onChange={set('phone')} />
                                <SelectField
                                    label="Ville"
                                    value={form.city}
                                    onChange={set('city')}
                                    options={cityOptions}
                                    required
                                />
                            </GlassCard>

                            <GlassCard className="p-6 space-y-4">
                                <h2 className="text-sm font-bold text-brand-ink flex items-center gap-2">
                                    <Clock size={16} className="text-brand-primary" />
                                    Consultation
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field
                                        label="Durée (minutes)"
                                        value={form.consultation_duration}
                                        onChange={set('consultation_duration')}
                                        type="number"
                                        required
                                    />
                                    <Field
                                        label="Tarif (MAD)"
                                        value={form.consultation_fee}
                                        onChange={set('consultation_fee')}
                                        type="number"
                                        required
                                        placeholder="Ex. 350"
                                    />
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6 space-y-4">
                                <h2 className="text-sm font-bold text-brand-ink flex items-center gap-2">
                                    <Mail size={16} className="text-brand-primary" />
                                    Compte de connexion
                                </h2>
                                <div>
                                    <label className="block text-sm font-semibold text-brand-ink mb-1.5">
                                        {isEdit ? 'Nouveau mot de passe' : 'Mot de passe'}
                                    </label>
                                    <PasswordInput
                                        value={form.password}
                                        onChange={set('password')}
                                        placeholder={
                                            isEdit
                                                ? 'Laisser vide pour ne pas changer'
                                                : 'Par défaut : Gynecologue123!'
                                        }
                                        inputClassName="input-field py-2.5 pl-11 pr-11"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </GlassCard>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn-primary flex-1 justify-center py-3"
                                >
                                    <Stethoscope size={16} />
                                    {saving
                                        ? 'Enregistrement…'
                                        : isEdit
                                          ? 'Enregistrer'
                                          : 'Créer le praticien'}
                                </button>
                                {isEdit && (
                                    <TableActionButton
                                        type="button"
                                        icon={Trash2}
                                        danger
                                        onClick={() => setDeleteOpen(true)}
                                        className="justify-center py-3 px-5"
                                    >
                                        Supprimer
                                    </TableActionButton>
                                )}
                            </div>
                        </form>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
