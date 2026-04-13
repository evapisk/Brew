"use client";

// Pixel-art coffee cup SVG — transparent background, animated steam
// Colours sampled from the reference image
const CUP   = "#F5E6A3";   // cream/yellow cup body
const DARK  = "#F0DC8C";   // cup shadow side
const SHADE = "#C8B86A";   // cup base shadow
const BREW  = "#2A1A08";   // dark coffee liquid
const BRIM  = "#3D2810";   // inner brim / highlight
const STM   = "#F5F0DC";   // steam / cream

// Each rect is [col, row] in a 20×20 pixel grid; cellSize drives the scale
const CUP_PIXELS: [number, number, string][] = [
  // ── handle (right side) ──
  [15,7,CUP],[16,7,CUP],
  [16,8,CUP],[17,8,CUP],
  [16,9,CUP],[17,9,CUP],
  [16,10,CUP],[17,10,CUP],
  [15,11,CUP],[16,11,CUP],

  // ── cup rim ──
  [4,6,BRIM],[5,6,BRIM],[6,6,BRIM],[7,6,BRIM],[8,6,BRIM],[9,6,BRIM],
  [10,6,BRIM],[11,6,BRIM],[12,6,BRIM],[13,6,BRIM],[14,6,BRIM],

  // ── coffee surface / top ──
  [4,7,BREW],[5,7,BREW],[6,7,BREW],[7,7,BREW],[8,7,BREW],[9,7,BREW],
  [10,7,BREW],[11,7,BREW],[12,7,BREW],[13,7,BREW],[14,7,BREW],
  [5,8,BREW],[6,8,BREW],[7,8,BREW],[8,8,BREW],[9,8,BREW],
  [10,8,BREW],[11,8,BREW],[12,8,BREW],[13,8,BREW],

  // ── cup body ──
  [4,8,CUP],[14,8,CUP],
  [4,9,CUP],[5,9,CUP],[13,9,CUP],[14,9,CUP],
  [4,10,CUP],[5,10,CUP],[13,10,CUP],[14,10,CUP],
  [4,11,CUP],[5,11,CUP],[13,11,CUP],[14,11,CUP],
  [4,12,CUP],[14,12,CUP],

  // ── fill inside cup body ──
  [6,9,CUP],[7,9,CUP],[8,9,CUP],[9,9,CUP],[10,9,CUP],[11,9,CUP],[12,9,CUP],
  [6,10,CUP],[7,10,CUP],[8,10,CUP],[9,10,CUP],[10,10,CUP],[11,10,CUP],[12,10,CUP],
  [6,11,CUP],[7,11,CUP],[8,11,CUP],[9,11,CUP],[10,11,CUP],[11,11,CUP],[12,11,CUP],
  [6,12,CUP],[7,12,CUP],[8,12,CUP],[9,12,CUP],[10,12,CUP],[11,12,CUP],[12,12,CUP],

  // ── shadow on left wall ──
  [4,9,DARK],[4,10,DARK],[4,11,DARK],[5,9,DARK],[5,10,DARK],[5,11,DARK],

  // ── bottom of cup ──
  [5,13,CUP],[6,13,CUP],[7,13,CUP],[8,13,CUP],[9,13,CUP],
  [10,13,CUP],[11,13,CUP],[12,13,CUP],[13,13,CUP],

  // ── saucer ──
  [3,14,SHADE],[4,14,SHADE],[5,14,CUP],[6,14,CUP],[7,14,CUP],[8,14,CUP],
  [9,14,CUP],[10,14,CUP],[11,14,CUP],[12,14,CUP],[13,14,SHADE],[14,14,SHADE],
  [4,15,SHADE],[5,15,SHADE],[6,15,SHADE],[7,15,SHADE],[8,15,SHADE],
  [9,15,SHADE],[10,15,SHADE],[11,15,SHADE],[12,15,SHADE],[13,15,SHADE],
];

// Steam columns: left wisp and right wisp (row 0 = top)
const STEAM_LEFT: [number, number][] = [
  [7,5],[7,4],[6,3],[6,2],[7,1],[7,0],
];
const STEAM_RIGHT: [number, number][] = [
  [10,5],[11,4],[11,3],[10,2],[10,1],[11,0],
];

export function CoffeeCup({ size = 80 }: { size?: number }) {
  const cell = size / 20;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      <style>{`
        @keyframes waft-l {
          0%   { transform: translateY(0px);   opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(-${cell * 5}px); opacity: 0; }
        }
        @keyframes waft-r {
          0%   { transform: translateY(0px);   opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(-${cell * 5}px); opacity: 0; }
        }
        .waft-l { animation: waft-l 1.8s ease-in-out infinite; }
        .waft-r { animation: waft-r 1.8s ease-in-out infinite; animation-delay: 0.6s; }
      `}</style>

      {/* Cup & saucer pixels */}
      {CUP_PIXELS.map(([col, row, color], i) => (
        <rect
          key={i}
          x={col * cell}
          y={row * cell}
          width={cell}
          height={cell}
          fill={color}
        />
      ))}

      {/* Steam — left wisp */}
      <g className="waft-l">
        {STEAM_LEFT.map(([col, row], i) => (
          <rect key={i} x={col * cell} y={row * cell} width={cell} height={cell} fill={STM} />
        ))}
      </g>

      {/* Steam — right wisp */}
      <g className="waft-r">
        {STEAM_RIGHT.map(([col, row], i) => (
          <rect key={i} x={col * cell} y={row * cell} width={cell} height={cell} fill={STM} />
        ))}
      </g>
    </svg>
  );
}
