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

  if (field.type === 'title') {
    return (
      <div className="sm:col-span-2 mt-4 first:mt-0 pb-1 border-b border-navy-50/50">
        <h3 className="text-base font-bold text-navy-800 tracking-tight">
          {field.label}
        </h3>
      </div>
    );
  }

  if (field.type === 'static_text') {
    return (
      <div className="sm:col-span-2 pt-1">
        <p className="text-sm text-navy-500 leading-relaxed whitespace-pre-wrap">{field.label}</p>
      </div>
    );
  }

  return (
    <FormField
      label={field.label}
      icon={<Icon />}
      required={field.required}
      error={errorMessage}
      htmlFor={fieldId}
      className={field.fullWidth ? 'sm:col-span-2' : undefined}
    >
      {field.type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            id={fieldId}
            type="checkbox"
            className="h-4 w-4 rounded accent-brand"
            {...register(path)}
          />
          <span className="text-sm text-navy-700">{field.placeholder || field.label}</span>
        </label>
      ) : field.type === 'select' ? (
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
