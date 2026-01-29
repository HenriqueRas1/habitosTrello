import { useState, useRef, useEffect } from 'react';
import { getWeekDays, getWeekKey } from '../../lib/weekUtils';
import { useHabits } from '../../hooks/useHabits';
import { useCompletions } from '../../hooks/useCompletions';
import { useAuth } from '../../contexts/AuthContext';
import DayColumn from './DayColumn';
import AddHabitForm from '../Forms/AddHabitForm';

export default function Board() {
  const days = getWeekDays();
  const weekKey = getWeekKey();
  const { user, logout } = useAuth();
  const { habits, loading: habitsLoading, addHabit, updateHabit, deleteHabit, addChecklistItem, removeChecklistItem, reorderHabits } = useHabits();
  const { completions, loading: completionsLoading, toggleChecklistItem, getCompletedItems, toggleHabitDone, isHabitDone } = useCompletions();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Mobile navigation state
  const todayIndex = days.findIndex(d => d.isToday);
  const [currentDayIndex, setCurrentDayIndex] = useState(todayIndex >= 0 ? todayIndex : 0);

  const loading = habitsLoading || completionsLoading;

  const handleAddHabit = async (habitData) => {
    await addHabit({ ...habitData, days: habitData.days || [selectedDay] });
    setShowAddForm(false);
    setSelectedDay(null);
  };

  const openAddForm = (dayKey) => {
    setSelectedDay(dayKey);
    setShowAddForm(true);
  };

  const goToPrevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(prev => prev - 1);
    }
  };

  const goToNextDay = () => {
    if (currentDayIndex < days.length - 1) {
      setCurrentDayIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 flex flex-col">
      {/* Header */}
      <header className="mb-4 md:mb-6 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-white mb-1">
            Habit Tracker
          </h1>
          <p className="text-gray-400 text-xs md:text-sm">
            Week {weekKey.split('-W')[1]}, {weekKey.split('-W')[0]}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-gray-400 text-sm hidden md:block">{user?.email}</span>
          <button
            onClick={logout}
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Day Dots */}
      <div className="flex justify-center gap-2 mb-4 md:hidden">
        {days.map((day, index) => (
          <button
            key={day.key}
            onClick={() => setCurrentDayIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentDayIndex 
                ? 'bg-blue-500' 
                : day.isToday 
                  ? 'bg-blue-500/50' 
                  : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex-1 overflow-hidden">
        <DayColumn
          day={days[currentDayIndex]}
          habits={habits}
          getCompletedItems={getCompletedItems}
          toggleChecklistItem={toggleChecklistItem}
          toggleHabitDone={toggleHabitDone}
          isHabitDone={isHabitDone}
          updateHabit={updateHabit}
          deleteHabit={deleteHabit}
          addChecklistItem={addChecklistItem}
          removeChecklistItem={removeChecklistItem}
          reorderHabits={reorderHabits}
          onAddHabit={() => openAddForm(days[currentDayIndex].key)}
        />
      </div>

      {/* Mobile Navigation Buttons */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl mt-3">
        <button
          onClick={goToPrevDay}
          disabled={currentDayIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentDayIndex === 0 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-white bg-gray-700 active:bg-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">
            {currentDayIndex > 0 ? days[currentDayIndex - 1].label.slice(0, 3) : ''}
          </span>
        </button>

        <span className="text-white font-semibold">
          {days[currentDayIndex].label}
        </span>

        <button
          onClick={goToNextDay}
          disabled={currentDayIndex === days.length - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentDayIndex === days.length - 1 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-white bg-gray-700 active:bg-gray-600'
          }`}
        >
          <span className="text-sm font-medium">
            {currentDayIndex < days.length - 1 ? days[currentDayIndex + 1].label.slice(0, 3) : ''}
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-7 gap-4 flex-1">
        {days.map((day) => (
          <DayColumn
            key={day.key}
            day={day}
            habits={habits}
            getCompletedItems={getCompletedItems}
            toggleChecklistItem={toggleChecklistItem}
            toggleHabitDone={toggleHabitDone}
            isHabitDone={isHabitDone}
            updateHabit={updateHabit}
            deleteHabit={deleteHabit}
            addChecklistItem={addChecklistItem}
            removeChecklistItem={removeChecklistItem}
            reorderHabits={reorderHabits}
            onAddHabit={() => openAddForm(day.key)}
          />
        ))}
      </div>

      {/* Add Habit Modal */}
      {showAddForm && (
        <AddHabitForm
          onSubmit={handleAddHabit}
          onCancel={() => {
            setShowAddForm(false);
            setSelectedDay(null);
          }}
        />
      )}
    </div>
  );
}
