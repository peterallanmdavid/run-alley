'use client';

import { useState, useRef, useEffect } from 'react';
import { Member } from '@/lib/data';

interface MultiSelectProps {
  options: Member[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Select members...",
  disabled = false
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    const allValues = filteredOptions.map(option => option.id);
    onChange(allValues);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedMembers = options.filter(option => selectedValues.includes(option.id));

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`border border-gray-300 rounded-lg p-2 min-h-[40px] cursor-pointer bg-white ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedMembers.map(member => (
              <span
                key={member.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800"
              >
                {member.name}
                <button
                  type="button"
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleOption(member.id);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search members..."
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="p-2 border-b border-gray-200">
            <div className="flex gap-2 text-sm">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={handleSelectAll}
              >
                Select All
              </button>
              <button
                type="button"
                className="text-red-600 hover:text-red-800"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                No members found
              </div>
            ) : (
              filteredOptions.map(option => (
                <label
                  key={option.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.id)}
                    onChange={() => handleToggleOption(option.id)}
                    className="mr-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm">
                    {option.name} ({option.age}, {option.gender})
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 