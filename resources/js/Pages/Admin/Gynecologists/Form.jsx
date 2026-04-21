import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';

const LANGS = ['Français', 'Arabe', 'Darija', 'Anglais', 'Espagnol', 'Amazigh'];
const TYPES = [{ v: 'in_person', l: 'En cabinet' }, { v: 'online', l: 'En ligne' }, { v: 'both', l: 'Les deux' }];

export default function GynecologistForm() {
    const parts = window.location.pathname.split('/');
    const { auth } = usePage().props;
    const user = auth?.user;
    const isEdit = parts.includes('edit');
    const id = isEdit ? parts[parts.indexOf('edit') - 1] : null;

    const [form, setForm] = useState({
        first_name: '', last_name: '', speciality: 'Gynécologie-Obstétrique',
        license_number: '', email: '', phone: '',
        adress: '', city: '', postal_code: '',
        consultation_type: [], consultation_duration: 30,
        consultation_fee: '', bio: '', languages_spoken: [],
        is_active: true,
    });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        if (!isEdit) return;
        window.axios.get(`/api/v1/gynecologists/${id}`)
            .then(r => setForm({ ...r.data, consultation_type: r.data.consultation_type || [], languages_spoken: r.data.languages_spoken || [] }));
    }, [id]);

    const toggleArr = (key, val) => setForm(f => ({
        ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
    }));

    const save = async () => {
        setSaving(true); setMsg(null);
        try {
            if (isEdit) {
                await window.axios.put(`/api/v1/gynecologists/${id}`, form);
            } else {
                await window.axios.post('/api/v1/gynecologists', form);
            }
            setMsg({ ok: true, text: isEdit ? 'Mis à jour avec succès !' : 'Gynécologue ajoutée !' });
            if (!isEdit) setTimeout(() => router.visit('/admin/gynecologists'), 1200);
        } catch (e) {
            const errors = e.response?.data?.errors;
            const first = errors ? Object.values(errors)[0][0] : (e.response?.data?.message || 'Erreur.');
            setMsg({ ok: false, text: first });
        } finally { setSaving(false); }
    };

    const F = ({ label, name, type = 'text', placeholder = '' }) => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <input type={type} value={form[name] || ''} onChange={e => setForm({ ...form, [name]: e.target.value })}
                placeholder={placeholder} className="input-field" />
        </div>
    );

    return (
        <AdminLayout user={user}>
            <Link href="/admin/gynecologists" className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-800 font-semibold mb-6 group">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour
            </Link>

            <div className="card space-y-6 max-w-3xl">
                <h2 className="text-xl font-extrabold text-gray-900">{isEdit ? 'Modifier' : 'Ajouter'} un gynécologue</h2>

                {msg && (
                    <div className={'p-4 rounded-2xl text-sm font-semibold ' + (msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                        {msg.text}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                    <F label="Prénom *" name="first_name" placeholder="Fatima" />
                    <F label="Nom *" name="last_name" placeholder="Benali" />
                    <F label="Spécialité" name="speciality" placeholder="Gynécologie-Obstétrique" />
                    <F label="N° d'ordre" name="license_number" placeholder="MA-GYN-XXX" />
                    <F label="Email" name="email" type="email" />
                    <F label="Téléphone" name="phone" placeholder="+212 5XX XXX XXX" />
                    <div className="md:col-span-2">
                        <F label="Adresse *" name="adress" placeholder="15 Rue Ibn Batouta" />
                    </div>
                    <F label="Ville *" name="city" placeholder="Casablanca" />
                    <F label="Code postal" name="postal_code" placeholder="20100" />
                    <F label="Durée (min)" name="consultation_duration" type="number" />
                    <F label="Honoraires (MAD)" name="consultation_fee" type="number" />
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Biographie</label>
                    <textarea value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })}
                        rows={4} className="input-field resize-none" placeholder="Présentation du médecin..." />
                </div>

                {/* Types */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Types de consultation</label>
                    <div className="flex gap-2 flex-wrap">
                        {TYPES.map(t => (
                            <button key={t.v} type="button" onClick={() => toggleArr('consultation_type', t.v)}
                                className={'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ' +
                                    (form.consultation_type?.includes(t.v) ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-100 text-gray-500 hover:border-pink-200')}>
                                {t.l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Languages */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Langues parlées</label>
                    <div className="flex gap-2 flex-wrap">
                        {LANGS.map(l => (
                            <button key={l} type="button" onClick={() => toggleArr('languages_spoken', l)}
                                className={'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ' +
                                    (form.languages_spoken?.includes(l) ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-100 text-gray-500 hover:border-pink-200')}>
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="active" checked={form.is_active}
                        onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-pink-600" />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">Profil actif (visible par les utilisatrices)</label>
                </div>

                <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 w-full justify-center">
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                    {isEdit ? 'Enregistrer les modifications' : 'Ajouter le gynécologue'}
                </button>
            </div>
        </AdminLayout>
    );
}