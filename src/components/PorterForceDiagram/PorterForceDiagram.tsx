import React from 'react';

interface TreeNode {
  label: string;
  children?: (TreeNode | string)[];
}

interface PorterForceDiagramProps {
  data: TreeNode;
}

const PorterForceDiagram: React.FC<PorterForceDiagramProps> = ({ data }) => {
  if (!data || !data.children) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data provided for Porter's 5 Forces diagram
      </div>
    );
  }

  const forces = data.children;
  const centerX = 300;
  const centerY = 300;
  const radius = 150;

  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FECA57', // Yellow
  ];

  const getPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2; // Start from top
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle: angle
    };
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Porter's 5 Forces Analysis</h2>
          <p className="text-blue-200">Strategic framework for industry analysis</p>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <svg width="600" height="600" className="overflow-visible">
              {/* Central area */}
              <circle
                cx={centerX}
                cy={centerY}
                r="80"
                fill="rgba(255,255,255,0.1)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              
              {/* Center text */}
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white font-bold text-lg"
              >
                Industry
              </text>

              {/* Force nodes */}
              {forces.map((force, index) => {
                const pos = getPosition(index, forces.length);
                const forceData = typeof force === 'string' ? { label: force, children: [] } : force;
                
                return (
                  <g key={index}>
                    {/* Connecting line */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={pos.x}
                      y2={pos.y}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                    
                    {/* Force circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="60"
                      fill={colors[index % colors.length]}
                      className="drop-shadow-lg"
                    />
                    
                    {/* Force label */}
                    <text
                      x={pos.x}
                      y={pos.y - 5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white font-semibold text-sm"
                    >
                      {forceData.label}
                    </text>
                    
                    {/* Children count */}
                    {forceData.children && forceData.children.length > 0 && (
                      <text
                        x={pos.x}
                        y={pos.y + 15}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-xs opacity-80"
                      >
                        {forceData.children.length} factors
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forces.map((force, index) => {
            const forceData = typeof force === 'string' ? { label: force, children: [] } : force;
            
            return (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-white">
                <h3 className="font-bold mb-2" style={{ color: colors[index % colors.length] }}>
                  {forceData.label}
                </h3>
                {forceData.children && forceData.children.length > 0 && (
                  <div className="space-y-1">
                    {forceData.children.map((child, childIndex) => (
                      <div key={childIndex} className="text-sm text-blue-200">
                        • {typeof child === 'string' ? child : child.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PorterForceDiagram;
