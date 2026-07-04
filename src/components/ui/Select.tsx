import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'h-11 w-full appearance-none rounded-lg border bg-white px-3.5 pr-10 text-sm text-navy-800',
            'border-navy-100 transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand',
            hasError && 'border-red-400 focus:ring-red-200 focus:border-red-400',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
      </div>
    );
  }
);
Select.displayName = 'Select';
