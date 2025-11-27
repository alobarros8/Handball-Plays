import React from 'react';

// Constantes exportadas para que PlayDesigner pueda alinear las fichas
export const COURT_CONFIG = {
    scale: 30, // 1m = 30px
    courtWidth: 20, // 20m ancho
    courtLength: 20, // 20m largo (media cancha)
    margin: 0.5, // Margen mínimo para ver la línea de borde
};

/**
 * Componente que renderiza la media cancha de handball (Vertical).
 * Solo el área de juego.
 */
const Court = () => {
    const { scale, courtWidth, courtLength, margin } = COURT_CONFIG;

    const m = (val) => val * scale;

    const totalWidth = m(courtWidth + margin * 2);
    const totalHeight = m(courtLength + margin * 2);

    const offsetX = m(margin);
    const offsetY = m(margin);

    // Colores
    const colors = {
        court: "#f97316",      // Naranja vibrante
        area: "#b91c1c",       // Rojo oscuro
        lines: "white",
    };

    return (
        <div className="court-bg w-full h-full">
            <svg width="100%" height="100%" viewBox={`0 0 ${totalWidth} ${totalHeight}`}>

                {/* Cancha de Juego (con líneas de banda y fondo) */}
                <rect
                    x={offsetX}
                    y={offsetY}
                    width={m(courtWidth)}
                    height={m(courtLength)}
                    fill={colors.court}
                    stroke={colors.lines}
                    strokeWidth="5"
                />

                {/* Grupo de la cancha (Offset) */}
                <g transform={`translate(${offsetX}, ${offsetY})`}>

                    {/* --- Área de Portería (6m) --- */}
                    <path
                        d={`
              M ${m(2.5)} ${m(20)}
              A ${m(6)} ${m(6)} 0 0 1 ${m(8.5)} ${m(14)}
              L ${m(11.5)} ${m(14)}
              A ${m(6)} ${m(6)} 0 0 1 ${m(17.5)} ${m(20)}
              L ${m(2.5)} ${m(20)}
            `}
                        fill={colors.area}
                        stroke="none"
                    />

                    {/* Línea de 6m */}
                    <path
                        d={`
              M ${m(2.5)} ${m(20)}
              A ${m(6)} ${m(6)} 0 0 1 ${m(8.5)} ${m(14)}
              L ${m(11.5)} ${m(14)}
              A ${m(6)} ${m(6)} 0 0 1 ${m(17.5)} ${m(20)}
            `}
                        fill="none"
                        stroke={colors.lines}
                        strokeWidth="3"
                    />

                    {/* --- Línea de Golpe Franco (9m) --- */}
                    <path
                        d={`
              M ${m(-0.5)} ${m(20)}
              A ${m(9)} ${m(9)} 0 0 1 ${m(8.5)} ${m(11)}
              L ${m(11.5)} ${m(11)}
              A ${m(9)} ${m(9)} 0 0 1 ${m(20.5)} ${m(20)}
            `}
                        fill="none"
                        stroke={colors.lines}
                        strokeWidth="3"
                        strokeDasharray="15,15"
                    />

                    {/* --- Línea de 7m (Penal) --- */}
                    <line
                        x1={m(9.5)} y1={m(13)}
                        x2={m(10.5)} y2={m(13)}
                        stroke={colors.lines}
                        strokeWidth="3"
                    />

                    {/* --- Línea de Restricción del Arquero (4m) --- */}
                    <line
                        x1={m(9.925)} y1={m(16)}
                        x2={m(10.075)} y2={m(16)}
                        stroke={colors.lines}
                        strokeWidth="3"
                    />

                    {/* --- Línea Central --- */}
                    <line
                        x1={m(0)} y1={m(0)}
                        x2={m(20)} y2={m(0)}
                        stroke={colors.lines}
                        strokeWidth="3"
                    />

                    {/* --- Portería --- */}
                    <g transform={`translate(${m(8.5)}, ${m(20)})`}>
                        <rect
                            x="0" y="0"
                            width={m(3)} height={m(1)}
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                        />
                        {/* Red */}
                        <pattern id="netV" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                        <rect
                            x="0" y="0"
                            width={m(3)} height={m(1)}
                            fill="url(#netV)"
                            opacity="0.3"
                        />
                    </g>

                    {/* --- Líneas de Cambio --- */}
                    <line
                        x1={m(19.85)} y1={m(4.5)}
                        x2={m(20.15)} y2={m(4.5)}
                        stroke={colors.lines}
                        strokeWidth="3"
                    />
                </g>

            </svg>
        </div>
    );
};

export default Court;
