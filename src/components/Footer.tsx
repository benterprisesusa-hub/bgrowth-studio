import { Lightbulb, Globe } from 'lucide-react';
import type { FooterConfig } from '../engine/types';

interface FooterProps {
  footer: FooterConfig;
}

export function Footer({ footer }: FooterProps) {
  return (
    <footer className="no-print mx-auto mt-6 max-w-[1280px] px-4 pb-10 sm:px-6">
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:grid-cols-2 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <Lightbulb className="h-[18px] w-[18px]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-800">Pro Tip</p>
            <p className="mt-0.5 text-xs leading-relaxed text-navy-400">{footer.proTip}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 sm:border-l sm:border-navy-100 sm:pl-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
            <Globe className="h-[18px] w-[18px]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-800">Need Help?</p>
            {footer.helpUrl ? (
              <a
                href={footer.helpUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 block text-xs leading-relaxed text-brand-600 hover:underline"
              >
                {footer.helpText}
              </a>
            ) : (
              <p className="mt-0.5 text-xs leading-relaxed text-navy-400">{footer.helpText}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
