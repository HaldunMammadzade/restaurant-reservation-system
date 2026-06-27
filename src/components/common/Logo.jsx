import React from 'react';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { img: 'w-8 h-8', text: 'text-lg' },
    md: { img: 'w-9 h-9', text: 'text-lg' },
    lg: { img: 'w-11 h-11', text: 'text-xl' },
    xl: { img: 'w-14 h-14', text: 'text-2xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo.svg" alt="SeatMind" className={`${s.img} rounded-lg`} />
      {showText && (
        <div>
          <h1 className={`${s.text} font-bold text-slate-900 tracking-tight`}>SeatMind</h1>
          {(size === 'lg' || size === 'xl') && (
            <p className="text-[10px] text-slate-500 font-medium">Restoran idarəetmə</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
