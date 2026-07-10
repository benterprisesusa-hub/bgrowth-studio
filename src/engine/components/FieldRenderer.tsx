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
        <h3 className="text-base font-bold text-navy-800 tracking-tight flex items-center gap-2">
          {field.icon && <Icon className="h-4.5 w-4.5 text-brand shrink-0" />}
          <span>{field.label}</span>
        </h3>
      </div>
    );
  }

  if (field.type === 'static_text') {
    return (
      <div className="sm:col-span-2 text-sm text-navy-600 whitespace-pre-wrap leading-relaxed bg-navy-50/20 p-3.5 rounded-xl border border-navy-100/50">
        <div className="flex gap-2.5">
          {field.icon && <Icon className="h-4 w-4 text-navy-400 shrink-0 mt-0.5" />}
          <p className="flex-1 text-navy-600 font-medium">{field.label}</p>
        </div>
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
