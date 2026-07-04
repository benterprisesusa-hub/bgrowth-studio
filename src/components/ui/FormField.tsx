import type { LabelHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface FormFieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
  icon?: ReactNode;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, icon, required, error, children, className, htmlFor, ...rest }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-[13px] font-medium text-navy-700"
        {...rest}
      >
        {icon && <span className="text-brand shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
