import { FieldRenderer } from './FieldRenderer';
import type { FormSectionConfig } from '../types';

export function FormSectionFields({ section }: { section: FormSectionConfig }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      {section.fields.map((field) => (
        <FieldRenderer key={field.id} sectionId={section.id} field={field} />
      ))}
    </div>
  );
}
