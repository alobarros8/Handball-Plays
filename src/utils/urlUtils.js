/**
 * Utilidades para manejar URLs y parámetros de jugadas compartidas
 */

/**
 * Obtiene el ID de jugada compartida desde la URL
 * @returns {string|null} - ID de la jugada o null si no existe
 */
export function getSharedPlayIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('play');
}

/**
 * Verifica si la app se abrió desde un enlace compartido
 * @returns {boolean}
 */
export function isSharedPlayUrl() {
    return getSharedPlayIdFromUrl() !== null;
}

/**
 * Limpia el parámetro de jugada compartida de la URL sin recargar
 */
export function clearSharedPlayParam() {
    const url = new URL(window.location);
    url.searchParams.delete('play');
    window.history.replaceState({}, '', url);
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} - true si se copió exitosamente
 */
export async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    } catch (err) {
        console.error('Error copying to clipboard:', err);
        return false;
    }
}
