
import React from 'react';

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, value, onChange, placeholder }) => {
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        id="prompt"
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      />
    </div>
  );
};

export default TextAreaInput;
