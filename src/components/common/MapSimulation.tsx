import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Shield, ZoomIn, ZoomOut } from 'lucide-react';

interface MapSimulationProps {
  shopperLocation?: string;
  helperLocation?: string;
  storeLocation?: string;
  estimatedEtaMinutes?: number;
  distanceKm?: number;
  showRoute?: boolean;
  isSimulatingMovement?: boolean;
  privacyMasked?: boolean;
}

export const MapSimulation: React.FC<MapSimulationProps> = ({
  shopperLocation = 'Ikeja GRA, Lagos',
  helperLocation = 'Near Ikeja City Mall, Alausa',
  storeLocation = 'Basirat Provisions, Allen Ave',
  estimatedEtaMinutes = 18,
  distanceKm = 3.4,
  showRoute = true,
  privacyMasked = false
}) => {
  const [zoom, setZoom] = useState(1);
  const [helperProgress, setHelperProgress] = useState(0.35); // 0 to 1 along path
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveSimulating) {
      interval = setInterval(() => {
        setHelperProgress(prev => (prev >= 0.95 ? 0.2 : prev + 0.05));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Coordinates on SVG viewBox (0 0 600 360)
  const storePos = { x: 180, y: 190 };
  const shopperPos = { x: 440, y: 140 };
  // Helper moves between store and shopper
  const currentHelperPos = {
    x: storePos.x + (shopperPos.x - storePos.x) * helperProgress,
    y: storePos.y + (shopperPos.y - storePos.y) * helperProgress - Math.sin(helperProgress * Math.PI) * 45
  };

  return (
    <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-inner select-none">
      {/* SVG Vector Map Canvas */}
      <svg
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
        viewBox="0 0 600 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background land and water */}
        <rect width="600" height="360" fill="#0f172a" />
        
        {/* Water body simulation (Lagos Lagoon curve) */}
        <path
          d="M 500,0 C 480,90 520,200 580,260 L 600,280 L 600,0 Z"
          fill="#0369a1"
          opacity="0.25"
        />

        {/* Major roads grid (Lagos mainland street network simulation) */}
        <g stroke="#334155" strokeWidth="4" opacity="0.6">
          <line x1="0" y1="80" x2="600" y2="80" strokeWidth="6" />
          <line x1="0" y1="180" x2="600" y2="180" strokeWidth="8" stroke="#1e293b" />
          <line x1="0" y1="280" x2="600" y2="280" strokeWidth="5" />
          <line x1="120" y1="0" x2="120" y2="360" strokeWidth="5" />
          <line x1="280" y1="0" x2="280" y2="360" strokeWidth="7" stroke="#334155" />
          <line x1="420" y1="0" x2="420" y2="360" strokeWidth="5" />
        </g>

        {/* Secondary streets */}
        <g stroke="#1e293b" strokeWidth="2.5" opacity="0.8">
          <line x1="40" y1="0" x2="40" y2="360" />
          <line x1="200" y1="0" x2="200" y2="360" />
          <line x1="350" y1="0" x2="350" y2="360" />
          <line x1="510" y1="0" x2="510" y2="360" />
          <line x1="0" y1="130" x2="600" y2="130" />
          <line x1="0" y1="230" x2="600" y2="230" />
        </g>

        {/* Expressway (e.g. Ikorodu Road / Mobolaji Bank Anthony Way) */}
        <path
          d="M 30,340 C 140,290 240,160 380,100 C 470,60 560,30 600,20"
          stroke="#475569"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 30,340 C 140,290 240,160 380,100 C 470,60 560,30 600,20"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          opacity="0.6"
        />

        {/* Active Route Polyline from Store to Shopper */}
        {showRoute && (
          <>
            <path
              d={`M ${storePos.x},${storePos.y} Q 310,120 ${shopperPos.x},${shopperPos.y}`}
              stroke="#059669"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            <path
              d={`M ${storePos.x},${storePos.y} Q 310,120 ${shopperPos.x},${shopperPos.y}`}
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
              fill="none"
            />
          </>
        )}

        {/* Privacy circle around helper when approximate */}
        {privacyMasked && (
          <circle
            cx={currentHelperPos.x}
            cy={currentHelperPos.y}
            r="38"
            fill="#10b981"
            fillOpacity="0.15"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}

        {/* Store Marker */}
        <g transform={`translate(${storePos.x - 16}, ${storePos.y - 32})`}>
          <circle cx="16" cy="16" r="14" fill="#d97706" />
          <path d="M11 12 h10 v8 h-10 Z" fill="#ffffff" />
          <circle cx="16" cy="16" r="18" stroke="#f59e0b" strokeWidth="2" opacity="0.4" />
        </g>
        <text x={storePos.x} y={storePos.y + 16} fill="#fde68a" fontSize="10" fontWeight="600" textAnchor="middle">
          Store / Market
        </text>

        {/* Shopper Marker */}
        <g transform={`translate(${shopperPos.x - 16}, ${shopperPos.y - 32})`}>
          <circle cx="16" cy="16" r="14" fill="#2563eb" />
          <circle cx="16" cy="16" r="6" fill="#ffffff" />
          <circle cx="16" cy="16" r="22" stroke="#60a5fa" strokeWidth="2" opacity="0.4">
            <animate attributeName="r" values="16;26;16" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>
        <text x={shopperPos.x} y={shopperPos.y + 16} fill="#bfdbfe" fontSize="10" fontWeight="600" textAnchor="middle">
          Delivery Address
        </text>

        {/* Shopping Helper Marker */}
        <g transform={`translate(${currentHelperPos.x - 16}, ${currentHelperPos.y - 32})`}>
          <circle cx="16" cy="16" r="15" fill="#059669" />
          {/* Helper icon (motorcycle / runner) */}
          <circle cx="16" cy="12" r="3" fill="#ffffff" />
          <path d="M12 20 L16 16 L20 20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="24" stroke="#34d399" strokeWidth="2" opacity="0.5">
            <animate attributeName="r" values="16;30;16" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
        <text x={currentHelperPos.x} y={currentHelperPos.y + 16} fill="#a7f3d0" fontSize="10" fontWeight="700" textAnchor="middle">
          Helper (Tunde)
        </text>
      </svg>

      {/* Floating Top Map HUD */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/70 shadow-sm flex items-center gap-2 pointer-events-auto">
          <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-tight">
            {estimatedEtaMinutes} mins away
          </span>
          <span className="text-slate-400 text-xs">·</span>
          <span className="text-xs text-slate-300 font-mono">{distanceKm} km</span>
        </div>

        {privacyMasked && (
          <div className="bg-emerald-950/90 border border-emerald-700/80 px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-auto">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-200 font-medium">Privacy Mask Active</span>
          </div>
        )}
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/70 shadow-md">
        <button
          onClick={() => setZoom(z => Math.min(1.4, z + 0.15))}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg active:scale-95 transition"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.85, z - 0.15))}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg active:scale-95 transition"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsLiveSimulating(prev => !prev)}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg flex items-center gap-1 transition ${
            isLiveSimulating
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Compass className={`w-3 h-3 ${isLiveSimulating ? 'animate-spin' : ''}`} />
          {isLiveSimulating ? 'Live Tracking' : 'Simulate GPS'}
        </button>
      </div>

      {/* Floating Bottom Location Indicator */}
      <div className="absolute bottom-2.5 left-2.5 max-w-[210px] bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/70 text-[11px] text-slate-300 flex items-center gap-1.5 truncate">
        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="truncate">{helperLocation}</span>
      </div>
    </div>
  );
};
