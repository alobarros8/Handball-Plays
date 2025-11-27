import React, { useState, useEffect, useRef } from 'react';
import Court, { COURT_CONFIG } from '../components/Court';
import DraggableToken from '../components/DraggableToken';

/**
 * Componente principal para el diseño de jugadas.
 * @returns {JSX.Element} La interfaz de diseño de jugadas.
 */
const PlayDesigner = () => {
    // Configuración de la cancha
    const { scale, margin, courtWidth, courtLength } = COURT_CONFIG;

    // Dimensiones totales internas
    const totalInternalWidth = (courtWidth + margin * 2) * scale;
    const totalInternalHeight = (courtLength + margin * 2) * scale;

    // Límites para las fichas
    const minX = margin * scale;
    const maxX = (margin + courtWidth) * scale;
    const minY = margin * scale;
    const maxY = (margin + courtLength) * scale;

    const offsetX = margin * scale;
    const offsetY = margin * scale;

    // Posiciones iniciales por defecto
    const getInitialTokens = () => [
        // Equipo A (Azul - Ataque) - Sobre la línea de 9m (Punteada)
        { id: 'A1', type: 'player', x: 2 * scale, y: 14 * scale, color: '#3b82f6' },
        { id: 'A2', type: 'player', x: 5 * scale, y: 12 * scale, color: '#3b82f6' },
        { id: 'A3', type: 'player', x: 9 * scale, y: 10.5 * scale, color: '#3b82f6' },
        { id: 'A4', type: 'player', x: 11 * scale, y: 10.5 * scale, color: '#3b82f6' },
        { id: 'A5', type: 'player', x: 15 * scale, y: 12 * scale, color: '#3b82f6' },
        { id: 'A6', type: 'player', x: 18 * scale, y: 14 * scale, color: '#3b82f6' },

        // Equipo B (Rojo - Defensa) - Sobre la línea de 6m (Área)
        { id: 'B1', type: 'player', x: 3.5 * scale, y: 19 * scale, color: '#ef4444' },
        { id: 'B2', type: 'player', x: 6 * scale, y: 16.5 * scale, color: '#ef4444' },
        { id: 'B3', type: 'player', x: 9 * scale, y: 15 * scale, color: '#ef4444' },
        { id: 'B4', type: 'player', x: 11 * scale, y: 15 * scale, color: '#ef4444' },
        { id: 'B5', type: 'player', x: 14 * scale, y: 16.5 * scale, color: '#ef4444' },
        { id: 'B6', type: 'player', x: 16.5 * scale, y: 19 * scale, color: '#ef4444' },

        // Pelota
        { id: 'Ball', type: 'ball', x: 9 * scale, y: 10 * scale, color: '#ffc107' },
    ];

    const [adjustedTokens, setAdjustedTokens] = useState(() =>
        getInitialTokens().map(t => ({ ...t, x: t.x + offsetX, y: t.y + offsetY }))
    );

    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordedFrames, setRecordedFrames] = useState([]);
    const [savedPlays, setSavedPlays] = useState([]);
    const [containerScale, setContainerScale] = useState(1);
    const [ballCarrierId, setBallCarrierId] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const containerRef = useRef(null);
    const startTimeRef = useRef(null);
    const requestRef = useRef(null);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const currentWidth = containerRef.current.offsetWidth;
                const newScale = currentWidth / totalInternalWidth;
                setContainerScale(newScale);
            }
        };
        updateScale();
        const resizeObserver = new ResizeObserver(updateScale);
        if (containerRef.current) resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [totalInternalWidth]);

    useEffect(() => {
        const saved = localStorage.getItem('handballPlays');
        if (saved) {
            try {
                setSavedPlays(JSON.parse(saved));
            } catch (e) {
                console.error("Error cargando jugadas", e);
            }
        }
    }, []);

    const handleTokenMove = (id, newX, newY) => {
        if (isPlaying) return;

        // Radio ajustado para fichas más pequeñas
        const radius = 15;
        const clampedX = Math.max(minX + radius, Math.min(maxX - radius, newX));
        const clampedY = Math.max(minY + radius, Math.min(maxY - radius, newY));

        setAdjustedTokens((prevTokens) => {
            let updatedTokens = prevTokens.map(t =>
                t.id === id ? { ...t, x: clampedX, y: clampedY } : t
            );

            const ball = updatedTokens.find(t => t.type === 'ball');
            const mover = updatedTokens.find(t => t.id === id);

            if (mover.type === 'player') {
                if (ballCarrierId === id) {
                    updatedTokens = updatedTokens.map(t =>
                        t.type === 'ball' ? { ...t, x: clampedX + 10, y: clampedY + 10 } : t
                    );
                } else {
                    const dist = Math.hypot(clampedX - ball.x, clampedY - ball.y);
                    if (dist < 30) {
                        setBallCarrierId(id);
                    }
                }
            } else if (mover.type === 'ball') {
                setBallCarrierId(null);
            }

            if (isRecording) {
                const timestamp = Date.now() - startTimeRef.current;
                setRecordedFrames(prev => [...prev, { timestamp, tokens: updatedTokens }]);
            }

            return updatedTokens;
        });
    };

    const startRecording = () => {
        setIsRecording(true);
        setIsPlaying(false);
        setRecordedFrames([]);
        startTimeRef.current = Date.now();
        setRecordedFrames([{ timestamp: 0, tokens: adjustedTokens }]);
    };

    const stop = () => {
        setIsRecording(false);
        setIsPlaying(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const playRecording = () => {
        if (recordedFrames.length === 0) return;
        setIsPlaying(true);
        setIsRecording(false);

        const startPlayTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startPlayTime;

            const currentFrame = recordedFrames.reduce((prev, curr) => {
                return (curr.timestamp <= elapsed) ? curr : prev;
            }, recordedFrames[0]);

            if (currentFrame) {
                setAdjustedTokens(currentFrame.tokens);
            }

            const lastFrame = recordedFrames[recordedFrames.length - 1];
            if (elapsed > lastFrame.timestamp) {
                setIsPlaying(false);
                return;
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
    };

    const resetPositions = () => {
        if (isRecording || isPlaying) return;
        setAdjustedTokens(getInitialTokens().map(t => ({ ...t, x: t.x + offsetX, y: t.y + offsetY })));
        setBallCarrierId(null);
    };

    const savePlay = () => {
        const name = prompt("Nombre de la jugada:");
        if (name) {
            const newPlay = {
                id: Date.now().toString(),
                name,
                date: new Date().toISOString(),
                frames: recordedFrames
            };

            const updatedPlays = [...savedPlays, newPlay];
            setSavedPlays(updatedPlays);
            localStorage.setItem('handballPlays', JSON.stringify(updatedPlays));
            alert("Jugada guardada correctamente.");
        }
    };

    const loadPlay = (play) => {
        if (isRecording || isPlaying) return;
        setRecordedFrames(play.frames);
        if (play.frames.length > 0) {
            setAdjustedTokens(play.frames[0].tokens);
        }
        setIsMenuOpen(false);
    };

    const deletePlay = (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta jugada?")) {
            const updatedPlays = savedPlays.filter(p => p.id !== id);
            setSavedPlays(updatedPlays);
            localStorage.setItem('handballPlays', JSON.stringify(updatedPlays));
        }
    };

    return (
        <div className="main-container">
            {/* Controles */}
            <div className="controls-panel">
                <button
                    className={`btn btn-record ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? stop : startRecording}
                    disabled={isPlaying}
                >
                    {isRecording ? '⏹ Detener' : '⏺ Grabar'}
                </button>

                <button
                    className="btn btn-play"
                    onClick={isPlaying ? stop : playRecording}
                    disabled={isRecording || recordedFrames.length === 0}
                >
                    {isPlaying ? '⏸ Pausa' : '▶ Reproducir'}
                </button>

                <button
                    className="btn btn-save"
                    onClick={savePlay}
                    disabled={isRecording || isPlaying || recordedFrames.length === 0}
                >
                    💾 Guardar
                </button>

                <button
                    className="btn btn-reset"
                    onClick={resetPositions}
                    disabled={isRecording || isPlaying}
                >
                    🔄 Reiniciar
                </button>
            </div>

            {/* Cancha */}
            <div className="court-container">
                <div
                    ref={containerRef}
                    className="court-wrapper"
                    style={{
                        width: '100%',
                        aspectRatio: `${totalInternalWidth} / ${totalInternalHeight}`,
                        maxWidth: '1200px',
                        maxHeight: '1000px'
                    }}
                >
                    <div style={{ width: '100%', height: '100%' }}>
                        <Court />
                    </div>

                    {adjustedTokens.map(token => {
                        const leftPercent = (token.x / totalInternalWidth) * 100;
                        const topPercent = (token.y / totalInternalHeight) * 100;
                        return (
                            <DraggableToken
                                key={token.id}
                                {...token}
                                scale={containerScale}
                                onPositionChange={handleTokenMove}
                                isRecording={isRecording}
                                style={{
                                    left: `${leftPercent}%`,
                                    top: `${topPercent}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Barra de Estado */}
            <div className="status-bar">
                {isRecording && <span className="status-recording">🔴 Grabando... ({recordedFrames.length} frames)</span>}
                {isPlaying && <span className="status-playing">▶ Reproduciendo...</span>}
                {!isRecording && !isPlaying && recordedFrames.length > 0 && <span>✅ Jugada lista ({recordedFrames.length} frames)</span>}
                {ballCarrierId && !isPlaying && <span className="status-ball">⚡ Balón en: {ballCarrierId}</span>}
            </div>

            {/* Menú Desplegable de Jugadas Guardadas */}
            <div className="saved-plays-container">
                <div
                    className="saved-plays-header"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span>📋 Mis Jugadas ({savedPlays.length})</span>
                    <span className={`chevron ${isMenuOpen ? 'open' : ''}`}>▼</span>
                </div>
                <div className={`saved-plays-content ${isMenuOpen ? 'open' : ''}`}>
                    {savedPlays.length === 0 ? (
                        <div className="empty-state">
                            No hay jugadas guardadas.
                        </div>
                    ) : (
                        <ul className="saved-plays-list">
                            {savedPlays.map(play => (
                                <li key={play.id} className="play-item">
                                    <div className="play-name">{play.name}</div>
                                    <div className="play-date">{new Date(play.date).toLocaleString()}</div>
                                    <div className="play-actions">
                                        <button onClick={() => loadPlay(play)} className="btn btn-small btn-load">
                                            📤 Cargar
                                        </button>
                                        <button onClick={() => deletePlay(play.id)} className="btn btn-small btn-delete">
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayDesigner;
