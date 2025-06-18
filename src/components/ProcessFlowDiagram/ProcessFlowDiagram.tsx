import React from "react";

import { getLabel, getChildren } from "../models/treenodes";

export type Node =
  | {
      label: string;
      children?: Node[];
    }
  | string;

interface DiagramDataProps {
  data: Node;
}

const ProcessFlowDiagram: React.FC<DiagramDataProps> = ({ data }) => {
  // Color scheme for the phases (matching the reference image)
  const phaseColors = [
    "bg-emerald-400", // Phase 1 - Green
    "bg-blue-500", // Phase 2 - Blue
    "bg-red-500", // Phase 3 - Red/Orange
    "bg-amber-400", // Phase 4 - Yellow
    "bg-purple-500", // Phase 5 - Purple (additional color)
  ];

  const childColors = [
    "bg-emerald-100", // Phase 1 children - Light green
    "bg-blue-100", // Phase 2 children - Light blue
    "bg-red-100", // Phase 3 children - Light red
    "bg-amber-100", // Phase 4 children - Light yellow
    "bg-purple-100", // Phase 5 children - Light purple
  ];

  const phases = data && typeof data === "object" ? data.children : undefined;

  return (
    <div className="w-full p-6 bg-white">
      {/* Main title */}
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        {getLabel(data)}
      </h2>

      <div className="overflow-x-auto">
        {/* Unified Phase & Activities Row */}
        <div className="flex items-start justify-center gap-0 min-w-max">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{
                width: "220px",
                marginLeft: index === 0 ? "0" : "-10px",
                marginRight: index === phases.length - 1 ? "0" : "-10px",
              }}
            >
              {/* Phase Header */}
              <div
                className={`${
                  phaseColors[index % phaseColors.length]
                } text-white py-4 text-lg font-semibold relative`}
                style={{
                  clipPath:
                    index === phases.length - 1
                      ? "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)"
                      : "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <div className="relative z-10">
                  <div className="font-bold">Phase {index + 1}</div>
                  <div className="text-sm mt-1">{getLabel(phase)}</div>
                </div>
              </div>
              {/* Substeps */}
              <div className="mt-4 w-full flex flex-col items-center">
                {!!phase.children &&
                  getChildren(phase).map((child, childIndex) => (
                    <div
                      key={childIndex}
                      className={`${
                        childColors[index % childColors.length]
                      } p-3 mb-3 rounded-lg shadow-sm text-sm text-gray-700 text-center border border-gray-200`}
                      style={{ width: "calc(100% - 40px)", maxWidth: "180px" }}
                    >
                      {getLabel(child)}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowDiagram;
