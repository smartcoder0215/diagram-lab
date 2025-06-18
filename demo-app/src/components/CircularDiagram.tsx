import React, { useState, useEffect } from 'react'; 
import projectLifecycle from '../data/projectLifeCycleData';

interface TreeNode {
  label: string;
  children?: (TreeNode | string)[];
}

interface CircularFlowProps {
  data: TreeNode;
}

const CircularFlow = ({ data }: CircularFlowProps) => { 
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | string | null>(null); 
  const [rotationOffset, setRotationOffset] = useState(0); 
  
  // Helper functions 
  const getLabel = (node: TreeNode | string): string => { 
    if (typeof node === 'string') return node; 
    return node.label || ''; 
  }; 
  
  const getChildren = (node: TreeNode | string): TreeNode[] => { 
    if (typeof node === 'string') return []; 
    return node.children?.map(child => {
      if (typeof child === 'string') {
        return { label: child, children: [] };
      }
      return child;
    }) || []; 
  }; 
  
  // Colors for different nodes 
  const colors = [ 
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', 
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43' 
  ]; 
 
  // Handle node click and rotation 
  const handleNodeClick = (index: number, branch: TreeNode) => { 
    const branches = getChildren(data); 
    // Calculate rotation needed to bring clicked node to top (90 degrees) 
    const targetAngle = -90; // Top position in degrees 
    const currentAngle = (index * 360) / branches.length; 
    const rotationNeeded = targetAngle - currentAngle; 
     
    setRotationOffset(prev => prev + rotationNeeded); 
    setSelectedNodeIndex(index); 
  }; 
 
  if (!data) { 
    return ( 
      <div className="flex items-center justify-center h-screen text-gray-500"> 
        No data provided for circular flow 
      </div> 
    ); 
  } 
 
  const centerLabel = getLabel(data); 
  const branches = getChildren(data); 
  const radius = 200; 
  const centerX = 300; 
  const centerY = 300; 
 
  // Calculate positions for orbiting circles with rotation 
  const getOrbitPosition = (index: number, total: number, radiusOffset: number = 0) => { 
    const baseAngle = (index * 2 * Math.PI) / total; 
    const rotationRadians = (rotationOffset * Math.PI) / 180; 
    const angle = baseAngle + rotationRadians; 
    const currentRadius = radius + radiusOffset; 
    return { 
      x: centerX + Math.cos(angle) * currentRadius, 
      y: centerY + Math.sin(angle) * currentRadius, 
      angle: angle 
    }; 
  }; 
 
  return ( 
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8"> 
      <div className="max-w-6xl mx-auto"> 
        <div className="text-center mb-8"> 
          <h2 className="text-4xl font-bold text-white mb-4">Circular Flow Diagram</h2> 
          <p className="text-indigo-200">Interactive animated process visualization</p> 
        </div> 
 
        <div className="flex justify-center"> 
          <div className="relative"> 
            <svg width="600" height="600" className="overflow-visible"> 
              <defs> 
                <radialGradient id="centerGradient" cx="50%" cy="50%"> 
                  <stop offset="0%" stopColor="#FF6B6B" stopOpacity="1.0"/>
                  <stop offset="100%" stopColor="#FF6B6B" stopOpacity="1.0"/>
                </radialGradient> 
                {branches.map((_, index) => ( 
                  <radialGradient key={index} id={`nodeGradient${index}`} cx="50%" cy="50%"> 
                    <stop offset="0%" stopColor={colors[index % colors.length]} stopOpacity="1.0"/>
                    <stop offset="100%" stopColor={colors[index % colors.length]} stopOpacity="1.0"/>
                  </radialGradient> 
                ))}
              </defs> 
 
              {/* Orbital path - hidden */}
              {/* <circle 
                cx={centerX} 
                cy={centerY} 
                r={radius} 
                fill="none" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="1" 
                strokeDasharray="3,3" 
              /> */}
 
              {/* Orbiting nodes with connecting lines */}
              {branches.map((branch, index) => { 
                const pos = getOrbitPosition(index, branches.length); 
                const children = getChildren(branch); 
                const nodeRadius = children.length > 0 ? 65 : 50; 
                const isSelected = selectedNodeIndex === index; 
                 
                return ( 
                  <g key={index}> 
                    {/* Connecting line */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={pos.x}
                      y2={pos.y}
                      stroke="rgba(59, 130, 246, 0.8)"
                      strokeWidth="2"
                    />
                    
                    {/* Main orbiting circle */} 
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={nodeRadius} 
                      fill={`url(#nodeGradient${index})`} 
                      className={`drop-shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 ${ 
                        isSelected ? 'stroke-white stroke-4' : '' 
                      }`} 
                      onClick={() => handleNodeClick(index, branch)} 
                    /> 
                    <text 
                      x={pos.x} 
                      y={pos.y - (children.length > 0 ? 10 : 0)} 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      className="fill-white font-semibold text-xs pointer-events-none" 
                    > 
                      {getLabel(branch).length > 15 ? getLabel(branch).substring(0, 15) + '...' : getLabel(branch)} 
                    </text>
                     
                    {/* Show children count if any */} 
                    {children.length > 0 && ( 
                      <text 
                        x={pos.x} 
                        y={pos.y + 15} 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        className="fill-white text-xs opacity-80 pointer-events-none" 
                      > 
                        {children.length} items 
                      </text> 
                    )} 
                  </g> 
                ); 
              })}

              {/* Central node - moved after the lines to render on top */} 
              <circle 
                cx={centerX} 
                cy={centerY} 
                r="80" 
                fill="url(#centerGradient)" 
                className="drop-shadow-lg cursor-pointer hover:scale-105 transition-transform" 
                onClick={() => setSelectedNodeIndex('center')} 
              /> 
              <text 
                x={centerX} 
                y={centerY} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="fill-white font-bold text-sm pointer-events-none" 
                style={{ fontSize: '14px', maxWidth: '140px' }} 
              > 
                {centerLabel.length > 20 ? centerLabel.substring(0, 20) + '...' : centerLabel} 
              </text>
            </svg> 
          </div> 
        </div> 
 
        {/* Selected node details */} 
        {selectedNodeIndex !== null && ( 
          <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white"> 
            {selectedNodeIndex === 'center' ? ( 
              <div> 
                <h3 className="text-xl font-bold mb-4">{centerLabel}</h3> 
                <p className="text-indigo-200">Main project overview with {branches.length} major phases</p> 
              </div> 
            ) : ( 
              <div> 
                <h3 className="text-xl font-bold mb-4"> 
                  {getLabel(branches[selectedNodeIndex])} 
                </h3> 
                {getChildren(branches[selectedNodeIndex]).length > 0 && ( 
                  <div> 
                    <p className="mb-3 text-indigo-200">Sub-items:</p> 
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"> 
                      {getChildren(branches[selectedNodeIndex]).map((child, index) => ( 
                        <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-sm"> 
                          {getLabel(child)} 
                        </div> 
                      ))} 
                    </div> 
                  </div> 
                )} 
              </div> 
            )} 
          </div> 
        )} 
      </div> 
    </div> 
  ); 
}; 
 
// Default export with sample data 
export default function CircularDiagram() { 
  return <CircularFlow data={projectLifecycle} />; 
} 