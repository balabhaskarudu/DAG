import { Node, Edge } from 'reactflow';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateConnection = (
  source: string,
  target: string,
  edges: Edge[]
): boolean => {
  // Prevent self-loops
  if (source === target) {
    return false;
  }

  // Prevent duplicate connections
  const existingConnection = edges.find(
    (edge) => edge.source === source && edge.target === target
  );
  if (existingConnection) {
    return false;
  }

  return true;
};

export const detectCycles = (nodes: Node[], edges: Edge[]): boolean => {
  if (nodes.length === 0 || edges.length === 0) return false;

  const graph = new Map<string, string[]>();
  
  // Build adjacency list
  nodes.forEach(node => graph.set(node.id, []));
  edges.forEach(edge => {
    const neighbors = graph.get(edge.source) || [];
    neighbors.push(edge.target);
    graph.set(edge.source, neighbors);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycleDFS = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) {
      return true;
    }
    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycleDFS(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      if (hasCycleDFS(nodeId)) {
        return true;
      }
    }
  }

  return false;
};

export const findCyclePath = (nodes: Node[], edges: Edge[]): string[] => {
  if (nodes.length === 0 || edges.length === 0) return [];

  const graph = new Map<string, string[]>();
  const parent = new Map<string, string | null>();
  
  // Build adjacency list
  nodes.forEach(node => {
    graph.set(node.id, []);
    parent.set(node.id, null);
  });
  
  edges.forEach(edge => {
    const neighbors = graph.get(edge.source) || [];
    neighbors.push(edge.target);
    graph.set(edge.source, neighbors);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  let cycleStart = '';
  let cycleEnd = '';

  const hasCycleDFS = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) {
      cycleStart = nodeId;
      return true;
    }
    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      parent.set(neighbor, nodeId);
      if (hasCycleDFS(neighbor)) {
        if (cycleEnd === '') {
          cycleEnd = nodeId;
        }
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      if (hasCycleDFS(nodeId)) {
        // Reconstruct cycle path
        const cyclePath: string[] = [];
        let current = cycleEnd;
        
        while (current !== cycleStart && current !== null) {
          cyclePath.push(current);
          current = parent.get(current) || null;
        }
        
        if (current === cycleStart) {
          cyclePath.push(cycleStart);
          return cyclePath.reverse();
        }
        break;
      }
    }
  }

  return [];
};

export const getIsolatedNodes = (nodes: Node[], edges: Edge[]): string[] => {
  const connectedNodes = new Set<string>();
  
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  return nodes
    .filter(node => !connectedNodes.has(node.id))
    .map(node => node.id);
};

export const getNodeConnections = (nodeId: string, edges: Edge[]): {
  incoming: number;
  outgoing: number;
} => {
  const incoming = edges.filter(edge => edge.target === nodeId).length;
  const outgoing = edges.filter(edge => edge.source === nodeId).length;
  
  return { incoming, outgoing };
};

export const validateDAG = (nodes: Node[], edges: Edge[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for empty graph
  if (nodes.length === 0) {
    warnings.push('Graph is empty');
    return { isValid: true, errors, warnings };
  }

  // Check for cycles
  const hasCycles = detectCycles(nodes, edges);
  if (hasCycles) {
    const cyclePath = findCyclePath(nodes, edges);
    if (cyclePath.length > 0) {
      const nodeLabels = cyclePath.map(nodeId => {
        const node = nodes.find(n => n.id === nodeId);
        return node?.data?.label || nodeId;
      });
      errors.push(`Cycle detected: ${nodeLabels.join(' → ')}`);
    } else {
      errors.push('Cycle detected in graph');
    }
  }

  // Check for isolated nodes (nodes with no connections)
  const isolatedNodes = getIsolatedNodes(nodes, edges);
  if (isolatedNodes.length > 0) {
    const isolatedLabels = isolatedNodes.map(nodeId => {
      const node = nodes.find(n => n.id === nodeId);
      return node?.data?.label || nodeId;
    });
    
    if (isolatedNodes.length === 1) {
      errors.push(`Isolated node: ${isolatedLabels[0]} (must have at least 1 connection)`);
    } else {
      errors.push(`Isolated nodes: ${isolatedLabels.join(', ')} (must have at least 1 connection each)`);
    }
  }

  // Check for nodes with only incoming or only outgoing connections (warnings)
  const nodeConnectionIssues: string[] = [];
  nodes.forEach(node => {
    const connections = getNodeConnections(node.id, edges);
    const label = node.data?.label || node.id;
    
    if (connections.incoming === 0 && connections.outgoing > 0) {
      nodeConnectionIssues.push(`${label} (source only)`);
    } else if (connections.outgoing === 0 && connections.incoming > 0) {
      nodeConnectionIssues.push(`${label} (sink only)`);
    }
  });

  if (nodeConnectionIssues.length > 0) {
    warnings.push(`Potential flow issues: ${nodeConnectionIssues.join(', ')}`);
  }

  // Check for duplicate edges (shouldn't happen with validation, but good to check)
  const edgeSet = new Set<string>();
  const duplicateEdges: string[] = [];
  
  edges.forEach(edge => {
    const edgeKey = `${edge.source}->${edge.target}`;
    if (edgeSet.has(edgeKey)) {
      duplicateEdges.push(edgeKey);
    } else {
      edgeSet.add(edgeKey);
    }
  });

  if (duplicateEdges.length > 0) {
    errors.push(`Duplicate connections: ${duplicateEdges.join(', ')}`);
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
  };
};

export const getGraphStats = (nodes: Node[], edges: Edge[]) => {
  const stats = {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    isolatedNodes: getIsolatedNodes(nodes, edges).length,
    hasCycles: detectCycles(nodes, edges),
  };

  return stats;
};