
import React from 'react';

interface SelectInputProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}

const SelectInput = <T extends string,>({ label, value, onChange, options }: SelectInputProps<T>) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
