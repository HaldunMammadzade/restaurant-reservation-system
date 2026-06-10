import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  className = '',
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="block mb-2 font-semibold text-sm text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:border-primary ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : 'border-gray-200'} ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } ${className}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
