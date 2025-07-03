import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface NodeData {
  label: string;
  onLabelChange?: (id: string, label: string) => void;
}

export const EditableNode: React.FC<NodeProps<NodeData>> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSubmit = useCallback(() => {
    setIsEditing(false);
    if (data.onLabelChange && label.trim()) {
      data.onLabelChange(id, label.trim());
    }
  }, [id, label, data]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setLabel(data.label);
      setIsEditing(false);
    }
  }, [handleSubmit, data.label]);

  return (
    <div 
      className={`px-6 py-4 shadow-lg rounded-2xl border-2 bg-white min-w-[140px] transition-all duration-200 hover:shadow-xl hover:scale-105 ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
      }`}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit label"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 !bg-blue-500 border-2 border-white shadow-lg hover:scale-125 transition-transform"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="w-full text-center text-sm font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-200 rounded px-2 py-1"
          autoFocus
          placeholder="Enter label..."
        />
      ) : (
        <div className="text-center text-sm font-medium text-gray-800">
          {data.label}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 !bg-blue-500 border-2 border-white shadow-lg hover:scale-125 transition-transform"
      />
    </div>
  );
};