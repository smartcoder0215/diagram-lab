import React, { useState } from "react";

type TreeNode = {
  label: string;
  children?: TreeNode[];
};

type IcebergDiagramProps = {
  data: TreeNode;
};

const IcebergDiagram: React.FC<IcebergDiagramProps> = ({ data }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const visibleElements = data.children?.[0];
  const foundationalElements = data.children?.[1];

  const handleItemHover = (item: string) => setHoveredItem(item);
  const handleItemLeave = () => setHoveredItem(null);

  const IcebergShape = ({
    width = 600,
    height = 750,
  }: {
    width?: number;
    height?: number;
  }) => (
    <svg
      viewBox="0 0 300 375"
      width={width}
      height={height}
      className="mx-auto"
    >
      <rect x="0" y="150" width="300" height="225" fill="#3B82F6" />
      <polygon points="75,150 105,300 150,345 195,300 225,150" fill="#60A5FA" />
      <polygon points="105,300 135,285 150,345" fill="#3B82F6" />
      <polygon points="150,345 165,285 195,300" fill="#60A5FA" />
      <polygon points="90,150 120,90 150,120 180,75 210,150" fill="#DFF3FF" />
      <polygon points="120,90 135,135 150,120" fill="#B9E2F9" />
      <polygon points="150,120 165,135 180,75" fill="#B9E2F9" />
      <line x1="0" y1="150" x2="300" y2="150" stroke="#fff" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-white relative">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {data.label.toUpperCase()}
        </h1>
        <div className="w-32 h-1 bg-gray-700 mx-auto opacity-80"></div>
      </div>

      <div className="relative flex justify-center items-center">
        <div className="relative">
          <IcebergShape width={600} height={750} />

          <div className="absolute left-2 top-16">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border">
              <h3 className="text-lg font-bold text-gray-800">
                Brand Identity
              </h3>
              <p className="text-sm text-gray-600">Visible Elements</p>
            </div>
          </div>

          <div className="absolute left-2 bottom-40">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border">
              <h3 className="text-lg font-bold text-gray-800">
                Brand Strategy
              </h3>
              <p className="text-sm text-gray-600">Foundation Elements</p>
            </div>
          </div>

          {/* Visible Elements */}
          {visibleElements?.children?.map((item, index) => {
            const dotPositions = [
              { left: "47%", top: "15%" },
              { left: "53%", top: "16%" },
              { left: "45%", top: "18%" },
              { left: "55%", top: "19%" },
              { left: "49%", top: "21%" },
              { left: "51%", top: "23%" },
              { left: "50%", top: "25%" },
            ];
            const textPositions = [
              { right: "8%", top: "7%", side: "right" },
              { right: "12%", top: "10%", side: "right" },
              { left: "8%", top: "13%", side: "left" },
              { right: "8%", top: "16%", side: "right" },
              { right: "15%", top: "19%", side: "right" },
              { left: "8%", top: "22%", side: "left" },
              { left: "15%", top: "25%", side: "left" },
            ];
            const dotPos = dotPositions[index];
            const textPos = textPositions[index];

            return (
              <div key={index}>
                <div
                  className={`absolute w-3 h-3 rounded-full transition-all duration-300 cursor-pointer transform hover:scale-150 z-10 ${
                    hoveredItem === item.label
                      ? "bg-blue-700 shadow-lg shadow-blue-300 scale-150"
                      : "bg-blue-500"
                  }`}
                  style={{
                    left: dotPos.left,
                    top: dotPos.top,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => handleItemHover(item.label)}
                  onMouseLeave={handleItemLeave}
                />
                <div
                  className={`absolute h-px transition-all duration-300 z-5 ${
                    hoveredItem === item.label ? "bg-blue-700" : "bg-blue-500"
                  }`}
                  style={{
                    top: dotPos.top,
                    left: textPos.side === "right" ? dotPos.left : textPos.left,
                    right: textPos.side === "right" ? textPos.right : "auto",
                    width:
                      textPos.side === "right"
                        ? `calc(${textPos.right} + 15%)`
                        : `calc(${dotPos.left} - ${textPos.left})`,
                    transform: "translateY(-50%)",
                  }}
                />
                <div
                  className={`absolute transition-all duration-300 cursor-pointer ${
                    hoveredItem === item.label ? "scale-105 z-20" : "z-10"
                  }`}
                  style={textPos}
                  onMouseEnter={() => handleItemHover(item.label)}
                  onMouseLeave={handleItemLeave}
                >
                  <div
                    className={`bg-white backdrop-blur-sm px-3 py-2 rounded shadow-md transition-all duration-300 border ${
                      hoveredItem === item.label
                        ? "shadow-xl border-blue-300"
                        : "border-gray-200"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Foundational Elements */}
          {foundationalElements?.children?.map((item, index) => {
            const dotPositions = [
              { left: "65%", top: "45%" },
              { left: "70%", top: "50%" },
              { left: "40%", top: "55%" },
              { left: "60%", top: "60%" },
              { left: "45%", top: "65%" },
              { left: "35%", top: "70%" },
              { left: "55%", top: "75%" },
              { left: "50%", top: "80%" },
            ];
            const textPositions = [
              { right: "5%", top: "37%", side: "right" },
              { right: "10%", top: "42%", side: "right" },
              { left: "5%", top: "47%", side: "left" },
              { right: "5%", top: "52%", side: "right" },
              { left: "10%", top: "57%", side: "left" },
              { left: "5%", top: "62%", side: "left" },
              { right: "15%", top: "67%", side: "right" },
              { left: "20%", top: "72%", side: "left" },
            ];
            const dotPos = dotPositions[index];
            const textPos = textPositions[index];

            return (
              <div key={index}>
                <div
                  className={`absolute w-3 h-3 rounded-full transition-all duration-300 cursor-pointer transform hover:scale-150 z-10 ${
                    hoveredItem === item.label
                      ? "bg-cyan-300 shadow-lg shadow-cyan-200 scale-150"
                      : "bg-cyan-400"
                  }`}
                  style={{
                    left: dotPos.left,
                    top: dotPos.top,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => handleItemHover(item.label)}
                  onMouseLeave={handleItemLeave}
                />
                <div
                  className={`absolute h-px transition-all duration-300 z-5 ${
                    hoveredItem === item.label ? "bg-cyan-300" : "bg-cyan-400"
                  }`}
                  style={{
                    top: dotPos.top,
                    left: textPos.side === "right" ? dotPos.left : textPos.left,
                    right: textPos.side === "right" ? textPos.right : "auto",
                    width:
                      textPos.side === "right"
                        ? `calc(${textPos.right} + 15%)`
                        : `calc(${dotPos.left} - ${textPos.left})`,
                    transform: "translateY(-50%)",
                  }}
                />
                <div
                  className={`absolute transition-all duration-300 cursor-pointer ${
                    hoveredItem === item.label ? "scale-105 z-20" : "z-10"
                  }`}
                  style={textPos}
                  onMouseEnter={() => handleItemHover(item.label)}
                  onMouseLeave={handleItemLeave}
                >
                  <div
                    className={`bg-white backdrop-blur-sm px-3 py-2 rounded shadow-md transition-all duration-300 border ${
                      hoveredItem === item.label
                        ? "shadow-xl border-cyan-300"
                        : "border-gray-200"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {hoveredItem && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl z-50">
          <div className="text-center">
            <span className="font-semibold">{hoveredItem}</span>
            <div className="text-xs text-gray-300 mt-1">
              {visibleElements?.children?.some(
                (item) => item.label === hoveredItem
              )
                ? "Visible Brand Element"
                : "Foundational Brand Element"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IcebergDiagram;
