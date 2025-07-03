import { getLayoutedElements, centerLayout } from '../utils/layoutUtils';
import { Node, Edge } from 'reactflow';

describe('Layout Utils', () => {
  const mockNodes: Node[] = [
    { id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: '2', type: 'default', position: { x: 100, y: 100 }, data: { label: 'Node 2' } },
  ];

  const mockEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
  ];

  describe('getLayoutedElements', () => {
    test('applies vertical layout (TB)', () => {
      const result = getLayoutedElements(mockNodes, mockEdges, { direction: 'TB' });
      
      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
      
      // Check that positions have been updated
      expect(result.nodes[0].position).not.toEqual(mockNodes[0].position);
      expect(result.nodes[1].position).not.toEqual(mockNodes[1].position);
    });

    test('applies horizontal layout (LR)', () => {
      const result = getLayoutedElements(mockNodes, mockEdges, { direction: 'LR' });
      
      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
      
      // Check that handle positions are set for horizontal layout
      expect(result.nodes[0].targetPosition).toBe('left');
      expect(result.nodes[0].sourcePosition).toBe('right');
    });

    test('handles empty graph', () => {
      const result = getLayoutedElements([], [], { direction: 'TB' });
      
      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
    });
  });

  describe('centerLayout', () => {
    test('centers nodes around origin', () => {
      const nodes: Node[] = [
        { id: '1', type: 'default', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
        { id: '2', type: 'default', position: { x: 200, y: 200 }, data: { label: 'Node 2' } },
      ];

      const result = centerLayout(nodes, mockEdges);
      
      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
      
      // Positions should be adjusted to center the layout
      expect(result.nodes[0].position.x).toBeLessThan(nodes[0].position.x);
      expect(result.nodes[0].position.y).toBeLessThan(nodes[0].position.y);
    });

    test('handles empty graph', () => {
      const result = centerLayout([], []);
      
      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
    });
  });
});