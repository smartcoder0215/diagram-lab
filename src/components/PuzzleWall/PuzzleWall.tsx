import React from 'react';

interface PuzzleWallProps {
  items: string[];
  columns?: number;
  width?: number;
  height?: number;
  onPieceClick?: (index: number, item: string) => void;
}

const PuzzleWall: React.FC<PuzzleWallProps> = ({ 
  items, 
  columns = 4, 
  width = 1000, 
  height = 400, 
  onPieceClick 
}) => {
  const rows = Math.ceil(items.length / columns);
  const pieceWidth = width / columns;
  const pieceHeight = height / rows;
  
  const getPuzzleTabState = (r: number, c: number) => {
    return {
      hasRightTab: (r * columns + c) % 2 === 0,
      hasBottomTab: (r * columns + c) % 2 === 1
    };
  };
  
  const getPuzzlePath = (r: number, c: number): string => {
    const w = pieceWidth;
    const h = pieceHeight;
    const tabSize = Math.min(w, h) * 0.15;
    const curve = tabSize * 0.4;
    
    // Determine which sides have tabs (outward) vs blanks (inward)
    // Using position-based pattern to ensure adjacent pieces match
    const hasRightTab = (r * columns + c) % 2 === 0;
    const hasBottomTab = (r * columns + c) % 2 === 1;
    const hasLeftTab = c > 0 ? !getPuzzleTabState(r, c - 1).hasRightTab : (r + c) % 2 === 0;
    const hasTopTab = r > 0 ? !getPuzzleTabState(r - 1, c).hasBottomTab : (r + c) % 2 === 1;
    
    const left = c > 0;
    const right = c < columns - 1;
    const top = r > 0;
    const bottom = r < rows - 1;
    
    let path = `M0,0`;
    
    // Top edge
    if (top) {
      const mid = w / 2;
      if (hasTopTab) {
        // Outward tab (knob)
        path += ` H${mid - tabSize}`;
        path += ` C${mid - tabSize},${-curve} ${mid - tabSize/2},${-tabSize} ${mid},${-tabSize}`;
        path += ` C${mid + tabSize/2},${-tabSize} ${mid + tabSize},${-curve} ${mid + tabSize},0`;
        path += ` H${w}`;
      } else {
        // Inward blank (slot)
        path += ` H${mid - tabSize}`;
        path += ` C${mid - tabSize},${curve} ${mid - tabSize/2},${tabSize} ${mid},${tabSize}`;
        path += ` C${mid + tabSize/2},${tabSize} ${mid + tabSize},${curve} ${mid + tabSize},0`;
        path += ` H${w}`;
      }
    } else {
      path += ` H${w}`;
    }
    
    // Right edge
    if (right) {
      const mid = h / 2;
      if (hasRightTab) {
        // Outward tab
        path += ` V${mid - tabSize}`;
        path += ` C${w + curve},${mid - tabSize} ${w + tabSize},${mid - tabSize/2} ${w + tabSize},${mid}`;
        path += ` C${w + tabSize},${mid + tabSize/2} ${w + curve},${mid + tabSize} ${w},${mid + tabSize}`;
        path += ` V${h}`;
      } else {
        // Inward blank
        path += ` V${mid - tabSize}`;
        path += ` C${w - curve},${mid - tabSize} ${w - tabSize},${mid - tabSize/2} ${w - tabSize},${mid}`;
        path += ` C${w - tabSize},${mid + tabSize/2} ${w - curve},${mid + tabSize} ${w},${mid + tabSize}`;
        path += ` V${h}`;
      }
    } else {
      path += ` V${h}`;
    }
    
    // Bottom edge
    if (bottom) {
      const mid = w / 2;
      if (hasBottomTab) {
        // Outward tab
        path += ` H${mid + tabSize}`;
        path += ` C${mid + tabSize},${h + curve} ${mid + tabSize/2},${h + tabSize} ${mid},${h + tabSize}`;
        path += ` C${mid - tabSize/2},${h + tabSize} ${mid - tabSize},${h + curve} ${mid - tabSize},${h}`;
        path += ` H0`;
      } else {
        // Inward blank
        path += ` H${mid + tabSize}`;
        path += ` C${mid + tabSize},${h - curve} ${mid + tabSize/2},${h - tabSize} ${mid},${h - tabSize}`;
        path += ` C${mid - tabSize/2},${h - tabSize} ${mid - tabSize},${h - curve} ${mid - tabSize},${h}`;
        path += ` H0`;
      }
    } else {
      path += ` H0`;
    }
    
    // Left edge
    if (left) {
      const mid = h / 2;
      if (hasLeftTab) {
        // Outward tab
        path += ` V${mid + tabSize}`;
        path += ` C${-curve},${mid + tabSize} ${-tabSize},${mid + tabSize/2} ${-tabSize},${mid}`;
        path += ` C${-tabSize},${mid - tabSize/2} ${-curve},${mid - tabSize} 0,${mid - tabSize}`;
        path += ` V0`;
      } else {
        // Inward blank
        path += ` V${mid + tabSize}`;
        path += ` C${curve},${mid + tabSize} ${tabSize},${mid + tabSize/2} ${tabSize},${mid}`;
        path += ` C${tabSize},${mid - tabSize/2} ${curve},${mid - tabSize} 0,${mid - tabSize}`;
        path += ` V0`;
      }
    } else {
      path += ` V0`;
    }
    
    return path + ' Z';
  };
  
  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="block mx-auto border-4 border-orange-400 rounded-xl bg-orange-50"
      >
        {Array.from({ length: rows * columns }, (_, idx) => {
          const r = Math.floor(idx / columns);
          const c = idx % columns;
          const x = c * pieceWidth;
          const y = r * pieceHeight;
          const item = items[idx];
          const hue = (idx * 37) % 360;
          
          return (
            <g key={idx} transform={`translate(${x}, ${y})`}>
              <path
                d={getPuzzlePath(r, c)}
                fill={`hsl(${hue}, 70%, 75%)`}
                stroke="#4b5563"
                strokeWidth="2"
                className="cursor-pointer hover:brightness-110 transition-all"
                onClick={() => onPieceClick && onPieceClick(idx, item)}
              />
              {item && (
                <foreignObject x="15" y="15" width={pieceWidth - 30} height={pieceHeight - 30}>
                  <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-800 text-center px-2 pointer-events-none">
                    {item}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default PuzzleWall; 