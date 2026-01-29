import { useState } from 'react';
import { calculateProgress } from '../../lib/weekUtils';
import HabitModal from './HabitModal';

export default function HabitCard({
  habit,
  dayKey,
  completedItems,
  isDone,
  onToggleDone,
  onToggleItem,
  onUpdateHabit,
  onDeleteHabit,
  onAddChecklistItem,
  onRemoveChecklistItem
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = habit.checklistTemplate?.length || 0;
  const { fraction, percent } = calculateProgress(completedItems, totalItems);

  const getContrastColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1f2937' : '#ffffff';
  };

  const textColor = getContrastColor(habit.color || '#3b82f6');

  return (
    <>
      <div
        className={`rounded-lg p-3 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] ${isDone ? 'opacity-60' : ''}`}
        style={{ backgroundColor: habit.color || '#3b82f6' }}
      >
        {/* Header with checkbox and title */}
        <div className="flex items-start gap-2 mb-2">
          {/* Done Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDone();
            }}
            className="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5"
            style={{ 
              borderColor: textColor,
              backgroundColor: isDone ? textColor : 'transparent'
            }}
          >
            {isDone && (
              <svg 
                className="w-3 h-3" 
                fill="none" 
                stroke={habit.color || '#3b82f6'} 
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          {/* Title */}
          <h3 
            onClick={() => setIsExpanded(true)}
            className={`font-medium text-sm truncate flex-1 ${isDone ? 'line-through' : ''}`}
            style={{ color: textColor }}
          >
            {habit.title}
          </h3>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2" onClick={() => setIsExpanded(true)}>
          {/* Progress Bar */}
          <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${percent}%`,
                backgroundColor: textColor,
                opacity: 0.8
              }}
            />
          </div>
          
          {/* Fraction */}
          <span 
            className="text-xs font-medium"
            style={{ color: textColor, opacity: 0.9 }}
          >
            {fraction}
          </span>
        </div>
      </div>

      {/* Modal */}
      {isExpanded && (
        <HabitModal
          habit={habit}
          dayKey={dayKey}
          completedItems={completedItems}
          onToggleItem={onToggleItem}
          onClose={() => setIsExpanded(false)}
          onUpdateHabit={onUpdateHabit}
          onDeleteHabit={onDeleteHabit}
          onAddChecklistItem={onAddChecklistItem}
          onRemoveChecklistItem={onRemoveChecklistItem}
        />
      )}
    </>
  );
}
