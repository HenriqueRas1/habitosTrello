import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getWeekKey } from '../lib/weekUtils';

export function useCompletions() {
  const { user } = useAuth();
  const [allCompletions, setAllCompletions] = useState({});
  const [loading, setLoading] = useState(true);
  const weekKey = getWeekKey();

  useEffect(() => {
    if (!user) {
      setAllCompletions({});
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setAllCompletions(snapshot.data().completions || {});
      } else {
        setAllCompletions({});
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const saveCompletions = useCallback(async (newCompletions) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { completions: newCompletions }, { merge: true });
  }, [user]);

  const completions = allCompletions[weekKey] || {};

  const toggleChecklistItem = useCallback(async (habitId, dayKey, itemId) => {
    const weekData = allCompletions[weekKey] || {};
    const habitData = weekData[habitId] || {
      monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
    };
    
    const dayCompletions = habitData[dayKey] || [];
    const isCompleted = dayCompletions.includes(itemId);
    
    const updatedDayCompletions = isCompleted
      ? dayCompletions.filter(id => id !== itemId)
      : [...dayCompletions, itemId];
    
    const newCompletions = {
      ...allCompletions,
      [weekKey]: {
        ...weekData,
        [habitId]: {
          ...habitData,
          [dayKey]: updatedDayCompletions
        }
      }
    };
    await saveCompletions(newCompletions);
  }, [allCompletions, weekKey, saveCompletions]);

  const getCompletedItems = useCallback((habitId, dayKey) => {
    return completions[habitId]?.[dayKey] || [];
  }, [completions]);

  const toggleHabitDone = useCallback(async (habitId, dayKey) => {
    const weekData = allCompletions[weekKey] || {};
    const habitData = weekData[habitId] || {
      monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [],
      doneStatus: {}
    };
    
    const doneStatus = habitData.doneStatus || {};
    const isDone = doneStatus[dayKey] || false;
    
    const newCompletions = {
      ...allCompletions,
      [weekKey]: {
        ...weekData,
        [habitId]: {
          ...habitData,
          doneStatus: {
            ...doneStatus,
            [dayKey]: !isDone
          }
        }
      }
    };
    await saveCompletions(newCompletions);
  }, [allCompletions, weekKey, saveCompletions]);

  const isHabitDone = useCallback((habitId, dayKey) => {
    return completions[habitId]?.doneStatus?.[dayKey] || false;
  }, [completions]);

  return {
    completions,
    loading,
    toggleChecklistItem,
    getCompletedItems,
    toggleHabitDone,
    isHabitDone,
    weekKey
  };
}
