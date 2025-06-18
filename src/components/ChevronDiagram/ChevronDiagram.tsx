import React from "react";

type NodeData =
  | {
      label: string;
      children?: (NodeData | string)[];
    }
  | string;

interface DiagramDataProps {
  data?: NodeData & { children?: (NodeData | string)[] };
}

const CheveronDiagram: React.FC<DiagramDataProps> = ({ data }) => {
  const getLabel = (node: NodeData): string => {
    if (typeof node === "string") return node;
    return node.label || "";
  };

  const getChildren = (node: NodeData): (NodeData | string)[] => {
    if (typeof node === "string") return [];
    return node.children || [];
  };

  const colors = [
    "bg-orange-400",
    "bg-green-400",
    "bg-blue-500",
    "bg-sky-400",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-lime-500",
  ];

  const getChevronStyle = (
    index: number,
    total: number,
    hasChildren: number,
    arrowHeadWidth: number = 28
  ): React.CSSProperties => {
    return {
      minHeight: hasChildren ? `${hasChildren * 60 + 40}px` : "80px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "14px",
      textAlign: "center",
      padding: "10px",
      position: "relative",
      marginRight: index < total - 1 ? `-${arrowHeadWidth - 6}px` : "0",
      clipPath: `polygon(
            0px 0%,
            calc(100% - ${arrowHeadWidth}px) 0%,
            100% 50%,
            calc(100% - ${arrowHeadWidth}px) 100%,
            0px 100%,
            ${arrowHeadWidth}px 50%
        )`,
    };
  };

  const renderMainChevrons = () => {
    if (!data || !data.children) return null;

    const mainItems = data.children;

    return (
      <>
        <div className="mb-8 text-3xl font-bold text-gray-800 mb-2">
          {getLabel(data)}
        </div>
        <div className="flex items-stretch mb-8">
          {mainItems.map((item, index) => {
            const children = getChildren(item);
            return (
              <div
                key={index}
                className={`${colors[index % colors.length]} flex-1 min-w-0`}
                style={getChevronStyle(
                  index + 1,
                  mainItems.length + 1,
                  children.length
                )}
              >
                <div className="px-4">
                  <div className="text-lg font-semibold mb-2">
                    {getLabel(item)}
                  </div>
                  {children.length > 0 && (
                    <div className="space-y-1">
                      {children.slice(0, 4).map((child, childIndex) => (
                        <div
                          key={childIndex}
                          className="text-sm opacity-90 bg-black bg-opacity-20 rounded px-2 py-1"
                        >
                          {getLabel(child)}
                        </div>
                      ))}
                      {children.length > 4 && (
                        <div className="text-sm opacity-75">
                          +{children.length - 4} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">{renderMainChevrons()}</div>
  );
};

export default CheveronDiagram;
