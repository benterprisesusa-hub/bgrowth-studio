import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InfoCardProps {
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
  tone?: 'brand' | 'neutral';
  className?: string;
}

export function InfoCard({ icon, title, children, tone = 'brand', className }: InfoCardProps) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border p-4',
        tone === 'brand' ? 'border-brand-100 bg-brand-50' : 'border-navy-100 bg-navy-50',
        className
      )}
    >
      {icon && (
        <span className={cn('shrink-0 [&>svg]:h-5 [&>svg]:w-5', tone === 'brand' ? 'text-brand' : 'text-navy-500')}>
          {icon}
        </span>
      )}
      <div className="text-sm">
        {title && <p className="mb-0.5 font-semibold text-navy-800">{title}</p>}
        <div className="text-navy-500 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
