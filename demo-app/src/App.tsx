import React from "react";
import "../../src/output.css";
import {
  ChevronDiagram,
  ProcessFlowDiagram,
  IcebergDiagram,
  RoadpointerDiagram,
  PorterForceDiagram,
} from "../../src";
import projectLifecyle from "./data/projectLifeCycleData";
import binaryTreeTwoLevel from "./data/binaryTreeTwoLevel";
import flatTreeOneLevel from "./data/flatTree";
import imbalancedTreeThreeLevel from "./data/imbalancedTree";
import portersFiveForces from "./data/portersFiveForces";
import CircularDiagram from "./components/CircularDiagram";

export default function App() {
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
    </>
  );
}
