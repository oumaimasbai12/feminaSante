import { useCallback, useEffect, useRef, useState } from 'react';

const cache = new Map();

function readCache(key) {
    const entry = cache.get(key);
    return entry ? entry.data : undefined;
}

function writeCache(key, data) {
    cache.set(key, { data, fetchedAt: Date.now() });
}

/**
 * Cached API query — shows stale data instantly on revisit, refreshes in background.
 */
export function useApiQuery(key, request, { enabled = true } = {}) {
    const [data, setData] = useState(() => readCache(key));
    const [isLoading, setIsLoading] = useState(enabled && readCache(key) === undefined);
    const requestRef = useRef(request);
    const mountedRef = useRef(true);
    requestRef.current = request;

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const run = useCallback(
        async (silent = false) => {
            if (!enabled) return null;

            if (!silent) {
                setIsLoading(true);
            }

            try {
                const result = await requestRef.current();
                writeCache(key, result);
                if (mountedRef.current) {
                    setData(result);
                }
                return result;
            } catch (err) {
                if (!silent) {
                    throw err;
                }
                return null;
            } finally {
                if (!silent && mountedRef.current) {
                    setIsLoading(false);
                }
            }
        },
        [enabled, key],
    );

    useEffect(() => {
        if (!enabled) return undefined;

        const cached = readCache(key);
        if (cached !== undefined) {
            setData(cached);
            setIsLoading(false);
            run(true);
            return undefined;
        }

        let cancelled = false;

        (async () => {
            try {
                await run(false);
            } catch {
                if (!cancelled) {
                    setData(null);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [enabled, key, run]);

    const refetch = useCallback(async () => {
        const silent = readCache(key) !== undefined;
        try {
            return await run(silent);
        } catch {
            return null;
        }
    }, [key, run]);

    return {
        data,
        isLoading,
        isInitialLoading: isLoading && data === undefined,
        refetch,
    };
}
