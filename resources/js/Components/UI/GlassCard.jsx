import React from 'react';

export default function GlassCard({ children, className = '', hover = false, padding = 'p-5', style, noEnter = false }) {
    return (
        <div
            className={`glass-card ${padding} ${hover ? 'hover:border-brand-primary/25' : ''} ${noEnter ? 'no-enter' : ''} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}
