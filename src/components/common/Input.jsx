import React from 'react';

const Input = ({
  label, type = 'text', name, value, onChange, placeholder, error,
  required = false, disabled = false, icon, className = '',
}) => (
  <div className="form-group mb-0">
    {label && (
      <label htmlFor={name} className="block mb-1.5 font-semibold text-sm text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>
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
        className={`${icon ? 'pl-10' : ''} ${error ? 'border-rose-400 ring-rose-500/10' : ''} ${disabled ? 'bg-slate-50' : ''} ${className}`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
  </div>
);

export default Input;
