import React, { useState } from 'react';

// TypeScript interfaces
interface TreeNode {
  nodeid: number;
  label: string;
  children: TreeNode[] | string[];
}

interface BrickGroup {
  groupLabel: string;
  color: string;
  items: string[];
}

interface BrickItem {
  item: string;
  color: string;
  groupLabel: string;
  brickColorIndex: number;
}

interface BrickWallData {
  nodeid: number;
  label: string;
  children: TreeNode[] | string[];
}

interface BrickWallDiagramProps {
  data: BrickWallData;
  title?: string;
}

// Image detection utility
const isImageUrl = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  try {
    const url = new URL(str);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.ico'];
    return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
};

const BrickWallDiagram: React.FC<BrickWallDiagramProps> = ({ data, title = "Brick Wall Diagram" }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const colors = [
    'bg-red-300', 'bg-blue-300', 'bg-green-300',
    'bg-yellow-300', 'bg-pink-300', 'bg-purple-300',
    'bg-indigo-300', 'bg-teal-300', 'bg-orange-300'
  ];

  // Realistic brick colors - various red tones
  const brickColors = [
    '#B85450', // Dark red-brown
    '#C4625C', // Medium red-brown
    '#A0453F', // Darker red
    '#D17068', // Lighter red-brown
    '#9A4A44', // Deep red-brown
    '#B86B60', // Warm red-brown
    '#CC7A6F', // Light red-brown
    '#964742', // Very dark red
    '#C86A5E', // Bright red-brown
    '#A85651'  // Rich red-brown
  ];

  // Extract leaf items by parent branch - handles both hierarchical and flat structures
  const extractLeafBricks = (nodes: TreeNode[] | string[], depth = 0): BrickGroup[] => {
    const bricks: BrickGroup[] = [];
    
    // Check if this is a flat array of strings
    const isFlat = Array.isArray(nodes) && nodes.every(item => typeof item === 'string');
    
    if (isFlat) {
      // Flat structure - use realistic brick colors
      bricks.push({
        groupLabel: '',
        color: 'realistic', // Special marker for realistic colors
        items: nodes as string[]
      });
    } else {
      // Hierarchical structure
      (nodes as TreeNode[]).forEach((node, idx) => {
        const branchColor = colors[(depth + idx) % colors.length];
        const children = node.children;
        if (Array.isArray(children)) {
          if (typeof children[0] === 'string') {
            // These are the leaf bricks
            bricks.push({
              groupLabel: node.label,
              color: branchColor,
              items: children as string[]
            });
          } else {
            // Go deeper
            bricks.push(...extractLeafBricks(children as TreeNode[], depth + 1));
          }
        }
      });
    }
    
    return bricks;
  };

  const bricks = extractLeafBricks(data.children || []);

  // Flatten all bricks into a single array for proper brick wall layout
  const allBricks: BrickItem[] = [];
  bricks.forEach(group => {
    group.items.forEach((item, index) => {
      allBricks.push({
        item,
        color: group.color,
        groupLabel: group.groupLabel,
        brickColorIndex: index % brickColors.length // For realistic colors
      });
    });
  });

  // Calculate rows and brick positioning
  const bricksPerRow = 4;
  const containerWidth = 1000; // Fixed container width
  const brickHeight = 100;
  const brickWidth = containerWidth / bricksPerRow; // Dynamic width based on container
  const offsetAmount = brickWidth / 2;
  const rows = Math.ceil(allBricks.length / bricksPerRow);

  const isFlat = bricks.length === 1 && bricks[0].color === 'realistic';

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-gradient-to-br from-amber-50 to-orange-100 border-4 border-amber-800 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-bold text-center mb-12 text-amber-900 drop-shadow-lg">{title}</h2>
      
      <div className="relative mx-auto" style={{ width: `${containerWidth}px` }}>
        {Array.from({ length: rows }, (_, rowIndex) => {
          const isEvenRow = rowIndex % 2 === 0;
          const rowBricks = allBricks.slice(rowIndex * bricksPerRow, (rowIndex + 1) * bricksPerRow);
          const offsetForThisRow = isEvenRow ? 0 : offsetAmount;
          
          return (
            <div
              key={rowIndex}
              className="relative"
              style={{
                height: `${brickHeight}px`,
                marginTop: rowIndex === 0 ? '0px' : '2px'
              }}
            >
              {rowBricks.map((brick, brickIndex) => {
                const globalIndex = rowIndex * bricksPerRow + brickIndex;
                const key = `brick-${globalIndex}`;
                const isImage = isImageUrl(brick.item);
                const hasError = imageErrors[key];
                
                // For realistic bricks, vary the color based on position
                const realisticColorIndex = (globalIndex + rowIndex) % brickColors.length;
                const brickStyle = isFlat ? {
                  backgroundColor: brickColors[realisticColorIndex]
                } : {};
                
                return (
                  <div
                    key={key}
                    className={`absolute ${isFlat ? '' : brick.color} border-2 shadow-lg`}
                    style={{
                      left: `${Math.max(0, brickIndex * brickWidth + offsetForThisRow)}px`,
                      width: `${brickWidth}px`,
                      height: `${brickHeight}px`,
                      borderColor: isFlat ? '#E5E5E5' : '#92400e', // Light gray for realistic, amber for hierarchical
                      ...brickStyle
                    }}
                  >
                    <div className="w-full h-full p-4 flex items-center justify-center">
                      {isImage && !hasError ? (
                        <img
                          src={brick.item}
                          alt="Brick"
                          className="w-full h-full object-cover shadow-md"
                          onError={() => setImageErrors(prev => ({ ...prev, [key]: true }))}
                        />
                      ) : (
                        <div className="text-center">
                          {brick.groupLabel && (
                            <div className={`font-bold text-xs mb-1 opacity-60 ${isFlat ? 'text-white' : 'text-amber-900'}`}>
                              {brick.groupLabel}
                            </div>
                          )}
                          <div className={`font-semibold text-sm leading-tight ${isFlat ? 'text-white drop-shadow-md' : 'text-amber-900'}`}>
                            {isImage && hasError ? `Failed to load: ${brick.item}` : brick.item}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Demo component with sample data
const App = () => {
  const simpleDemoData = {
    "nodeid": 1,
    "label": "Simple Kanban",
    "children": [
      {
        "nodeid": 2,
        "label": "To Do",
        "children": [
          "Plan project timeline",
          "Gather requirements",
          "Set up development environment"
        ]
      },
      {
        "nodeid": 3,
        "label": "In Progress",
        "children": [
          "Implement user authentication",
          "Design database schema"
        ]
      },
      {
        "nodeid": 4,
        "label": "Review",
        "children": [
          "Code review for API endpoints"
        ]
      },
      {
        "nodeid": 5,
        "label": "Done",
        "children": [
          "Project setup",
          "Initial mockups",
          "Team onboarding",
          "Technology stack selection"
        ]
      }
    ]
  };

  const flatDemoData = {
    nodeid: 1,
    label: "Simple Kanban",
    children: [
      "Plan project timeline",
      "Gather requirements",
      "Set up development environment",
      "Implement user authentication",
      "Design database schema",
      "Code review for API endpoints",
      "Project setup",
      "Initial mockups",
      "Team onboarding",
      "Technology stack selection"
    ]
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8 space-y-12">
      <BrickWallDiagram 
        data={simpleDemoData} 
        title="Hierarchical: Kanban Board as Brick Wall"
      />
      
      <BrickWallDiagram 
        data={flatDemoData} 
        title="Flat: Task List as Brick Wall"
      />
    </div>
  );
};

export default App;