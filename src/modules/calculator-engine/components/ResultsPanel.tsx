import { TrendingUp, CheckCircle2 } from 'lucide-react';
import type { CalculatorConfig, CalculatorResults } from '../types';
import { formatResult, formatCurrency } from '../formulaEngine';
import { cn } from '../../../lib/utils';

interface ResultsPanelProps {
  config: CalculatorConfig;
  results: CalculatorResults;
  primaryColor: string;
}

export function ResultsPanel({ config, results, primaryColor }: ResultsPanelProps) {
  const highlighted = config.results.find((r) => r.highlight);
  const others = config.results.filter((r) => !r.highlight);
  const val = highlighted ? results[highlighted.formulaId] ?? 0 : 0;

  const profitMarginResult = config.results.find((r) =>
    r.formulaId.includes('margin') || r.formulaId.includes('profit_margin') || r.formulaId.includes('roi')
  );
  const marginVal = profitMarginResult ? results[profitMarginResult.formulaId] ?? 0 : 0;
  const isHealthy = marginVal >= 25;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-navy-400">3. RESULTS</p>
        <p className="mt-0.5 text-sm text-navy-500">Your pricing and profit analysis.</p>
      </div>

      {/* Highlighted result */}
      {highlighted && (
        <div
          className="flex flex-col items-center justify-center rounded-xl p-6 text-center"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, #0B1D3A)` }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
            {highlighted.label}
          </p>
          <p className="mt-1 text-4xl font-extrabold text-white">
            {formatResult(val, highlighted.type, highlighted.prefix, highlighted.suffix)}
          </p>
          {highlighted.description && (
            <p className="mt-1 text-sm text-white/70">{highlighted.description}</p>
          )}
        </div>
      )}

      {/* Other results */}
      <div className="flex flex-col gap-2">
        {others.map((r) => {
          const v = results[r.formulaId] ?? 0;
          return (
            <div key={r.id} className="flex items-center justify-between border-b border-navy-50 py-2 last:border-0">
              <span className="text-sm text-navy-600">{r.label}</span>
              <span className={cn('text-sm font-bold', r.type === 'currency' ? 'text-navy-900' : 'text-navy-700')}>
                {formatResult(v, r.type, r.prefix, r.suffix)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Health indicator */}
      {profitMarginResult && (
        <div className={cn(
          'flex items-start gap-2.5 rounded-xl p-3',
          isHealthy ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        )}>
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              {isHealthy ? 'Great! Your profit margin is healthy.' : 'Consider increasing your price.'}
            </p>
            <p className="text-xs opacity-80 mt-0.5">
              {isHealthy
                ? 'You are charging a competitive and profitable rate.'
                : 'A margin below 25% may not cover unexpected costs.'}
            </p>
          </div>
        </div>
      )}

      {/* Scenarios table */}
      {config.scenarios && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-400">
            4. PRICE SCENARIOS
          </p>
          <p className="mb-3 text-xs text-navy-500">{config.scenarios.description}</p>
          <div className="overflow-x-auto rounded-xl border border-navy-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100 bg-navy-50">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-navy-500">Scenario</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-navy-500">Price</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-navy-500">Profit</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-navy-500">Margin</th>
                </tr>
              </thead>
              <tbody>
                {config.scenarios.rows.map((row) => (
                  <tr
                    key={row.label}
                    className={cn(
                      'border-b border-navy-50 last:border-0',
                      row.isRecommended && 'bg-brand-50'
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <span className={cn('font-medium', row.isRecommended ? 'text-brand-700' : 'text-navy-700')}>
                        {row.isRecommended && '⭐ '}{row.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold text-navy-800">
                      {formatCurrency(results[row.resultIds[0]] ?? 0)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-emerald-600 font-medium">
                      {formatCurrency(results[row.resultIds[1]] ?? 0)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-navy-600">
                      {(results[row.resultIds[2]] ?? 0).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
