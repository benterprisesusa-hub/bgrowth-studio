import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy-800 placeholder:text-navy-300',
          'border-navy-100 transition-colors duration-150 min-h-[90px]',
          'focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand',
          hasError && 'border-red-400 focus:ring-red-200 focus:border-red-400',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
