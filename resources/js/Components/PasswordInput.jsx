import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({
    value,
    onChange,
    placeholder = '',
    required = false,
    minLength,
    className = '',
    inputClassName,
    icon: Icon = Lock,
    showIcon = true,
    id,
    name,
    autoComplete,
}) {
    const [show, setShow] = useState(false);

    const inputClasses = inputClassName ?? (
        'input-field ' + (showIcon ? 'pl-11 pr-11' : 'pr-11')
    );

    return (
        <div className={`relative ${className}`}>
            {showIcon && Icon && (
                <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            )}
            <input
                id={id}
                name={name}
                type={show ? 'text' : 'password'}
                required={required}
                minLength={minLength}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={inputClasses}
            />
            <button
                type="button"
                onClick={() => setShow(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink transition-colors"
                tabIndex={-1}
                aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}
