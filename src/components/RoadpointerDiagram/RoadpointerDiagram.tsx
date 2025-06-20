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
  color,
}: {
  label: string;
  direction: "left" | "right";
  color: string;
}) => {
  const width = 320;
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
            ? { right: 'calc(50% + 7px)' } 
            : { left: 'calc(50% + 7px)' }),
      }}
    >
      <defs>
        <linearGradient id="inner-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.2"/>
            <stop offset="10%" stopColor="#000" stopOpacity="0.05"/>
            <stop offset="90%" stopColor="#fff" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/* Main body with beveled edges */}
      <polygon points={points.topBevel} fill="#f5f5f5" />
      <polygon points={points.bottomBevel} fill="#a0a0a0" />
      <polygon points={points.tipBevel} fill="#e0e0e0" />
      <polygon points={points.tipBevelBottom} fill="#b0b0b0" />

      {/* Inner colored panel */}
      <polygon points={points.inner} fill={color} />
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
  label:string;
  direction: "left" | "right";
  color: string;
}

// This function converts the hierarchical data into a flat list for rendering
function flattenTree(data: TreeNode): {label:string, items: PointerItem[]} {
    const items: PointerItem[] = [];
    if(!data.children) return {label: data.label, items:[]};

    let itemIdx = 0;
    data.children.forEach((group, groupIdx) => {
        if (typeof group === 'string' || !group.children) return;

        const color = colorThemes[groupIdx % colorThemes.length];

        group.children.forEach((child) => {
            const label = typeof child === 'string' ? child : child.label;
            items.push({
                label,
                direction: itemIdx % 2 === 0 ? 'left' : 'right',
                color,
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

      <div className="relative max-w-sm">
        <div
          className="absolute left-1/2 w-4 h-full bg-gray-600 shadow-xl"
          style={{
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg, #6b7280, #4b5563, #6b7280)",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)"
          }}
        />

        <div className="relative z-10 space-y-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="relative h-20"
            >
              <Pointer
                label={item.label}
                direction={item.direction}
                color={item.color}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadpointerDiagram;
