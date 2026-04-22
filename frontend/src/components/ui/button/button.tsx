import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export const Button = ({ variant = 'primary', loading, children, className, disabled, ...props }: ButtonProps) => {
  const base = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className ?? ''}`} disabled={disabled || loading} {...props}>
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};