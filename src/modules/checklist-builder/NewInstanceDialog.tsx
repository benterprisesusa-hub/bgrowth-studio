import { useState } from 'react';
import { UserRound } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { ParsedTemplate } from './types';

interface NewInstanceDialogProps {
  template: ParsedTemplate;
  onConfirm: (clientOrJobRef: string) => void;
  onCancel: () => void;
}

export function NewInstanceDialog({ template, onConfirm, onCancel }: NewInstanceDialogProps) {
  const [ref, setRef] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onConfirm(ref.trim());
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-cardHover"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand">
          <UserRound className="h-5 w-5" />
        </span>

        <h2 className="mt-4 text-lg font-bold text-navy-900">New fill — {template.name}</h2>
        <p className="mt-1 text-sm text-navy-500">
          Who is this checklist for? Add a client name, job ID, or any reference you'd like to identify this fill.
        </p>

        <div className="mt-5">
          <label htmlFor="clientOrJobRef" className="block text-[13px] font-medium text-navy-700">
            Client / Job Reference
          </label>
          <Input
            id="clientOrJobRef"
            className="mt-1.5"
            placeholder="e.g. Jane Doe — 720 Oak Ave"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            autoFocus
          />
          <p className="mt-1 text-xs text-navy-400">Optional — you can leave this blank and rename later.</p>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton onClick={() => onConfirm(ref.trim())}>Start fill</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
