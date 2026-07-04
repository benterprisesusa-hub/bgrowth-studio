import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-navy-800 placeholder:text-navy-300',
          'border-navy-100 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand',
          hasError && 'border-red-400 focus:ring-red-200 focus:border-red-400',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
