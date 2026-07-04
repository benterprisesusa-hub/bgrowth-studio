import { forwardRef } from 'react';
import { Check, X } from 'lucide-react';
import type { ChecklistConfig, ChecklistData, FormSectionConfig, ChecklistSectionConfig, OutcomeSectionConfig } from '../types';

interface PrintableSummaryProps {
  config: ChecklistConfig;
  data: ChecklistData;
  percent: number;
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="mb-2 flex gap-2 text-[12px] leading-snug">
      <span className="w-[150px] shrink-0 font-semibold text-navy-500">{label}</span>
      <span className="text-navy-800">{value}</span>
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 break-inside-avoid rounded-lg border border-navy-100 p-4">
      <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-brand-700">{title}</h3>
      {children}
    </section>
  );
}

function FormBlock({ section, values }: { section: FormSectionConfig; values: Record<string, string> | undefined }) {
  const hasAnyValue = section.fields.some((f) => values?.[f.id]);
  if (section.optional && !hasAnyValue) return null;

  return (
    <SectionBlock title={`${section.number}. ${section.title}`}>
      {section.fields.map((field) => (
        <Row key={field.id} label={field.label} value={values?.[field.id]} />
      ))}
    </SectionBlock>
  );
}

function ChecklistBlock({
  section,
  values,
}: {
  section: ChecklistSectionConfig | OutcomeSectionConfig;
  values: Record<string, boolean> | undefined;
}) {
  return (
    <SectionBlock title={`${section.number}. ${section.title}`}>
      <ul className="flex flex-col gap-1.5">
        {section.items.map((item) => {
          const checked = !!values?.[item.id];
          return (
            <li key={item.id} className="flex items-center gap-2 text-[12px]">
              <span
                className={
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ' +
                  (checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-navy-300 text-navy-300')
                }
              >
                {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className={checked ? 'text-navy-800' : 'text-navy-400'}>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </SectionBlock>
  );
}

function NotesBlock({ section, value }: { section: { number: number; title: string }; value: string | undefined }) {
  if (!value) return null;
  return (
    <SectionBlock title={`${section.number}. ${section.title}`}>
      <p className="whitespace-pre-wrap text-[12px] text-navy-700">{value}</p>
    </SectionBlock>
  );
}

export const PrintableSummary = forwardRef<HTMLDivElement, PrintableSummaryProps>(({ config, data, percent }, ref) => {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div ref={ref} className="printable-summary bg-white p-8 text-navy-900">
      <div className="mb-6 flex items-center justify-between border-b border-navy-100 pb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">{config.brand.companyLabel}</p>
          <h1 className="text-xl font-bold text-navy-900">{config.brand.name}</h1>
        </div>
        <div className="text-right text-[11px] text-navy-400">
          <p>Generated {today}</p>
          <p>{percent}% complete</p>
        </div>
      </div>

      {config.sections.map((section) => {
        if (section.type === 'form') {
          return <FormBlock key={section.id} section={section} values={data[section.id] as Record<string, string>} />;
        }
        if (section.type === 'checklist' || section.type === 'outcome') {
          return <ChecklistBlock key={section.id} section={section} values={data[section.id] as Record<string, boolean>} />;
        }
        return <NotesBlock key={section.id} section={section} value={data[section.id] as string} />;
      })}

      <p className="mt-4 text-center text-[10px] text-navy-300">
        {config.brand.companyLabel} — {config.brand.name}
      </p>
    </div>
  );
});
PrintableSummary.displayName = 'PrintableSummary';
