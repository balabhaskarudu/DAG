import React, { useCallback, useState, useRef, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  Panel,
  NodeTypes,
  OnConnect,
  OnNodesDelete,
  OnEdgesDelete,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import { Trash2 } from 'lucide-react';

import { NodeToolbar } from './components/NodeToolbar';
import { ContextMenu } from './components/ContextMenu';
import { EditableNode } from './components/EditableNode';
import { ValidationBanner } from './components/ValidationBanner';
import { SidePanel } from './components/SidePanel';
import { useUndoRedo } from './hooks/useUndoRedo';
import { validateConnection, detectCycles, validateDAG } from './utils/dagValidation';
import { getLayoutedElements, centerLayout } from './utils/layoutUtils';

import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'editableNode',
    position: { x: 250, y: 25 },
    data: { label: 'Start Node' },
  },
  {
    id: '2',
    type: 'editableNode',
    position: { x: 100, y: 125 },
    data: { label: 'Process A' },
  },
  {
    id: '3',
    type: 'editableNode',
    position: { x: 400, y: 125 },
    data: { label: 'Process B' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    style: { stroke: '#6B7280', strokeWidth: 2 },
    animated: true,
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    style: { stroke: '#6B7280', strokeWidth: 2 },
    animated: true,
  },
];

const nodeTypes: NodeTypes = {
  editableNode: EditableNode,
};

function DAGEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(4);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId?: string;
    edgeId?: string;
    type: 'node' | 'edge';
  } | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();

  const { undo, redo, takeSnapshot, canUndo, canRedo } = useUndoRedo(
    initialNodes,
    initialEdges,
    setNodes,
    setEdges
  );

  // Real-time validation
  const validation = useMemo(() => {
    return validateDAG(nodes, edges);
  }, [nodes, edges]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      if (!validateConnection(params.source!, params.target!, edges)) {
        return;
      }

      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        style: { stroke: '#6B7280', strokeWidth: 2 },
        animated: true,
      };

      // Check for cycles before adding the edge
      const tempEdges = [...edges, newEdge];
      if (detectCycles(nodes, tempEdges)) {
        // Show a more user-friendly error
        const sourceNode = nodes.find(n => n.id === params.source);
        const targetNode = nodes.find(n => n.id === params.target);
        const sourceLabel = sourceNode?.data?.label || params.source;
        const targetLabel = targetNode?.data?.label || params.target;
        
        alert(`Cannot create connection from "${sourceLabel}" to "${targetLabel}": This would create a cycle in the graph.`);
        return;
      }

      takeSnapshot(nodes, edges);
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [edges, nodes, setEdges, takeSnapshot]
  );

  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      if (nodes.length === 0) {
        alert('No nodes to layout. Please add some nodes first.');
        return;
      }

      takeSnapshot(nodes, edges);
      
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes, 
        edges, 
        { direction }
      );

      const { nodes: centeredNodes, edges: centeredEdges } = centerLayout(
        layoutedNodes, 
        layoutedEdges
      );

      setNodes(centeredNodes);
      setEdges(centeredEdges);

      // Fit view after a short delay to ensure layout is applied
      setTimeout(() => {
        fitView({ 
          padding: 0.2, 
          duration: 800,
          minZoom: 0.5,
          maxZoom: 1.5,
        });
      }, 100);
    },
    [nodes, edges, setNodes, setEdges, takeSnapshot, fitView]
  );

  const addNode = useCallback(() => {
    takeSnapshot(nodes, edges);
    const newNode: Node = {
      id: nodeId.toString(),
      type: 'editableNode',
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
      data: { 
        label: `Node ${nodeId}`,
        onLabelChange: (id: string, label: string) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === id ? { ...node, data: { ...node.data, label } } : node
            )
          );
        },
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
  }, [nodeId, setNodes, nodes, edges, takeSnapshot]);

  const clearGraph = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to clear the entire graph? This action cannot be undone.'
    );
    
    if (confirmed) {
      takeSnapshot(nodes, edges);
      setNodes([]);
      setEdges([]);
    }
  }, [setNodes, setEdges, nodes, edges, takeSnapshot]);

  const onNodesDelete: OnNodesDelete = useCallback(
    (deletedNodes) => {
      takeSnapshot(nodes, edges);
    },
    [nodes, edges, takeSnapshot]
  );

  const onEdgesDelete: OnEdgesDelete = useCallback(
    (deletedEdges) => {
      takeSnapshot(nodes, edges);
    },
    [nodes, edges, takeSnapshot]
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
        type: 'node',
      });
    },
    []
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        edgeId: edge.id,
        type: 'edge',
      });
    },
    []
  );

  const handleContextMenuDelete = useCallback(() => {
    if (!contextMenu) return;

    takeSnapshot(nodes, edges);

    if (contextMenu.type === 'node' && contextMenu.nodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== contextMenu.nodeId));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== contextMenu.nodeId &&
            edge.target !== contextMenu.nodeId
        )
      );
    } else if (contextMenu.type === 'edge' && contextMenu.edgeId) {
      setEdges((eds) => eds.filter((edge) => edge.id !== contextMenu.edgeId));
    }

    setContextMenu(null);
  }, [contextMenu, setNodes, setEdges, nodes, edges, takeSnapshot]);

  const handleContextMenuEdit = useCallback(() => {
    if (!contextMenu || contextMenu.type !== 'node') return;
    // The edit functionality is handled by double-clicking the node
    setContextMenu(null);
  }, [contextMenu]);

  const handleContextMenuDuplicate = useCallback(() => {
    if (!contextMenu || contextMenu.type !== 'node' || !contextMenu.nodeId) return;

    const nodeToDuplicate = nodes.find((node) => node.id === contextMenu.nodeId);
    if (!nodeToDuplicate) return;

    takeSnapshot(nodes, edges);

    const newNode: Node = {
      ...nodeToDuplicate,
      id: nodeId.toString(),
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      },
      data: {
        ...nodeToDuplicate.data,
        label: `${nodeToDuplicate.data.label} Copy`,
        onLabelChange: (id: string, label: string) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === id ? { ...node, data: { ...node.data, label } } : node
            )
          );
        },
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
    setContextMenu(null);
  }, [contextMenu, nodes, nodeId, setNodes, edges, takeSnapshot]);

  const handleSave = useCallback(() => {
    const graphData = {
      nodes,
      edges,
      validation: validation,
      timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dag-graph-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, validation]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const graphData = JSON.parse(e.target?.result as string);
          if (graphData.nodes && graphData.edges) {
            takeSnapshot(nodes, edges);
            
            // Add onLabelChange to loaded nodes
            const nodesWithHandlers = graphData.nodes.map((node: Node) => ({
              ...node,
              data: {
                ...node.data,
                onLabelChange: (id: string, label: string) => {
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === id ? { ...n, data: { ...n.data, label } } : n
                    )
                  );
                },
              },
            }));

            setNodes(nodesWithHandlers);
            setEdges(graphData.edges);
            
            // Update nodeId counter
            const maxId = Math.max(
              ...graphData.nodes.map((node: Node) => parseInt(node.id) || 0),
              0
            );
            setNodeId(maxId + 1);

            // Fit view after loading
            setTimeout(() => {
              fitView({ padding: 0.1, duration: 500 });
            }, 100);
          }
        } catch (error) {
          alert('Error loading file: Invalid JSON format');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges, nodes, edges, takeSnapshot, fitView]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((node) => node.selected);
        const selectedEdges = edges.filter((edge) => edge.selected);

        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          takeSnapshot(nodes, edges);

          if (selectedNodes.length > 0) {
            const nodeIds = selectedNodes.map((node) => node.id);
            setNodes((nds) => nds.filter((node) => !nodeIds.includes(node.id)));
            setEdges((eds) =>
              eds.filter(
                (edge) =>
                  !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
              )
            );
          }

          if (selectedEdges.length > 0) {
            const edgeIds = selectedEdges.map((edge) => edge.id);
            setEdges((eds) => eds.filter((edge) => !edgeIds.includes(edge.id)));
          }
        }
      } else if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if (event.key === 'z' && event.shiftKey) {
          event.preventDefault();
          redo();
        } else if (event.key === 'y') {
          event.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, setNodes, setEdges, takeSnapshot, undo, redo]);

  // Update node data with onLabelChange handler
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange: (id: string, label: string) => {
            setNodes((nodes) =>
              nodes.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, label } } : n
              )
            );
          },
        },
      }))
    );
  }, [setNodes]);

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Validation Banner */}
      <ValidationBanner
        validation={validation}
        nodeCount={nodes.length}
        edgeCount={edges.length}
      />

      {/* Main Canvas Area */}
      <div className={`flex-1 relative transition-all duration-300 ${isPanelOpen ? 'lg:mr-96' : ''}`} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          className="bg-white rounded-2xl shadow-2xl m-4"
          deleteKeyCode={['Delete', 'Backspace']}
        >
          <Controls className="bg-white border border-gray-200 rounded-2xl shadow-lg" />
          <MiniMap
            className="bg-white border border-gray-200 rounded-2xl shadow-lg"
            zoomable
            pannable
          />
          <Background color="#f1f5f9" gap={20} />
          
          <Panel position="top-left" className="space-y-4 m-4">
            <NodeToolbar
              onAddNode={addNode}
              onUndo={undo}
              onRedo={redo}
              onSave={handleSave}
              onLoad={handleLoad}
              onLayoutVertical={() => onLayout('TB')}
              onLayoutHorizontal={() => onLayout('LR')}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </Panel>

          <Panel position="top-right" className="space-y-4 m-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="flex flex-col gap-3">
                <button
                  onClick={clearGraph}
                  className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
                  title="Clear all nodes and edges from the graph"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Side Panel */}
      <SidePanel
        nodes={nodes}
        edges={edges}
        isOpen={isPanelOpen}
        onToggle={() => setIsPanelOpen(!isPanelOpen)}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={handleContextMenuDelete}
          onEdit={handleContextMenuEdit}
          onDuplicate={handleContextMenuDuplicate}
          onClose={() => setContextMenu(null)}
          type={contextMenu.type}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <DAGEditor />
    </ReactFlowProvider>
  );
}

export default App;