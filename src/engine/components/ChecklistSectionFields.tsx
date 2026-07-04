import { useFormContext } from 'react-hook-form';
import { ChecklistItem } from '../../components/ui/ChecklistItem';
import type { ChecklistSectionConfig, OutcomeSectionConfig } from '../types';

interface ChecklistSectionFieldsProps {
  section: ChecklistSectionConfig | OutcomeSectionConfig;
  /** Outcome sections lay out as a 2-column grid; plain checklists stack. */
  layout?: 'stack' | 'grid';
}

export function ChecklistSectionFields({ section, layout = 'stack' }: ChecklistSectionFieldsProps) {
  const { watch, setValue } = useFormContext();
  const values = watch(section.id) as Record<string, boolean> | undefined;

  const toggle = (itemId: string) => {
    setValue(`${section.id}.${itemId}`, !values?.[itemId], { shouldDirty: true, shouldTouch: true });
  };

  return (
    <div className={layout === 'grid' ? 'grid grid-cols-1 gap-2.5 sm:grid-cols-2' : 'flex flex-col gap-2.5'}>
      {section.items.map((item) => (
        <ChecklistItem
          key={item.id}
          id={`${section.id}-${item.id}`}
          label={item.label}
          checked={!!values?.[item.id]}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}
