import React from "react";
import {
  ChevronDiagram,
  ProcessFlowDiagram,
  IcebergDiagram,
  RoadpointerDiagram,
  PorterForceDiagram,
  CircularDiagram,
  BrickWallDiagram,
  PuzzleWall,
} from "./index";
import projectLifecyle from "./data/projectLifeCycleData";
import binaryTreeTwoLevel from "./data/binaryTreeTwoLevel";
import flatTreeOneLevel from "./data/flatTree";
import imbalancedTreeThreeLevel from "./data/imbalancedTree";
import portersFiveForces from "./data/portersFiveForces";
import { brickWallData, flatBrickWallData } from "./data/brickWallData";
import { puzzleWallData } from "./data/puzzleWallData";

export default function App() {
  const handlePuzzlePieceClick = (index: number, item: string) => {
    console.log(`Clicked puzzle piece ${index}: ${item}`);
  };

  return (
    <>
      <div>
        <CircularDiagram />
      </div>
      <div>
        <ChevronDiagram data={projectLifecyle} />
      </div>
      <div>
        <IcebergDiagram data={binaryTreeTwoLevel} />
      </div>
      <div>
        <PorterForceDiagram data={portersFiveForces} />
      </div>
      <div>
        <RoadpointerDiagram data={projectLifecyle} />
      </div>
      <div className="min-h-screen bg-gray-50 py-8">
        <ProcessFlowDiagram data={projectLifecyle} />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8">
        <BrickWallDiagram 
          data={brickWallData} 
          title="Hierarchical: Project Tasks as Brick Wall"
        />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8">
        <BrickWallDiagram 
          data={flatBrickWallData} 
          title="Flat: Task List as Brick Wall"
        />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-orange-800">Interactive Puzzle Wall</h2>
          <p className="text-gray-600 mt-2">Click on puzzle pieces to interact with them</p>
        </div>
        <PuzzleWall 
          items={puzzleWallData} 
          columns={4} 
          width={800} 
          height={500} 
          onPieceClick={handlePuzzlePieceClick}
        />
      </div>
    </>
  );
}
