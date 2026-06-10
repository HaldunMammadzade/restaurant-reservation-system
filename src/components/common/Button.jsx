import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  className = '',
  fullWidth = false,
}) => {
  const baseStyles = 'btn transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-6 py-3 text-sm',
    large: 'px-8 py-4 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Yüklənir...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {icon && <span>{icon}</span>}
          {children}
        </div>
      )}
    </button>
  );
};

export default Button;
