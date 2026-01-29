import { useState } from 'react';
import { calculateProgress } from '../../lib/weekUtils';
import ColorPicker from '../UI/ColorPicker';

export default function HabitModal({
  habit,
  dayKey,
  completedItems,
  onToggleItem,
  onClose,
  onUpdateHabit,
  onDeleteHabit,
  onAddChecklistItem,
  onRemoveChecklistItem
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(habit.title);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const totalItems = habit.checklistTemplate?.length || 0;
  const { fraction, percent } = calculateProgress(completedItems, totalItems);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;
    await onAddChecklistItem(habit.id, newItemLabel.trim());
    setNewItemLabel('');
  };

  const handleDeleteHabit = async () => {
    if (window.confirm(`Delete "${habit.title}"? This cannot be undone.`)) {
      await onDeleteHabit(habit.id);
      onClose();
    }
  };

  const handleColorChange = async (color) => {
    await onUpdateHabit(habit.id, { color });
    setShowColorPicker(false);
  };

  const handleTitleSave = async () => {
    if (editedTitle.trim() && editedTitle !== habit.title) {
      await onUpdateHabit(habit.id, { title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(habit.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: habit.color || '#3b82f6' }}
        >
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="text-xl font-bold text-white bg-white/20 rounded px-2 py-1 outline-none flex-1 mr-2"
            />
          ) : (
            <h2 
              className="text-xl font-bold text-white cursor-pointer hover:bg-white/20 rounded px-2 py-1 -mx-2"
              onClick={() => setIsEditingTitle(true)}
              title="Click to edit"
            >
              {habit.title}
            </h2>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              title="Change color"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <div className="p-4 border-b border-gray-700">
            <ColorPicker 
              selectedColor={habit.color} 
              onSelectColor={handleColorChange} 
            />
          </div>
        )}

        {/* Progress */}
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progress for {dayKey}</span>
            <span>{fraction} ({percent}%)</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${percent}%`,
                backgroundColor: habit.color || '#3b82f6'
              }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {habit.checklistTemplate?.map((item) => {
              const isChecked = completedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg group"
                >
                  <button
                    onClick={() => onToggleItem(item.id)}
                    className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                      ${isChecked 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-500 hover:border-gray-400'
                      }
                    `}
                  >
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span className={`flex-1 text-sm ${isChecked ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                    {item.label}
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => onRemoveChecklistItem(habit.id, item.id)}
                      className="p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="mt-4 flex gap-2">
            <input
              type="text"
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              placeholder="Add checklist item..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newItemLabel.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-700 flex justify-between">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isEditing ? 'Done Editing' : 'Edit Items'}
          </button>
          <button
            onClick={handleDeleteHabit}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Delete Habit
          </button>
        </div>
      </div>
    </div>
  );
}
