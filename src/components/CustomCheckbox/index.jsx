import React from 'react';

const CustomCheckbox = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer group">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    <div className={`w-6 h-6 flex items-center justify-center border-2 rounded-md transition-all 
      ${checked ? 'border-transparent bg-[#17212b] shadow-lg' : 'border-gray-400 group-hover:border-purple-400'} 
      transform duration-300 ease-in-out ${checked ? 'scale-105' : 'scale-100'}`}>
      {checked && (
        <svg className="w-4 h-4 text-white transform transition-transform duration-300 ease-in-out" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
        </svg>
      )}
    </div>
    <span className="ml-3 text-white  transition-colors duration-300">{label}</span>
  </label>
);

export default CustomCheckbox;