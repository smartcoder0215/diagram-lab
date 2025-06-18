export type NodeData =
  | {
      label: string;
      children?: (NodeData | string)[];
    }
  | string;

export interface DiagramDataProps {
  data: NodeData;
}

export const getLabel = (node: NodeData): string => {
  return typeof node === "string" ? node : node.label || "";
};

export const getChildren = (node: NodeData): (NodeData | string)[] => {
  return typeof node === "string" ? [] : node.children || [];
};
