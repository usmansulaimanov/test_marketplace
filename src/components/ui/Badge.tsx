import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'brand';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    success: 'bg-gray-100 text-gray-900 border border-gray-200 font-medium',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    brand: 'bg-[#FFF1F0] text-[#F14635] border border-[#FFE1DF] font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-md ${sizeClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};
