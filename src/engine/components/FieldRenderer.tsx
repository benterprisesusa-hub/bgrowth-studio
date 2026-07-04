import { useFormContext } from 'react-hook-form';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { FormField } from '../../components/ui/FormField';
import { getIcon } from '../icons';
import type { FieldConfig } from '../types';

interface FieldRendererProps {
  sectionId: string;
  field: FieldConfig;
}

export function FieldRenderer({ sectionId, field }: FieldRendererProps) {
  const { register, formState: { errors } } = useFormContext();
  const Icon = getIcon(field.icon);
  const fieldId = `${sectionId}-${field.id}`;
  const path = `${sectionId}.${field.id}`;
  const sectionErrors = (errors[sectionId] as Record<string, { message?: string }> | undefined) ?? {};
  const errorMessage = sectionErrors[field.id]?.message;

  return (
    <FormField
      label={field.label}
      icon={<Icon />}
      required={field.required}
      error={errorMessage}
      htmlFor={fieldId}
      className={field.fullWidth ? 'sm:col-span-2' : undefined}
    >
      {field.type === 'select' ? (
        <Select id={fieldId} hasError={!!errorMessage} {...register(path)}>
          <option value="">Select…</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      ) : field.type === 'textarea' ? (
        <Textarea
          id={fieldId}
          placeholder={field.placeholder}
          hasError={!!errorMessage}
          className={field.required ? undefined : 'min-h-[44px]'}
          {...register(path)}
        />
      ) : (
        <Input
          id={fieldId}
          type={field.type === 'phone' ? 'tel' : field.type}
          placeholder={field.placeholder}
          hasError={!!errorMessage}
          {...register(path)}
        />
      )}
    </FormField>
  );
}
