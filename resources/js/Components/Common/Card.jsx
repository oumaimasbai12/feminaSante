import React from 'react';

export default function Card({ title, children, className = '', headerAction = null }) {
    return (
        <div className={`bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 ${className}`}>
            {(title || headerAction) && (
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
