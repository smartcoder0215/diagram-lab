import React from "react";

type Theme = {
  main: string;
  shadow: string;
  border: string;
};

const colorThemes: Theme[] = [
  {
    main: "bg-gradient-to-br from-purple-600 to-purple-800",
    shadow: "bg-gradient-to-br from-purple-800 to-purple-900",
    border: "border-purple-300",
  },
  {
    main: "bg-gradient-to-br from-blue-500 to-cyan-600",
    shadow: "bg-gradient-to-br from-blue-700 to-cyan-800",
    border: "border-blue-300",
  },
  {
    main: "bg-gradient-to-br from-pink-500 to-rose-600",
    shadow: "bg-gradient-to-br from-pink-700 to-rose-800",
    border: "border-pink-300",
  },
  {
    main: "bg-gradient-to-br from-yellow-400 to-orange-500",
    shadow: "bg-gradient-to-br from-yellow-600 to-orange-700",
    border: "border-yellow-300",
  },
  {
    main: "bg-gradient-to-br from-green-500 to-lime-600",
    shadow: "bg-gradient-to-br from-green-700 to-lime-800",
    border: "border-green-300",
  },
  {
    main: "bg-gradient-to-br from-red-400 to-amber-500",
    shadow: "bg-gradient-to-br from-red-600 to-amber-700",
    border: "border-red-300",
  },
  {
    main: "bg-gradient-to-br from-indigo-400 to-sky-600",
    shadow: "bg-gradient-to-br from-indigo-700 to-sky-800",
    border: "border-indigo-300",
  },
];

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
  colorTheme: Theme;
}

function flattenTree(data: TreeNode): PointerItem[] {
  if (!data.children) return [];

  const isNested = data.children.some(
    (child) => typeof child !== "string" && "children" in child
  );

  const items: PointerItem[] = [];

  if (isNested) {
    data.children.forEach((group, groupIdx) => {
      if (typeof group === "string") return;

      const color = colorThemes[groupIdx % colorThemes.length];

      if (!group.children) {
        items.push({
          label: group.label,
          direction: groupIdx % 2 === 0 ? "left" : "right",
          colorTheme: color,
        });
        return;
      }

      group.children.forEach((child, childIdx) => {
        const label = typeof child === "string" ? child : child.label;
        items.push({
          label,
          direction: (groupIdx + childIdx) % 2 === 0 ? "left" : "right",
          colorTheme: color,
        });
      });
    });
  } else {
    data.children.forEach((child, idx) => {
      const label = typeof child === "string" ? child : child.label;
      items.push({
        label,
        direction: idx % 2 === 0 ? "left" : "right",
        colorTheme: colorThemes[idx % colorThemes.length],
      });
    });
  }

  return items;
}

export const RoadpointerDiagram: React.FC<{ data: TreeNode }> = ({ data }) => {
  const pointers = flattenTree(data);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl text-white font-bold mb-12 text-center">
        {data.label}
      </h1>

      <div className="relative w-full max-w-6xl">
        <div className="absolute left-1/2 w-2 h-full bg-gradient-to-r from-gray-600 to-gray-800 transform -translate-x-1/2 z-10 rounded-full shadow-lg" />

        {pointers.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "relative flex items-center my-8 z-20 opacity-0 animate-fade-in",
              item.direction === "left"
                ? "justify-end pr-16"
                : "justify-start pl-16"
            )}
            style={{
              animationDelay: `${idx * 0.15}s`,
              animationFillMode: "forwards",
            }}
          >
            <div
              className={cn(
                "pointer-3d",
                item.direction === "left"
                  ? "pointer-3d-left"
                  : "pointer-3d-right"
              )}
            >
              <div
                className={cn(
                  "pointer-shadow absolute",
                  item.colorTheme.shadow
                )}
              />
              <div
                className={cn(
                  "pointer-main relative z-10 text-white text-lg font-bold px-8 py-4 border-2",
                  item.colorTheme.main,
                  item.colorTheme.border
                )}
              >
                {item.label}
              </div>
              <div
                className={cn(
                  "pointer-tip absolute",
                  item.colorTheme.main,
                  item.colorTheme.border
                )}
              />
              <div
                className={cn(
                  "pointer-tip-shadow absolute",
                  item.colorTheme.shadow
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pointer-3d {
          position: relative;
          min-width: 250px;
          height: 60px;
          transform-style: preserve-3d;
        }

        .pointer-main {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        }

        .pointer-shadow {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          top: 6px;
          transform: translateZ(-10px);
        }

        .pointer-3d-left .pointer-shadow {
          left: 6px;
        }

        .pointer-3d-right .pointer-shadow {
          right: 6px;
        }

        .pointer-3d-left .pointer-tip {
          left: -2rem;
          top: 0;
          width: 0;
          height: 0;
          border-top: 30px solid transparent;
          border-bottom: 30px solid transparent;
          border-right: 25px solid;
          border-right-color: inherit;
        }

        .pointer-3d-left .pointer-tip-shadow {
          left: -1.5rem;
          top: 6px;
          width: 0;
          height: 0;
          border-top: 30px solid transparent;
          border-bottom: 30px solid transparent;
          border-right: 25px solid;
          border-right-color: inherit;
          transform: translateZ(-10px);
        }

        .pointer-3d-right .pointer-tip {
          right: -2rem;
          top: 0;
          width: 0;
          height: 0;
          border-top: 30px solid transparent;
          border-bottom: 30px solid transparent;
          border-left: 25px solid;
          border-left-color: inherit;
        }

        .pointer-3d-right .pointer-tip-shadow {
          right: -1.5rem;
          top: 6px;
          width: 0;
          height: 0;
          border-top: 30px solid transparent;
          border-bottom: 30px solid transparent;
          border-left: 25px solid;
          border-left-color: inherit;
          transform: translateZ(-10px);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RoadpointerDiagram;
