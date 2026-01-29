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

  const handleCardClick = (e) => {
    e.stopPropagation();
    setIsExpanded(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
        className={`rounded-lg p-3 cursor-pointer transition-transform active:scale-[0.98] ${isDone ? 'opacity-60' : ''}`}
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
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
            className="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors"
            style={{ 
              borderColor: textColor,
              backgroundColor: isDone ? textColor : 'transparent'
            }}
          >
            {isDone && (
              <svg 
                className="w-4 h-4" 
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
            className={`font-medium text-sm truncate flex-1 ${isDone ? 'line-through' : ''}`}
            style={{ color: textColor }}
          >
            {habit.title}
          </h3>

          {/* Edit button for mobile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
            className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center opacity-70 hover:opacity-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            <svg 
              className="w-3.5 h-3.5" 
              fill="none" 
              stroke={textColor}
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
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
