const PRESET_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#84CC16', // Lime
  '#22C55E', // Green
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export default function ColorPicker({ selectedColor, onSelectColor }) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-2">Choose a color</p>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className={`
              w-8 h-8 rounded-full transition-transform hover:scale-110
              ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''}
            `}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
