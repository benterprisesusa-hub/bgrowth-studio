import { useEffect, useState } from 'react';
import { ClipboardList, Plus, ChevronRight } from 'lucide-react';
import { ModuleHeader } from './ModuleHeader';
import { EmptyState } from './EmptyState';
import { PrimaryButton } from '../../components/ui/Button';
import { api_getInstances } from './api';
import { cn } from '../../lib/utils';
import type { ChecklistInstance, ParsedTemplate } from './types';

interface InstancesScreenProps {
  template: ParsedTemplate;
  ownerEmail: string;
  onBack: () => void;
  onOpen: (instance: ChecklistInstance) => void;
  onNew: () => void;
}

function ProgressPill({ percent, status }: { percent: number; status: string }) {
  const isComplete = status === 'Completed' || percent >= 100;
  return (
    <span
      className={cn(
        'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        isComplete ? 'bg-success-bg text-success-DEFAULT' : 'bg-brand-50 text-brand-700'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isComplete ? 'bg-success-DEFAULT' : 'bg-brand'
        )}
      />
      {isComplete ? 'Completed' : `${percent}%`}
    </span>
  );
}

export function InstancesScreen({ template, ownerEmail, onBack, onOpen, onNew }: InstancesScreenProps) {
  const [instances, setInstances] = useState<ChecklistInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api_getInstances(template.templateId, ownerEmail);
      setInstances(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [template.templateId, ownerEmail]);

  return (
    <div className="flex h-full flex-col">
      <ModuleHeader
        title={template.name}
        subtitle={`${instances.length} instance${instances.length !== 1 ? 's' : ''}`}
        onBack={onBack}
        backLabel="All Templates"
        actions={
          <PrimaryButton size="sm" onClick={onNew}>
            <Plus className="h-4 w-4" />
            New Fill
          </PrimaryButton>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
            <button onClick={load} className="ml-3 underline">Retry</button>
          </div>
        )}

        {!loading && !error && instances.length === 0 && (
          <EmptyState
            icon={<ClipboardList />}
            title="No fills yet"
            description={`Start your first fill of "${template.name}" for a client or job.`}
            actionLabel="Start first fill"
            onAction={onNew}
          />
        )}

        {!loading && !error && instances.length > 0 && (
          <ul className="flex flex-col gap-3">
            {instances.map((inst) => (
              <li key={inst.instanceId}>
                <button
                  type="button"
                  onClick={() => onOpen(inst)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 text-left shadow-card transition-shadow hover:shadow-cardHover sm:p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                    <ClipboardList className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-navy-800">
                      {inst.clientOrJobRef || 'Unnamed fill'}
                    </span>
                    <span className="block text-xs text-navy-400">
                      {new Date(inst.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center gap-2">
                    <ProgressPill percent={inst.progressPercent} status={inst.status} />
                    <ChevronRight className="h-4 w-4 text-navy-300" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
