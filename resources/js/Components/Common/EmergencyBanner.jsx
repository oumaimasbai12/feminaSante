import React, { useState } from 'react';

export default function EmergencyBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-red-600 text-white relative z-50">
            <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="w-0 flex-1 flex items-center justify-center font-medium">
                        <span className="flex p-2 rounded-lg bg-red-800">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </span>
                        <p className="ml-3 font-bold truncate">
                            <span className="md:hidden">Urgence ? Appelez le 15, 112 ou 114.</span>
                            <span className="hidden md:inline">En cas d'urgence médicale grave, appelez immédiatement le SAMU (15), les urgences européennes (112) ou le 114 (par SMS).</span>
                        </p>
                    </div>
                    <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                        <button
                            type="button"
                            onClick={() => setIsVisible(false)}
                            className="-mr-1 flex p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 transition"
                        >
                            <span className="sr-only">Fermer</span>
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
