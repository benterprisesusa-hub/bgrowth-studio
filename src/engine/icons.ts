import {
  User,
  Phone,
  Mail,
  Users,
  ShieldCheck,
  FileText,
  CalendarDays,
  Clock,
  MapPin,
  Building,
  Building2,
  Map,
  Hash,
  NotebookPen,
  UserRound,
  FileSearch,
  BookOpen,
  FileDigit,
  PenLine,
  Receipt,
  DollarSign,
  ClipboardList,
  FileCheck2,
  CheckCircle2,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

/**
 * String -> component lookup so configs can reference icons by name
 * (e.g. "user", "calendar-days") without importing React components.
 * Unknown names fall back to HelpCircle rather than throwing, so a typo
 * in a config never crashes the app.
 */
const ICON_REGISTRY: Record<string, LucideIcon> = {
  user: User,
  'user-round': UserRound,
  phone: Phone,
  mail: Mail,
  users: Users,
  'shield-check': ShieldCheck,
  'file-text': FileText,
  'calendar-days': CalendarDays,
  clock: Clock,
  'map-pin': MapPin,
  building: Building,
  'building-2': Building2,
  map: Map,
  hash: Hash,
  'notebook-pen': NotebookPen,
  'file-search': FileSearch,
  'book-open': BookOpen,
  'file-digit': FileDigit,
  'pen-line': PenLine,
  receipt: Receipt,
  'dollar-sign': DollarSign,
  'clipboard-list': ClipboardList,
  'file-check-2': FileCheck2,
  'check-circle-2': CheckCircle2,
};

export function getIcon(name: string): LucideIcon {
  return ICON_REGISTRY[name] ?? HelpCircle;
}
