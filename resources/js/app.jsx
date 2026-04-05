import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'FeminaSante';

createInertiaApp({
    title: (title) => title ? title + ' - ' + appName : appName,
    resolve: (name) => resolvePageComponent('./Pages/' + name + '.jsx', import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: { color: '#EC4899' },
});
