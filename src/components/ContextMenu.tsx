import React from 'react';
import { Trash2, Edit3, Copy } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onClose: () => void;
  type: 'node' | 'edge';
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onDelete,
  onEdit,
  onDuplicate,
  onClose,
  type,
}) => {
  React.useEffect(() => {
    const handleClickOutside = () => onClose();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-50 min-w-[140px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {type === 'node' && (
        <button
          onClick={onEdit}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          title="Edit node label (double-click node)"
        >
          <Edit3 size={16} />
          Edit Label
        </button>
      )}
      {type === 'node' && (
        <button
          onClick={onDuplicate}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          title="Create a copy of this node"
        >
          <Copy size={16} />
          Duplicate
        </button>
      )}
      <button
        onClick={onDelete}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
        title={`Delete this ${type}`}
      >
        <Trash2 size={16} />
        Delete
      </button>
    </div>
  );
};