import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-gray-400 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          className={`w-full bg-white border ${
            error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:border-[#F14635] focus:ring-1 focus:ring-[#F14635]'
          } rounded-lg ${leftIcon ? 'pl-10' : 'pl-3.5'} ${
            rightIcon ? 'pr-10' : 'pr-3.5'
          } py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-gray-400 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
