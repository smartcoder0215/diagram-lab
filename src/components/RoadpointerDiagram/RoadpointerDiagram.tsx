import React from "react";

// Color themes for the pointers
const colorThemes = [
  "#2E7D6D", // Teal
  "#4A55A2", // Indigo
  "#D48A00", // Orange
  "#85A837", // Green
  "#C53030", // Red
  "#2B6CB0", // Blue
];

// The SVG Pointer component remains the same
const Pointer = ({
  label,
  direction,
}: {
  label: string;
  direction: "left" | "right";
}) => {
  const width = Math.max(220, label.length * 15 + 130);
  const height = 75;
  const tipWidth = 50;
  const bevel = 6; // Bevel width

  const p = (points: [number, number][]) => points.map(p => p.join(',')).join(' ');

  const getBodyPoints = (w: number, h: number, tip: number) => {
    if (direction === 'right') {
      return {
        outer: p([[0,0], [w-tip,0], [w,h/2], [w-tip,h], [0,h]]),
        inner: p([[bevel,bevel], [w-tip-bevel/2, bevel], [w-bevel, h/2], [w-tip-bevel/2, h-bevel], [bevel, h-bevel]]),
        topBevel: p([[0,0], [w-tip,0], [w-tip-bevel/2, bevel], [bevel,bevel]]),
        bottomBevel: p([[0,h], [w-tip,h], [w-tip-bevel/2, h-bevel], [bevel,h-bevel]]),
        tipBevel: p([[w-tip,0], [w,h/2], [w-bevel, h/2], [w-tip-bevel/2, bevel]]),
        tipBevelBottom: p([[w-tip,h], [w,h/2], [w-bevel, h/2], [w-tip-bevel/2, h-bevel]]),
      };
    }
    // left
    return {
      outer: p([[w,0], [tip,0], [0,h/2], [tip,h], [w,h]]),
      inner: p([[w-bevel, bevel], [tip+bevel/2, bevel], [bevel,h/2], [tip+bevel/2, h-bevel], [w-bevel,h-bevel]]),
      topBevel: p([[w,0], [tip,0], [tip+bevel/2, bevel], [w-bevel,bevel]]),
      bottomBevel: p([[w,h], [tip,h], [tip+bevel/2, h-bevel], [w-bevel,h-bevel]]),
      tipBevel: p([[tip,0], [0,h/2], [bevel,h/2], [tip+bevel/2, bevel]]),
      tipBevelBottom: p([[tip,h], [0,h/2], [bevel,h/2], [tip+bevel/2, h-bevel]]),
    };
  };
  
  const points = getBodyPoints(width, height, tipWidth);
  const textX = direction === 'right' ? (width - tipWidth) / 2 : (width + tipWidth) / 2;

  return (
    <svg
      width={width}
      height={height}
      className="drop-shadow-lg"
      style={{
        position: 'absolute',
        ...(direction === 'left' 
            ? { right: 'calc(50% + 12px)' } 
            : { left: 'calc(50% + 12px)' }),
      }}
    >
      <defs>
        <linearGradient id="inner-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.2"/>
            <stop offset="10%" stopColor="#000" stopOpacity="0.05"/>
            <stop offset="90%" stopColor="#fff" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0.2"/>
        </linearGradient>
        <pattern id="wood-pattern" patternUnits="userSpaceOnUse" width={width} height={height} >
            <rect width={width} height={height} fill="#d2b48c" />
            <line x1="0" y1="15" x2={width} y2="12" stroke="#a0522d" strokeOpacity="0.2" strokeWidth="2" />
            <line x1="0" y1="30" x2={width} y2="35" stroke="#a0522d" strokeOpacity="0.3" strokeWidth="3" />
            <line x1="0" y1="55" x2={width} y2="50" stroke="#a0522d" strokeOpacity="0.25" strokeWidth="2.5" />
            <line x1="0" y1="65" x2={width} y2="70" stroke="#a0522d" strokeOpacity="0.15" strokeWidth="1.5" />
        </pattern>
      </defs>

      {/* Main body with beveled edges */}
      <polygon points={points.topBevel} fill="#f5f5f5" />
      <polygon points={points.bottomBevel} fill="#a0a0a0" />
      <polygon points={points.tipBevel} fill="#e0e0e0" />
      <polygon points={points.tipBevelBottom} fill="#b0b0b0" />

      {/* Inner colored panel */}
      <polygon points={points.inner} fill="url(#wood-pattern)" />
      <polygon points={points.inner} fill="url(#inner-shadow)" />
      
      <text
        x={textX}
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="bold"
        letterSpacing="1"
        className="font-sans"
      >
        {label}
      </text>
    </svg>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TreeNode {
  label: string;
  children?: (TreeNode | string)[];
}

interface PointerItem {
  label: string;
  direction: "left" | "right";
  color: string;
  transform: string;
}

// This function converts the hierarchical data into a flat list for rendering
function flattenTree(data: TreeNode): { label: string, items: PointerItem[] } {
    const items: PointerItem[] = [];
    if(!data.children) return {label: data.label, items:[]};

    let itemIdx = 0;
    data.children.forEach((group, groupIdx) => {
        if (typeof group === 'string' || !group.children) return;

        const color = colorThemes[groupIdx % colorThemes.length];

        group.children.forEach((child) => {
            const label = typeof child === 'string' ? child : child.label;
            const direction: "left" | "right" = itemIdx % 2 === 0 ? 'left' : 'right';

            const yRotation = (direction === 'left' ? 1 : -1) * (Math.random() * 15 + 10);
            const zRotation = (Math.random() * 8 - 4);
            const transform = `rotateY(${yRotation.toFixed(2)}deg) rotateZ(${zRotation.toFixed(2)}deg)`;

            items.push({
                label,
                direction,
                color,
                transform,
            });
            itemIdx++;
        });
    });

    return {label: data.label, items};
}

export const RoadpointerDiagram: React.FC<{ data: TreeNode }> = ({ data }) => {
  const { label, items } = flattenTree(data);

  return (
    <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center px-6 py-16">
      <h1 className="text-4xl text-gray-800 font-bold mb-16 text-center">
        {label}
      </h1>

      <div className="relative max-w-sm" style={{ perspective: "1000px" }}>
        <div
          className="absolute left-1/2 w-6 h-full"
          style={{
            transform: "translateX(-50%)",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)"
          }}
        >
          <div className="h-full" style={{ background: 'linear-gradient(90deg, #c0c0c0, #909090, #c0c0c0)'}}></div>
          <div className="absolute top-[-5px] left-0 w-full h-[5px]" style={{ background: 'linear-gradient(90deg, #d0d0d0, #a0a0a0, #d0d0d0)', borderRadius: '2px 2px 0 0' }}></div>
          <div className="absolute bottom-[-15px] left-[-4px] w-8 h-[15px]" style={{ background: 'linear-gradient(90deg, #b0b0b0, #808080, #b0b0b0)', borderRadius: '3px' }}></div>
        </div>

        <div className="relative z-10 space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="relative h-20"
              style={{ transform: item.transform }}
            >
              <Pointer
                label={item.label}
                direction={item.direction}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadpointerDiagram;
