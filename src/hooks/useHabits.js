import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setHabits(snapshot.data().habits || []);
      } else {
        setHabits([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const saveHabits = useCallback(async (newHabits) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { habits: newHabits }, { merge: true });
  }, [user]);

  const addHabit = useCallback(async ({ title, color, checklistTemplate = [], days = [] }) => {
    const newHabit = {
      id: uuidv4(),
      title,
      color,
      order: habits.length,
      days,
      checklistTemplate: checklistTemplate.map(label => ({
        id: uuidv4(),
        label
      })),
      createdAt: new Date().toISOString()
    };
    const newHabits = [...habits, newHabit];
    await saveHabits(newHabits);
  }, [habits, saveHabits]);

  const updateHabit = useCallback(async (habitId, updates) => {
    const newHabits = habits.map(h => 
      h.id === habitId ? { ...h, ...updates } : h
    );
    await saveHabits(newHabits);
  }, [habits, saveHabits]);

  const deleteHabit = useCallback(async (habitId) => {
    const newHabits = habits.filter(h => h.id !== habitId);
    await saveHabits(newHabits);
  }, [habits, saveHabits]);

  const addChecklistItem = useCallback(async (habitId, label) => {
    const newItem = { id: uuidv4(), label };
    const newHabits = habits.map(h => 
      h.id === habitId 
        ? { ...h, checklistTemplate: [...h.checklistTemplate, newItem] }
        : h
    );
    await saveHabits(newHabits);
  }, [habits, saveHabits]);

  const removeChecklistItem = useCallback(async (habitId, itemId) => {
    const newHabits = habits.map(h => 
      h.id === habitId 
        ? { ...h, checklistTemplate: h.checklistTemplate.filter(item => item.id !== itemId) }
        : h
    );
    await saveHabits(newHabits);
  }, [habits, saveHabits]);

  const reorderHabits = useCallback(async (dragId, dropId) => {
    const dragIndex = habits.findIndex(h => h.id === dragId);
    const dropIndex = habits.findIndex(h => h.id === dropId);
    if (dragIndex === -1 || dropIndex === -1) return;
    
    const updated = [...habits];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, dragged);
    const newHabits = updated.map((h, i) => ({ ...h, order: i }));
    await saveHabits(newHabits);
  }, [habits, saveHabits]);

  return {
    habits,
    loading,
    error: null,
    addHabit,
    updateHabit,
    deleteHabit,
    addChecklistItem,
    removeChecklistItem,
    reorderHabits
  };
}
