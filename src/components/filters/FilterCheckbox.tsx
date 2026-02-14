import React from 'react';

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-3 mb-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded bg-gray-800 border-gray-700 text-accent focus:ring-0"
      />
      <span className="text-gray-300 group-hover:text-white transition text-sm">
        {label}
      </span>
    </label>
  );
};
