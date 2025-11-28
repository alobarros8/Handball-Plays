/**
 * Servicio para compartir jugadas usando JSONBin.io
 * JSONBin.io permite almacenar JSON de forma gratuita y compartirlo mediante URLs
 */

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3';

/**
 * Sube una jugada a JSONBin y retorna el ID único para compartir
 * @param {Object} playData - Datos de la jugada (name, date, frames)
 * @returns {Promise<string>} - ID único del bin creado
 */
export async function uploadPlay(playData) {
    try {
        // Obtener API key de variables de entorno
        const apiKey = import.meta.env.VITE_JSONBIN_API_KEY;

        if (!apiKey) {
            throw new Error('Para compartir jugadas necesitas configurar tu API key de JSONBin.io. Visita https://jsonbin.io para obtener una clave gratuita y agrégala al archivo .env');
        }

        // Preparar los datos para subir
        const dataToUpload = {
            type: 'handball-play',
            version: '1.0',
            ...playData,
            sharedAt: new Date().toISOString()
        };

        // Crear un nuevo bin
        const response = await fetch(`${JSONBIN_API_URL}/b`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify(dataToUpload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('JSONBin error response:', errorData);
            throw new Error(`Error al compartir: ${response.status} - ${errorData.message || 'Error desconocido'}`);
        }

        const result = await response.json();

        // JSONBin retorna el ID en metadata.id
        return result.metadata.id;
    } catch (error) {
        console.error('Error uploading play:', error);
        throw error;
    }
}

/**
 * Obtiene una jugada compartida por su ID
 * @param {string} shareId - ID del bin de JSONBin
 * @returns {Promise<Object>} - Datos de la jugada
 */
export async function getSharedPlay(shareId) {
    try {
        const response = await fetch(`${JSONBIN_API_URL}/b/${shareId}/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Jugada no encontrada');
            }
            throw new Error(`Error al cargar: ${response.status}`);
        }

        const result = await response.json();

        // Validar que sea una jugada válida
        if (result.record && result.record.type === 'handball-play') {
            return result.record;
        } else {
            throw new Error('El enlace no corresponde a una jugada válida');
        }
    } catch (error) {
        console.error('Error fetching shared play:', error);
        throw error;
    }
}

/**
 * Genera una URL completa para compartir
 * @param {string} shareId - ID del bin
 * @returns {string} - URL completa
 */
export function generateShareUrl(shareId) {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?play=${shareId}`;
}
