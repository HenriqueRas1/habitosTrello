import { useState } from 'react';
import HabitCard from '../HabitCard/HabitCard';

export default function DayColumn({
  day,
  habits,
  getCompletedItems,
  toggleChecklistItem,
  toggleHabitDone,
  isHabitDone,
  updateHabit,
  deleteHabit,
  addChecklistItem,
  removeChecklistItem,
  reorderHabits,
  onAddHabit
}) {
  const [dragOverId, setDragOverId] = useState(null);

  const filteredHabits = habits.filter(
    (habit) => !habit.days || habit.days.length === 0 || habit.days.includes(day.key)
  );

  const handleDragStart = (e, habitId) => {
    e.dataTransfer.setData('habitId', habitId);
  };

  const handleDragOver = (e, habitId) => {
    e.preventDefault();
    setDragOverId(habitId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e, dropHabitId) => {
    e.preventDefault();
    const dragHabitId = e.dataTransfer.getData('habitId');
    if (dragHabitId && dragHabitId !== dropHabitId) {
      reorderHabits(dragHabitId, dropHabitId);
    }
    setDragOverId(null);
  };

  return (
    <div 
      className={`
        bg-gray-800 rounded-xl p-3 md:p-3 min-h-[300px] md:min-h-[300px] h-full flex flex-col
        ${day.isToday ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {/* Day Header */}
      <div className="mb-3 text-center">
        <h2 className={`font-semibold text-lg md:text-base ${day.isToday ? 'text-blue-400' : 'text-white'}`}>
          {day.label}
        </h2>
        <p className="text-xs text-gray-500">{day.dateStr}</p>
      </div>

      {/* Habit Cards */}
      <div className="flex-1 space-y-2">
        {filteredHabits.map((habit) => (
          <div
            key={habit.id}
            draggable
            onDragStart={(e) => handleDragStart(e, habit.id)}
            onDragOver={(e) => handleDragOver(e, habit.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, habit.id)}
            className={`${dragOverId === habit.id ? 'opacity-50' : ''}`}
          >
            <HabitCard
              habit={habit}
              dayKey={day.key}
              completedItems={getCompletedItems(habit.id, day.key)}
              isDone={isHabitDone(habit.id, day.key)}
              onToggleDone={() => toggleHabitDone(habit.id, day.key)}
              onToggleItem={(itemId) => toggleChecklistItem(habit.id, day.key, itemId)}
              onUpdateHabit={updateHabit}
              onDeleteHabit={deleteHabit}
              onAddChecklistItem={addChecklistItem}
              onRemoveChecklistItem={removeChecklistItem}
            />
          </div>
        ))}
      </div>

      {/* Add Card Button */}
      <button
        onClick={onAddHabit}
        className="mt-3 w-full py-2 px-3 rounded-lg border-2 border-dashed border-gray-600 
                   text-gray-500 hover:border-gray-500 hover:text-gray-400 
                   transition-colors text-sm"
      >
        + Add Habit
      </button>
    </div>
  );
}
