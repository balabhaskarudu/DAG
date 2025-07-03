import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { Node, Edge } from 'reactflow';

describe('useUndoRedo Hook', () => {
  const initialNodes: Node[] = [
    { id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  ];

  const initialEdges: Edge[] = [];

  test('initializes with correct state', () => {
    const setNodes = jest.fn();
    const setEdges = jest.fn();

    const { result } = renderHook(() =>
      useUndoRedo(initialNodes, initialEdges, setNodes, setEdges)
    );

    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  test('enables undo after taking snapshot', () => {
    const setNodes = jest.fn();
    const setEdges = jest.fn();

    const { result } = renderHook(() =>
      useUndoRedo(initialNodes, initialEdges, setNodes, setEdges)
    );

    act(() => {
      result.current.takeSnapshot(initialNodes, initialEdges);
    });

    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  test('performs undo operation', () => {
    const setNodes = jest.fn();
    const setEdges = jest.fn();

    const { result } = renderHook(() =>
      useUndoRedo(initialNodes, initialEdges, setNodes, setEdges)
    );

    // Take a snapshot
    act(() => {
      result.current.takeSnapshot(initialNodes, initialEdges);
    });

    // Perform undo
    act(() => {
      result.current.undo();
    });

    expect(setNodes).toHaveBeenCalledWith(initialNodes);
    expect(setEdges).toHaveBeenCalledWith(initialEdges);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  test('performs redo operation', () => {
    const setNodes = jest.fn();
    const setEdges = jest.fn();

    const { result } = renderHook(() =>
      useUndoRedo(initialNodes, initialEdges, setNodes, setEdges)
    );

    // Take snapshot and undo to enable redo
    act(() => {
      result.current.takeSnapshot(initialNodes, initialEdges);
    });

    act(() => {
      result.current.undo();
    });

    // Clear the mock calls from undo
    setNodes.mockClear();
    setEdges.mockClear();

    // Perform redo
    act(() => {
      result.current.redo();
    });

    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  test('clears redo history when taking new snapshot', () => {
    const setNodes = jest.fn();
    const setEdges = jest.fn();

    const { result } = renderHook(() =>
      useUndoRedo(initialNodes, initialEdges, setNodes, setEdges)
    );

    // Take snapshot, undo, then take another snapshot
    act(() => {
      result.current.takeSnapshot(initialNodes, initialEdges);
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.takeSnapshot(initialNodes, initialEdges);
    });

    expect(result.current.canRedo).toBe(false);
  });
});