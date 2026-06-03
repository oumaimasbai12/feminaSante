/**
 * Parse query string from an Inertia page URL or window location.
 */
export function getSearchParams(source = '') {
    const query = source.includes('?')
        ? source.slice(source.indexOf('?'))
        : typeof window !== 'undefined'
          ? window.location.search
          : '';
    return new URLSearchParams(query);
}

/**
 * Scroll the app main panel to an element (avoids scrolling the whole document).
 */
export function scrollMainToElement(element, offset = 96) {
    if (!element) return;
    const main = element.closest('main');
    if (!main) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    const top =
        element.getBoundingClientRect().top -
        main.getBoundingClientRect().top +
        main.scrollTop -
        offset;
    main.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}
