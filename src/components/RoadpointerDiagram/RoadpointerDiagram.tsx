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
  const inset = 6;

  const getPoints = (w: number, h: number, tip: number, isInset: boolean) => {
    const i = isInset ? inset : 0;
    const iTip = isInset ? inset * 1.5 : 0;

    if (direction === "right") {
      return `${i},${i} ${w - tip - i},${i} ${w - iTip},${h / 2} ${w - tip - i},${h - i} ${i},${h - i}`;
    }
    return `${w - i},${i} ${tip + i},${i} ${iTip},${h / 2} ${tip + i},${h - i} ${w - i},${h - i}`;
  };
  
  const outerPoints = getPoints(width, height, tipWidth, false);
  const innerPoints = getPoints(width, height, tipWidth, true);
  const textX = direction === 'right' ? width / 2.2 - tipWidth / 2 : width / 1.8 + tipWidth / 2;

  return (
    <svg
      width={width}
      height={height}
      className="drop-shadow-lg"
      style={{
        transform: direction === "left" ? `translateX(-${width-100}px)` : `translateX(${width-100}px)`
      }}
    >
      <defs>
        <linearGradient id="silver" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#e0e0e0' }} />
          <stop offset="50%" style={{ stopColor: '#c0c0c0' }} />
          <stop offset="100%" style={{ stopColor: '#a0a0a0' }} />
        </linearGradient>
      </defs>
      <polygon points={outerPoints} fill="url(#silver)" />
      <polygon points={innerPoints} fill={color} />
      <text
        x={textX}
        y="53%"
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
              className={cn(
                "relative flex items-center h-20",
                item.direction === "left" ? "justify-start" : "justify-end"
              )}
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
