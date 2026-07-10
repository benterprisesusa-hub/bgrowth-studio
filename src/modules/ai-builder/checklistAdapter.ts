import type { ChecklistConfig } from '../../engine/types';
import type { DigitalProduct } from './types';

export function toChecklistConfig(product: DigitalProduct): ChecklistConfig {
  const tasks = product.content.checklist?.tasks ?? [];

  if (tasks.length === 0) {
    throw new Error('The generated product does not contain checklist tasks.');
  }

  return {
    productId: `ai-${product.id}`,
    brand: {
      name: product.structure.name || 'AI Generated Checklist',
      companyLabel: 'BGrowth Studio',
      primaryColor: '#1061EC',
    },
    footer: {
      proTip: 'Review each step before marking it complete.',
      helpText: 'Created with BGrowth Studio.',
    },
    sections: tasks.map((task, sectionIndex) => ({
      id: `ai-${product.id}-section-${sectionIndex + 1}`,
      number: sectionIndex + 1,
      type: 'checklist' as const,
      title: task.title || `Section ${sectionIndex + 1}`,
      description: task.description || '',
      icon: 'check-square',
      whyItMatters: task.whyItMatters || undefined,
      tip: task.tips?.[0] || undefined,
      items: (task.subtasks ?? []).map((subtask, itemIndex) => ({
        id: `ai-${product.id}-section-${sectionIndex + 1}-item-${itemIndex + 1}`,
        label: subtask,
      })),
    })),
  };
}
