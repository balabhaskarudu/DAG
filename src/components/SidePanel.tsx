import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Code, Copy, Check, Database } from 'lucide-react';
import { Node, Edge } from 'reactflow';

interface SidePanelProps {
  nodes: Node[];
  edges: Edge[];
  isOpen: boolean;
  onToggle: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  nodes,
  edges,
  isOpen,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'edges' | 'combined'>('combined');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const formatJSON = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  const handleCopy = async (data: any, section: string) => {
    try {
      await navigator.clipboard.writeText(formatJSON(data));
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getGraphData = () => {
    return {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
        selected: node.selected || false,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        selected: edge.selected || false,
      })),
      metadata: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        lastUpdated: new Date().toISOString(),
      }
    };
  };

  const cleanNodes = nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: {
      label: node.data.label,
    },
    selected: node.selected || false,
  }));

  const cleanEdges = edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    selected: edge.selected || false,
  }));

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white border-l border-gray-200 shadow-2xl z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-full lg:w-96' : 'w-0'
        } overflow-hidden`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Graph Data</h2>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200"
            title="Close data panel"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('combined')}
            className={`flex-1 px-4 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === 'combined'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="View complete graph data"
          >
            Combined
          </button>
          <button
            onClick={() => setActiveTab('nodes')}
            className={`flex-1 px-4 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === 'nodes'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="View nodes data only"
          >
            Nodes ({nodes.length})
          </button>
          <button
            onClick={() => setActiveTab('edges')}
            className={`flex-1 px-4 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === 'edges'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="View edges data only"
          >
            Edges ({edges.length})
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'combined' && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Complete Graph Data</span>
                <button
                  onClick={() => handleCopy(getGraphData(), 'combined')}
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-xl transition-all duration-200 ${
                    copiedSection === 'combined'
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  }`}
                  title="Copy complete data to clipboard"
                >
                  {copiedSection === 'combined' ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words font-mono leading-relaxed">
                  {formatJSON(getGraphData())}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'nodes' && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Nodes Data</span>
                <button
                  onClick={() => handleCopy(cleanNodes, 'nodes')}
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-xl transition-all duration-200 ${
                    copiedSection === 'nodes'
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  }`}
                  title="Copy nodes data to clipboard"
                >
                  {copiedSection === 'nodes' ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words font-mono leading-relaxed">
                  {formatJSON(cleanNodes)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'edges' && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Edges Data</span>
                <button
                  onClick={() => handleCopy(cleanEdges, 'edges')}
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-xl transition-all duration-200 ${
                    copiedSection === 'edges'
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  }`}
                  title="Copy edges data to clipboard"
                >
                  {copiedSection === 'edges' ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words font-mono leading-relaxed">
                  {formatJSON(cleanEdges)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between items-center">
              <span>Total Nodes:</span>
              <span className="font-semibold text-blue-600">{nodes.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Edges:</span>
              <span className="font-semibold text-blue-600">{edges.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Updated:</span>
              <span className="font-semibold text-blue-600">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-1/2 right-6 transform -translate-y-1/2 z-40 bg-blue-600 text-white p-4 rounded-2xl shadow-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 hover:shadow-xl"
          title="Open data panel"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
    </>
  );
};