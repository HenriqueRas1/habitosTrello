import { useState } from 'react';
import ColorPicker from '../UI/ColorPicker';

export default function AddHabitForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [checklistItems, setChecklistItems] = useState(['']);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const filteredItems = checklistItems.filter(item => item.trim());
    onSubmit({
      title: title.trim(),
      color,
      checklistTemplate: filteredItems
    });
  };

  const handleItemChange = (index, value) => {
    const updated = [...checklistItems];
    updated[index] = value;
    setChecklistItems(updated);
  };

  const addItemField = () => {
    setChecklistItems([...checklistItems, '']);
  };

  const removeItemField = (index) => {
    const updated = checklistItems.filter((_, i) => i !== index);
    setChecklistItems(updated.length ? updated : ['']);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <div 
        className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-4"
          style={{ backgroundColor: color }}
        >
          <h2 className="text-xl font-bold text-white">New Habit</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Habit Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Drink Water, Exercise, Study..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <ColorPicker selectedColor={color} onSelectColor={setColor} />
          </div>

          {/* Checklist Items */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Checklist Items
            </label>
            <div className="space-y-2">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder={`Item ${index + 1}`}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemField(index)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItemField}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              + Add another item
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
