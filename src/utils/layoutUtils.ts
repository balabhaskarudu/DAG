import dagre from 'dagre';
import { Node, Edge } from 'reactflow';

const nodeWidth = 172;
const nodeHeight = 60;

export interface LayoutOptions {
  direction: 'TB' | 'LR' | 'BT' | 'RL';
  nodeSpacing: number;
  rankSpacing: number;
  edgeSpacing: number;
}

export const defaultLayoutOptions: LayoutOptions = {
  direction: 'TB',
  nodeSpacing: 50,
  rankSpacing: 100,
  edgeSpacing: 10,
};

export const getLayoutedElements = (
  nodes: Node[], 
  edges: Edge[], 
  options: Partial<LayoutOptions> = {}
) => {
  const layoutOptions = { ...defaultLayoutOptions, ...options };
  const { direction, nodeSpacing, rankSpacing, edgeSpacing } = layoutOptions;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR' || direction === 'RL';
  
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    edgesep: edgeSpacing,
    marginx: 20,
    marginy: 20,
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { 
      width: nodeWidth, 
      height: nodeHeight 
    });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply layout to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // Set handle positions based on layout direction
    let targetPosition: any = 'top';
    let sourcePosition: any = 'bottom';
    
    switch (direction) {
      case 'LR':
        targetPosition = 'left';
        sourcePosition = 'right';
        break;
      case 'RL':
        targetPosition = 'right';
        sourcePosition = 'left';
        break;
      case 'BT':
        targetPosition = 'bottom';
        sourcePosition = 'top';
        break;
      default: // TB
        targetPosition = 'top';
        sourcePosition = 'bottom';
    }

    return {
      ...node,
      targetPosition,
      sourcePosition,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const getLayoutBounds = (nodes: Node[]) => {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  const positions = nodes.map(node => ({
    x: node.position.x,
    y: node.position.y,
  }));

  const minX = Math.min(...positions.map(p => p.x));
  const minY = Math.min(...positions.map(p => p.y));
  const maxX = Math.max(...positions.map(p => p.x + nodeWidth));
  const maxY = Math.max(...positions.map(p => p.y + nodeHeight));

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

export const centerLayout = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0) return { nodes, edges };

  const bounds = getLayoutBounds(nodes);
  const centerX = bounds.width / 2;
  const centerY = bounds.height / 2;

  const centeredNodes = nodes.map(node => ({
    ...node,
    position: {
      x: node.position.x - bounds.minX + 50 - centerX,
      y: node.position.y - bounds.minY + 50 - centerY,
    },
  }));

  return { nodes: centeredNodes, edges };
};

export const validateLayoutDirection = (direction: string): direction is LayoutOptions['direction'] => {
  return ['TB', 'LR', 'BT', 'RL'].includes(direction);
};