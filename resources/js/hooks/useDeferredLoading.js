import { useEffect, useState } from 'react';

/**
 * Delays showing loading UI so fast requests never flash skeletons during navigation.
 */
export function useDeferredLoading(active, delay = 280) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!active) {
            setShow(false);
            return undefined;
        }

        const id = window.setTimeout(() => setShow(true), delay);
        return () => window.clearTimeout(id);
    }, [active, delay]);

    return show;
}
