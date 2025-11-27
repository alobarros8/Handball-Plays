import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente que representa una ficha arrastrable (Jugador o Pelota).
 * Maneja los eventos de ratón y táctiles para permitir el movimiento.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.id - Identificador único de la ficha.
 * @param {number} props.x - Posición X actual (en píxeles relativos al contenedor).
 * @param {number} props.y - Posición Y actual.
 * @param {string} props.color - Color de fondo de la ficha.
 * @param {string} props.type - Tipo de ficha ('player' | 'ball').
 * @param {Function} props.onPositionChange - Callback cuando la posición cambia (id, x, y).
 * @param {boolean} props.isRecording - Indica si se está grabando (para efectos visuales).
 * @returns {JSX.Element} El elemento visual de la ficha.
 */
const DraggableToken = ({ id, x, y, color, type, onPositionChange, isRecording, style: customStyle }) => {
    const [isDragging, setIsDragging] = useState(false);
    const tokenRef = useRef(null);
    const dragOffset = useRef({ x: 0, y: 0 });

    /**
     * Inicia el arrastre de la ficha.
     * Calcula el offset del clic respecto al centro o esquina de la ficha.
     * @param {React.MouseEvent | React.TouchEvent} e - Evento de inicio.
     */
    const handleStart = (e) => {
        e.preventDefault();
        setIsDragging(true);

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Calcular offset para que la ficha no "salte" al centro del mouse
        // Asumimos que x e y son el centro o la esquina top-left.
        // Vamos a usar x,y como centro para facilitar la lógica de cancha.
        // Pero en DOM, left/top son esquina. Ajustaremos en el estilo.

        // Si x,y son coordenadas relativas al padre, necesitamos saber dónde está el padre?
        // No, simplemente actualizamos x,y.
        // El problema es que clientX es global.
        // Necesitamos la posición inicial del mouse relativa a la posición actual de la ficha.

        dragOffset.current = {
            x: clientX,
            y: clientY
        };
    };

    /**
     * Maneja el movimiento del mouse/touch mientras se arrastra.
     * @param {MouseEvent | TouchEvent} e - Evento de movimiento global.
     */
    const handleMove = (e) => {
        if (!isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - dragOffset.current.x;
        const deltaY = clientY - dragOffset.current.y;

        dragOffset.current = { x: clientX, y: clientY };

        onPositionChange(id, x + deltaX, y + deltaY);
    };

    /**
     * Finaliza el arrastre.
     */
    const handleEnd = () => {
        setIsDragging(false);
    };

    // Efectos globales para capturar movimiento fuera del elemento
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', handleEnd);
        } else {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, x, y]); // Dependencias para closure de handleMove

    // Estilos
    const size = type === 'ball' ? 12 : 24;

    // Estilos base (se usan si no hay customStyle con left/top)
    const baseStyle = {
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        border: type === 'ball' ? '1px solid #000' : '2px solid white',
        zIndex: isDragging ? 100 : 10,
        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.1s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '10px',
        fontWeight: 'bold',
        userSelect: 'none'
    };

    // Si hay customStyle, lo usamos para posicionamiento
    // Si no, usamos x,y para calcular left/top
    const style = customStyle ? {
        ...baseStyle,
        ...customStyle,
        // Asegurar que transform incluya la escala de arrastre
        transform: customStyle.transform + (isDragging ? ' scale(1.1)' : ' scale(1)')
    } : {
        ...baseStyle,
        left: x - size / 2,
        top: y - size / 2
    };

    return (
        <div
            ref={tokenRef}
            style={style}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
        >
            {type !== 'ball' && id}
        </div>
    );
};

export default DraggableToken;
