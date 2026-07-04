import { ShieldCheck } from 'lucide-react';
import { ProgressCard } from './ProgressCard';
import { StepList, type StepListItem, type SectionId } from './StepList';
import { InfoCard } from './ui/InfoCard';

interface SidebarProps {
  percent: number;
  completed: number;
  total: number;
  items: StepListItem[];
  activeId: SectionId;
  onSelect: (id: SectionId) => void;
}

export function Sidebar({ percent, completed, total, items, activeId, onSelect }: SidebarProps) {
  return (
    <aside className="no-print flex w-full flex-col gap-4 lg:w-[280px] lg:shrink-0">
      <ProgressCard percent={percent} completed={completed} total={total} />
      <StepList items={items} activeId={activeId} onSelect={onSelect} />
      <InfoCard icon={<ShieldCheck />} title="Your Data is Safe" tone="brand">
        All information is stored locally in your browser. Nothing is sent to our servers.
      </InfoCard>
    </aside>
  );
}
