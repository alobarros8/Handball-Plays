import React, { useState } from 'react';
import { copyToClipboard } from '../utils/urlUtils';

/**
 * Modal para mostrar el enlace de jugada compartida
 * @param {Object} props
 * @param {string} props.shareUrl - URL generada para compartir
 * @param {Function} props.onClose - Función para cerrar el modal
 */
const ShareModal = ({ shareUrl, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard(shareUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">🔗 Compartir Jugada</h3>
                <p className="modal-subtitle">
                    ¡Tu jugada está lista para compartir! Copia este enlace:
                </p>

                <div className="share-url-container">
                    <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="share-url-input"
                        onClick={(e) => e.target.select()}
                    />
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-reset btn-small">
                        ❌ Cerrar
                    </button>
                    <button
                        onClick={handleCopy}
                        className={`btn btn-small ${copied ? 'btn-success' : 'btn-save'}`}
                    >
                        {copied ? '✅ ¡Copiado!' : '📋 Copiar Enlace'}
                    </button>
                </div>

                <div className="share-info">
                    <small>
                        💡 Cualquier persona con este enlace podrá ver y reproducir tu jugada.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
