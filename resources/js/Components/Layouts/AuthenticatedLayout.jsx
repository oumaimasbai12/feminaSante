import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import EmergencyBanner from '../Common/EmergencyBanner';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <EmergencyBanner />
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/dashboard" className="text-2xl font-black text-rose-600 tracking-tighter">
                                    FEMINA SANTÉ
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-rose-600 hover:border-rose-300 focus:outline-none transition duration-150 ease-in-out">
                                    Tableau de bord
                                </Link>
                                <Link href="/diseases" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-rose-600 hover:border-rose-300 focus:outline-none transition duration-150 ease-in-out">
                                    Encyclopédie Médicale
                                </Link>
                                <Link href="/cycle" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-rose-600 hover:border-rose-300 focus:outline-none transition duration-150 ease-in-out">
                                    Mon Cycle
                                </Link>
                                <Link href="/pregnancy" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-rose-600 hover:border-rose-300 focus:outline-none transition duration-150 ease-in-out">
                                    Grossesse
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="relative">
                                {user ? (
                                    <Link href="/profile" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-600 bg-gray-50 hover:text-gray-800 hover:bg-gray-100 transition ease-in-out duration-150">
                                        {user.nom || user.name || 'Profil Unique'}
                                    </Link>
                                ) : (
                                    <Link href="/login" className="text-sm font-semibold text-rose-600 hover:text-rose-800">Se connecter</Link>
                                )}
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-white border-t border-gray-100 absolute w-full'}>
                    <div className="pt-2 pb-3 space-y-1 shadow-lg">
                        <Link href="/dashboard" className="block pl-3 pr-4 py-3 border-l-4 border-rose-500 text-base font-medium text-rose-700 bg-rose-50">
                            Tableau de bord
                        </Link>
                        <Link href="/diseases" className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50">
                            Encyclopédie Médicale
                        </Link>
                        <Link href="/cycle" className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50">
                            Mon Cycle
                        </Link>
                        <Link href="/pregnancy" className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50">
                            Grossesse
                        </Link>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] z-30">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-grow">{children}</main>
            
            <footer className="bg-white border-t border-gray-200 mt-12 py-8 text-center text-gray-500 text-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="mb-2">⚠️ Femina Santé est un outil d'accompagnement éducatif. Il ne se substitue en aucun cas à un avis médical professionnel.</p>
                    <p>&copy; {new Date().getFullYear()} Femina Santé. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}
