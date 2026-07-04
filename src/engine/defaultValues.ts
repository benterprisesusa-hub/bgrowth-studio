import type { ChecklistConfig, ChecklistData } from './types';

export function buildDefaultValues(config: ChecklistConfig): ChecklistData {
  const data: ChecklistData = {};

  for (const section of config.sections) {
    switch (section.type) {
      case 'form': {
        const fields: Record<string, string> = {};
        for (const field of section.fields) fields[field.id] = '';
        data[section.id] = fields;
        break;
      }
      case 'checklist':
      case 'outcome':
        data[section.id] = {};
        break;
      case 'notes':
        data[section.id] = '';
        break;
    }
  }

  return data;
}
