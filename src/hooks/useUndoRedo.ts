import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface GraphState {
  nodes: Node[];
  edges: Edge[];
}

interface UseUndoRedoReturn {
  undo: () => void;
  redo: () => void;
  takeSnapshot: (nodes: Node[], edges: Edge[]) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useUndoRedo = (
  initialNodes: Node[],
  initialEdges: Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void
): UseUndoRedoReturn => {
  const [past, setPast] = useState<GraphState[]>([]);
  const [future, setFuture] = useState<GraphState[]>([]);

  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    setPast((prev) => [...prev, { nodes, edges }]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture((prev) => [...prev, { nodes: [], edges: [] }]);
    setPast(newPast);
    setNodes(previous.nodes);
    setEdges(previous.edges);
  }, [past, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[future.length - 1];
    const newFuture = future.slice(0, future.length - 1);

    setPast((prev) => [...prev, { nodes: [], edges: [] }]);
    setFuture(newFuture);
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [future, setNodes, setEdges]);

  return {
    undo,
    redo,
    takeSnapshot,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
};