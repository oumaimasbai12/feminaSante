import React, { useEffect, useSyncExternalStore } from 'react';
import { router } from '@inertiajs/react';

export const PAGE_TRANSITION_MS = 300;

let visible = false;
const listeners = new Set();
let routerInitialized = false;

function emit() {
    listeners.forEach((listener) => listener());
}

function setVisible(next) {
    if (visible === next) return;
    visible = next;
    emit();
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return visible;
}

function initRouterTransitions() {
    if (routerInitialized) return;
    routerInitialized = true;

    router.on('start', () => setVisible(false));
    router.on('finish', () => {
        window.setTimeout(() => setVisible(true), PAGE_TRANSITION_MS);
    });
}

export default function PageTransition({ children, className = '', fadeOnly = false }) {
    initRouterTransitions();

    const isVisible = useSyncExternalStore(subscribe, getSnapshot, () => true);

    useEffect(() => {
        const timer = window.setTimeout(() => setVisible(true), 50);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <div
            className={[
                'page-view',
                fadeOnly ? 'page-view--fade-only' : '',
                isVisible ? 'page-view--visible' : 'page-view--hidden',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {children}
        </div>
    );
}
