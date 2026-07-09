import { CheckCircle2 } from 'lucide-react';
import { formatResult } from './formulaEngine';
import type { CalculatorConfig, CalculatorResults } from './types';

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CalcProgressBarProps {
  completion: number;
  config: CalculatorConfig;
  results: CalculatorResults;
  primaryColor: string;
}

export function CalcProgressBar({ completion, config, results, primaryColor }: CalcProgressBarProps) {
  const offset = CIRCUMFERENCE - (completion / 100) * CIRCUMFERENCE;
  const isComplete = completion >= 100;
  const topResults = config.results.slice(0, 4);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
      {/* Circular progress */}
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
            <circle cx="40" cy="40" r={RADIUS} fill="none" stroke="#E7ECF5" strokeWidth="8" />
            <circle
              cx="40" cy="40" r={RADIUS} fill="none"
              stroke={primaryColor} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 300ms ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] font-extrabold text-navy-800">{completion}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-navy-800">
            {isComplete ? 'Calculation Complete' : 'Fill in the required fields'}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isComplete ? 'Ready to review results.' : `${completion}% of required fields completed.`}
          </div>
        </div>
      </div>

      {/* Quick metrics */}
      <div className="ml-auto flex flex-wrap gap-6">
        {topResults.map((r) => {
          const val = results[r.formulaId] ?? 0;
          return (
            <div key={r.id} className="text-center">
              <p className={`text-lg font-extrabold ${r.highlight ? 'text-navy-900' : 'text-navy-800'}`}
                style={r.highlight ? { color: primaryColor } : {}}>
                {formatResult(val, r.type, r.prefix, r.suffix)}
              </p>
              <p className="text-[11px] text-navy-400">{r.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
