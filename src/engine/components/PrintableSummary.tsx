import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import type { ChecklistConfig, ChecklistData, FormSectionConfig, ChecklistSectionConfig, OutcomeSectionConfig, NotesSectionConfig } from '../types';

interface PrintableSummaryProps {
  config: ChecklistConfig;
  data: ChecklistData;
  percent: number;
  blankMode?: boolean;
}

function isPublicLink() {
  return window.location.search.includes('template=');
}

function getCompanyInfo(config: ChecklistConfig) {
  try {
    const raw = localStorage.getItem('bgrowth.checklist-builder.settings');
    const settings = raw ? JSON.parse(raw) : null;
    return {
      name: settings?.companyName || config.brand.companyLabel || 'BGrowth Club',
      logo: settings?.logoUrl ?? null,
    };
  } catch { return { name: config.brand.companyLabel || 'BGrowth Club', logo: null }; }
}

function FormLine({ label, value, blank }: { label: string; value?: string; blank?: boolean }) {
  if (!blank && !value) return null;
  return (
    <div className="flex items-baseline text-[10.5px] leading-tight mb-2">
      <span className="font-semibold text-slate-800 shrink-0 mr-1 w-[140px]">{label}:</span>
      <span className="grow border-b border-slate-300 font-medium text-slate-900 pb-0.5 pl-1 min-h-[16px]">
        {blank ? '' : (value || '')}
      </span>
    </div>
  );
}

function FormSection({ section, values, blank }: { section: FormSectionConfig; values: Record<string, string> | undefined; blank?: boolean }) {
  const hasValue = section.fields.some(f => values?.[f.id]);
  if (!blank && section.optional && !hasValue) return null;
  return (
    <div className="mb-4">
      <div style={{ background: '#1061EC' }} className="text-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide rounded-t-sm">
        {section.number}. {section.title}
      </div>
      <div className="border border-t-0 border-slate-200 rounded-b-sm p-3 bg-white">
        {section.fields
          .filter(f => f.type !== 'title' && f.type !== 'static_text' && f.type !== 'checkbox' && f.type !== 'image' && f.type !== 'file' && f.type !== 'link')
          .map(f => (
            <FormLine key={f.id} label={f.label} value={values?.[f.id]} blank={blank} />
          ))}
      </div>
    </div>
  );
}

