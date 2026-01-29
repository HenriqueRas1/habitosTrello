/**
 * Get ISO week key for a given date (e.g., "2026-W05")
 */
export function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Set to Thursday of current week (ISO week starts Monday)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}

/**
 * Get array of day objects for the current week (Monday to Sunday)
 */
export function getWeekDays(date = new Date()) {
  const days = [];
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  // Find Monday of current week
  const dayOfWeek = d.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setDate(d.getDate() + mondayOffset);
  
  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(d);
    currentDate.setDate(d.getDate() + i);
    days.push({
      key: dayNames[i],
      label: dayLabels[i],
      date: currentDate,
      dateStr: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday: isSameDay(currentDate, new Date())
    });
  }
  
  return days;
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

/**
 * Calculate progress from completed items
 */
export function calculateProgress(completedItems = [], totalItems = 0) {
  if (totalItems === 0) return { fraction: '0/0', percent: 0 };
  const completed = completedItems.length;
  const percent = Math.round((completed / totalItems) * 100);
  return {
    fraction: `${completed}/${totalItems}`,
    percent
  };
}
