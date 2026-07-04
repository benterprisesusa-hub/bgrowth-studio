import { useFormContext } from 'react-hook-form';
import { Textarea } from '../../components/ui/Textarea';
import type { NotesSectionConfig } from '../types';

export function NotesSectionField({ section }: { section: NotesSectionConfig }) {
  const { register } = useFormContext();

  return (
    <Textarea
      id={section.id}
      placeholder="Add any additional notes here…"
      className="min-h-[160px]"
      {...register(section.id)}
    />
  );
}
