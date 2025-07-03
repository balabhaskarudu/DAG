import React from 'react';
import { Plus, Undo, Redo, Save, FolderOpen, Layout, RotateCcw } from 'lucide-react';

interface NodeToolbarProps {
  onAddNode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onLayoutVertical: () => void;
  onLayoutHorizontal: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const NodeToolbar: React.FC<NodeToolbarProps> = ({
  onAddNode,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onLayoutVertical,
  onLayoutHorizontal,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Node Tools</h2>
      <div className="flex flex-col gap-3">
        <button
          onClick={onAddNode}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
          title="Add a new node to the graph"
        >
          <Plus size={16} />
          Add Node
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            title="Undo last action (Ctrl+Z)"
          >
            <Undo size={14} />
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            title="Redo last undone action (Ctrl+Y)"
          >
            <Redo size={14} />
            Redo
          </button>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-1">
          <h3 className="text-xs font-medium text-gray-600 mb-3">Auto Layout</h3>
          <div className="flex gap-2">
            <button
              onClick={onLayoutVertical}
              className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
              title="Arrange nodes vertically (top to bottom)"
            >
              <Layout size={14} />
              Vertical
            </button>
            <button
              onClick={onLayoutHorizontal}
              className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
              title="Arrange nodes horizontally (left to right)"
            >
              <RotateCcw size={14} />
              Horizontal
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-1">
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
              title="Save graph as JSON file"
            >
              <Save size={14} />
              Save
            </button>
            <button
              onClick={onLoad}
              className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
              title="Load graph from JSON file"
            >
              <FolderOpen size={14} />
              Load
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};