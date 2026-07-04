import { z } from 'zod';
import type { ChecklistConfig, FieldConfig, SectionConfig } from './types';

const phoneRegex = /^[\d\s()+.-]{7,20}$/;

function zodForField(field: FieldConfig): z.ZodTypeAny {
  let base: z.ZodTypeAny;

  switch (field.type) {
    case 'email':
      base = z.string().email(`Enter a valid ${field.label.toLowerCase()}`);
      break;
    case 'phone':
      base = z.string().regex(phoneRegex, `Enter a valid ${field.label.toLowerCase()}`);
      break;
    default:
      base = z.string();
  }

  if (!field.required) {
    // Still validate format when a value IS present, but allow empty.
    return z.union([z.literal(''), base]);
  }

  if (field.type === 'email' || field.type === 'phone') {
    return base; // already enforces non-empty via regex/email
  }

  return (base as z.ZodString).min(1, `${field.label} is required`);
}

function schemaForSection(section: SectionConfig): z.ZodTypeAny {
  switch (section.type) {
    case 'form': {
      const shape: Record<string, z.ZodTypeAny> = {};
      for (const field of section.fields) {
        shape[field.id] = zodForField(field);
      }
      return z.object(shape);
    }
    case 'checklist':
    case 'outcome':
      return z.record(z.string(), z.boolean());
    case 'notes':
      return z.string();
    default:
      return z.any();
  }
}

export function buildZodSchema(config: ChecklistConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const section of config.sections) {
    shape[section.id] = schemaForSection(section);
  }
  return z.object(shape);
}

/** Field paths (e.g. "signer.signerName") that must pass validation before
 *  a section's "Save & Continue" can advance the workflow. Optional
 *  sections and optional fields are excluded. */
export function requiredFieldPaths(section: SectionConfig): string[] {
  if (section.optional || section.type !== 'form') return [];
  return section.fields.filter((f) => f.required).map((f) => `${section.id}.${f.id}`);
}
