'use client';

import React, { useState } from 'react';

interface PaceGroupsSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

const PACE_OPTIONS = [
  'Easy (8:00 min/km)',
  'Intermediate (7:00 min/km)',
  'Advanced (6:00 min/km)',
  'Beginner (9:00 min/km)',
  'All Paces Welcome'
];

export const PaceGroupsSelect: React.FC<PaceGroupsSelectProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [newPace, setNewPace] = useState('');

  const handleAddPace = () => {
    if (newPace.trim() && !value.includes(newPace.trim())) {
      onChange([...value, newPace.trim()]);
      setNewPace('');
    }
  };

  const handleRemovePace = (paceToRemove: string) => {
    onChange(value.filter(pace => pace !== paceToRemove));
  };

  const handleOptionChange = (option: string, checked: boolean) => {
    if (checked && !value.includes(option)) {
      onChange([...value, option]);
    } else if (!checked) {
      onChange(value.filter(item => item !== option));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPace();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Free text input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newPace}
          onChange={(e) => setNewPace(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter custom pace (e.g., 6:30 min/km)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
        />
        <button
          type="button"
          onClick={handleAddPace}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Selected paces */}
      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected Paces:</p>
          <div className="flex flex-wrap gap-2">
            {value.map((pace, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {pace}
                <button
                  type="button"
                  onClick={() => handleRemovePace(pace)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Common pace options */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Common Paces:</p>
        {PACE_OPTIONS.map((option) => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={(e) => handleOptionChange(option, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}; 