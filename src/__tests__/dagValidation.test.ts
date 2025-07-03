import { validateConnection, detectCycles, validateDAG } from '../utils/dagValidation';
import { Node, Edge } from 'reactflow';

describe('DAG Validation', () => {
  const mockNodes: Node[] = [
    { id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: '2', type: 'default', position: { x: 100, y: 0 }, data: { label: 'Node 2' } },
    { id: '3', type: 'default', position: { x: 200, y: 0 }, data: { label: 'Node 3' } },
  ];

  describe('validateConnection', () => {
    test('prevents self-loops', () => {
      const edges: Edge[] = [];
      const result = validateConnection('1', '1', edges);
      expect(result).toBe(false);
    });

    test('prevents duplicate connections', () => {
      const edges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
      ];
      const result = validateConnection('1', '2', edges);
      expect(result).toBe(false);
    });

    test('allows valid connections', () => {
      const edges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
      ];
      const result = validateConnection('2', '3', edges);
      expect(result).toBe(true);
    });
  });

  describe('detectCycles', () => {
    test('detects no cycles in empty graph', () => {
      const result = detectCycles([], []);
      expect(result).toBe(false);
    });

    test('detects no cycles in linear graph', () => {
      const edges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
      ];
      const result = detectCycles(mockNodes, edges);
      expect(result).toBe(false);
    });

    test('detects cycles in graph', () => {
      const edges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-1', source: '3', target: '1' },
      ];
      const result = detectCycles(mockNodes, edges);
      expect(result).toBe(true);
    });

    test('detects self-loop as cycle', () => {
      const edges: Edge[] = [
        { id: 'e1-1', source: '1', target: '1' },
      ];
      const result = detectCycles(mockNodes, edges);
      expect(result).toBe(true);
    });
  });

  describe('validateDAG', () => {
    test('validates empty graph with warning', () => {
      const result = validateDAG([], []);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Graph is empty');
    });

    test('validates graph with isolated nodes', () => {
      const isolatedNodes: Node[] = [
        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Isolated' } },
      ];
      const result = validateDAG(isolatedNodes, []);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Isolated node'))).toBe(true);
    });

    test('validates graph with cycles', () => {
      const edges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-1', source: '2', target: '1' },
      ];
      const result = validateDAG(mockNodes.slice(0, 2), edges);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Cycle detected'))).toBe(true);
    });

    test('validates valid DAG', () => {
      const edges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e1-3', source: '1', target: '3' },
      ];
      const result = validateDAG(mockNodes, edges);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('warns about source-only and sink-only nodes', () => {
      const edges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
      ];
      const result = validateDAG(mockNodes, edges);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(warning => warning.includes('Potential flow issues'))).toBe(true);
    });
  });
});