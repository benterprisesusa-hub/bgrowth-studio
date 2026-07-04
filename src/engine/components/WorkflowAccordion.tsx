import { WorkflowSection } from '../../components/WorkflowSection';
import { SectionSummaryRow } from '../../components/SectionSummaryRow';
import { FormSectionFields } from './FormSectionFields';
import { ChecklistSectionFields } from './ChecklistSectionFields';
import { NotesSectionField } from './NotesSectionField';
import { getIcon } from '../icons';
import type { ChecklistConfig, SectionConfig } from '../types';
import type { SectionProgress } from '../useProgress';
import type { StatusKind } from '../../components/ui/StatusBadge';

interface WorkflowAccordionProps {
  config: ChecklistConfig;
  activeId: string;
  onSelect: (id: string) => void;
  onContinue: (id: string) => void;
  progressBySection: Record<string, SectionProgress>;
}

function statusFor(progress: SectionProgress): { label: string; kind: StatusKind } {
  if (progress.isOptional) return { label: 'Optional', kind: 'optional' };
  if (progress.isComplete) return { label: 'Completed', kind: 'completed' };
  return { label: `${progress.filled} / ${progress.total} completed`, kind: 'progress' };
}

function renderFields(section: SectionConfig) {
  switch (section.type) {
    case 'form':
      return <FormSectionFields section={section} />;
    case 'checklist':
      return <ChecklistSectionFields section={section} layout="stack" />;
    case 'outcome':
      return <ChecklistSectionFields section={section} layout="grid" />;
    case 'notes':
      return <NotesSectionField section={section} />;
    default:
      return null;
  }
}

export function WorkflowAccordion({ config, activeId, onSelect, onContinue, progressBySection }: WorkflowAccordionProps) {
  const totalSteps = config.sections.length;

  return (
    <div className="flex flex-col gap-4">
      {config.sections.map((section) => {
        const progress = progressBySection[section.id];
        const { label, kind } = statusFor(progress);
        const Icon = getIcon(section.icon);

        if (section.id === activeId) {
          return (
            <WorkflowSection
              key={section.id}
              number={section.number}
              totalSteps={totalSteps}
              icon={<Icon />}
              title={section.title}
              description={section.description}
              whyItMatters={section.whyItMatters}
              tip={section.tip}
              isLast={section.number === totalSteps}
              onContinue={() => onContinue(section.id)}
            >
              {renderFields(section)}
            </WorkflowSection>
          );
        }

        return (
          <SectionSummaryRow
            key={section.id}
            number={section.number}
            icon={<Icon />}
            title={section.title}
            description={section.description}
            statusLabel={label}
            statusKind={kind}
            isCompleted={progress.isComplete}
            onClick={() => onSelect(section.id)}
          />
        );
      })}
    </div>
  );
}
