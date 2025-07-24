'use client';

import React, { useState } from 'react';

interface InputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'email' | 'password' | 'datetime-local';
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface TextAreaProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

interface SelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const baseInputClasses = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black";

export const Input: React.FC<InputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  min,
  max,
  step,
  className = ''
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      step={step}
      className={`${baseInputClasses} ${className}`}
    />
  );
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${baseInputClasses} pr-12 ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-[20px] top-[26px] -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 flex items-center justify-center"
        tabIndex={-1}
      >
        {showPassword ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export const TextArea: React.FC<TextAreaProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  className = ''
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={`${baseInputClasses} ${className}`}
    />
  );
};

export const Select: React.FC<SelectProps> = ({
  id,
  name,
  value,
  onChange,
  required = false,
  children,
  className = ''
}) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`${baseInputClasses} ${className}`}
    >
      {children}
    </select>
  );
}; 