function ChecklistSection({ section, values, blank }: { section: ChecklistSectionConfig | OutcomeSectionConfig; values: Record<string, boolean> | undefined; blank?: boolean }) {
  return (
    <div className="mb-2">
      <div style={{ background: '#1061EC' }} className="text-white px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-wide rounded-t-sm">
        {section.number}. {section.title}
      </div>
      <div className="border border-t-0 border-slate-200 rounded-b-sm bg-white divide-y divide-slate-100">
        {section.items.map(item => {
          const checked = !blank && !!values?.[item.id];
          return (
            <div key={item.id} className="flex items-center py-1.5 px-3 gap-2">
              <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border border-slate-400 bg-white">
                {checked && <Check className="h-2.5 w-2.5 text-[#1061EC]" strokeWidth={4} />}
              </div>
              <span className="text-[10.5px] font-medium text-slate-800">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotesSection({ section, value, blank }: { section: NotesSectionConfig; value: string | undefined; blank?: boolean }) {
  return (
    <div className="mb-4">
      <div style={{ background: '#0b1d3a' }} className="text-white px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-wide rounded-sm">
        {section.number}. {section.title}
      </div>
      <div className="mt-1 flex flex-col gap-2.5 px-1">
        {blank ? (
          <>
            <div className="border-b border-slate-300 min-h-[17px]" />
            <div className="border-b border-slate-300 min-h-[17px]" />
            <div className="border-b border-slate-300 min-h-[17px]" />
          </>
        ) : (
          <div className="border-b border-slate-300 pb-0.5 text-[10.5px] font-medium text-slate-800 min-h-[17px] whitespace-pre-wrap">
            {value || ''}
          </div>
        )}
      </div>
    </div>
  );
}

export const PrintableSummary = forwardRef<HTMLDivElement, PrintableSummaryProps>(({ config, data, percent, blankMode = false }, ref) => {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const isPublic = isPublicLink();
  const { name: companyName, logo: logoUrl } = getCompanyInfo(config);

  const formSections = config.sections.filter(s => s.type === 'form') as FormSectionConfig[];
  const checklistSections = config.sections.filter(s => s.type === 'checklist' || s.type === 'outcome') as (ChecklistSectionConfig | OutcomeSectionConfig)[];
  const notesSections = config.sections.filter(s => s.type === 'notes') as NotesSectionConfig[];
  const outcomeSections = config.sections.filter(s => s.type === 'outcome') as OutcomeSectionConfig[];

  return (
    <div ref={ref} className="printable-summary bg-white p-8 text-slate-900 font-sans" style={{ width: '800px' }}>
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-5">
        <div>
          <h1 className="text-[19px] font-black text-[#0b1d3a] tracking-tight uppercase">
            {config.brand.name}
          </h1>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{companyName}</p>
        </div>
        {!isPublic && (
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-lg object-cover" />
            ) : (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1061EC] to-[#0c49b3] text-white font-extrabold text-[14px]">
                <span>B</span>
                <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[8px] border border-white font-black text-white">↑</div>
              </div>
            )}
            <div className="flex flex-col leading-none">
              <span className="text-[12px] font-extrabold tracking-tight text-[#0b1d3a]">BGrowth <span className="text-[#1061EC]">Club</span></span>
              <span className="text-[6.5px] text-gray-400 uppercase tracking-widest font-semibold">Business Growth</span>
            </div>
          </div>
        )}
        {isPublic && (
          <div className="text-right text-[10px] text-slate-400">
            <p>Generated {today}</p>
            <p>{blankMode ? 'Blank Form' : `${percent}% complete`}</p>
          </div>
        )}
        {!isPublic && (
          <div className="text-right text-[10px] text-slate-400 mt-1">
            <p>Generated {today}</p>
            <p>{blankMode ? 'Blank Form' : `${percent}% complete`}</p>
          </div>
        )}
      </div>

      {/* Form sections grid */}
      {formSections.length > 0 && (
        <div className={`grid gap-4 mb-5 ${formSections.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {formSections.map(section => (
            <FormSection
              key={section.id}
              section={section}
              values={data[section.id] as Record<string, string>}
              blank={blankMode}
            />
          ))}
        </div>
      )}

      {/* Checklist sections */}
      {checklistSections.filter(s => s.type === 'checklist').length > 0 && (
        <div className="mb-4">
          <div className="flex text-[9px] font-bold text-slate-400 border-b-2 border-slate-200 pb-1 px-1 mb-2">
            <div className="w-full uppercase tracking-wider">+ TASK</div>
          </div>
          {(config.sections.filter(s => s.type === 'checklist') as ChecklistSectionConfig[]).map(section => (
            <ChecklistSection
              key={section.id}
              section={section}
              values={data[section.id] as Record<string, boolean>}
              blank={blankMode}
            />
          ))}
        </div>
      )}

      {/* Notes sections */}
      {notesSections.map(section => (
        <NotesSection
          key={section.id}
          section={section}
          value={data[section.id] as string}
          blank={blankMode}
        />
      ))}

      {/* Outcome sections */}
      {outcomeSections.length > 0 && (
        <div className="mb-4">
          <div style={{ background: '#0b1d3a' }} className="text-white px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-wide rounded-sm mb-2">
            Appointment Outcome
          </div>
          <div className="flex flex-wrap gap-4 px-1">
            {outcomeSections.flatMap(section =>
              section.items.map(item => {
                const checked = !blankMode && !!(data[section.id] as Record<string, boolean>)?.[item.id];
                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border border-slate-400 bg-white">
                      {checked && <Check className="h-2.5 w-2.5 text-[#1061EC]" strokeWidth={4} />}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-slate-200 pt-2 mt-4 flex justify-between items-center text-[9px] font-extrabold">
        <span className="text-slate-800 uppercase tracking-tight">{companyName}</span>
        <span className="text-slate-400 font-normal">Generated on {today} • {blankMode ? 'Blank Form' : `${percent}% complete`}</span>
        <span className="text-[#1061EC] lowercase">bgrowthclub.com</span>
      </div>
    </div>
  );
});
PrintableSummary.displayName = 'PrintableSummary';
