import React from 'react';

const Select = ({
  label, name, value, onChange, options, error,
  required = false, disabled = false, placeholder = 'Seçin...', className = '',
}) => (
  <div className="form-group mb-0">
    {label && (
      <label htmlFor={name} className="block mb-1.5 font-semibold text-sm text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`${error ? 'border-rose-400' : ''} ${disabled ? 'bg-slate-50' : ''} ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
  </div>
);

export default Select;
