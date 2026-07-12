import { useFormContext } from 'react-hook-form';
import { Bold, Italic, List } from 'lucide-react';
import { useRef } from 'react';

interface RichTextareaProps {
  id: string;
  placeholder?: string;
  hasError?: boolean;
  path: string;
}

export function RichTextarea({ id, placeholder, hasError, path }: RichTextareaProps) {
  const { setValue, watch } = useFormContext();
  const value = (watch(path) as string) ?? '';
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrap = (before: string, after: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
    setValue(path, newValue, { shouldDirty: true });
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertList = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const newValue = value.slice(0, start) + '\n• ' + value.slice(start);
    setValue(path, newValue, { shouldDirty: true });
    setTimeout(() => { el.focus(); el.setSelectionRange(start + 3, start + 3); }, 0);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <button type="button" onClick={() => wrap('**', '**')}
          className="flex h-7 w-7 items-center justify-center rounded border border-navy-100 bg-white text-navy-500 hover:bg-navy-50 hover:text-navy-800"
          title="Bold">
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => wrap('_', '_')}
          className="flex h-7 w-7 items-center justify-center rounded border border-navy-100 bg-white text-navy-500 hover:bg-navy-50 hover:text-navy-800"
          title="Italic">
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={insertList}
          className="flex h-7 w-7 items-center justify-center rounded border border-navy-100 bg-white text-navy-500 hover:bg-navy-50 hover:text-navy-800"
          title="List">
          <List className="h-3.5 w-3.5" />
        </button>
      </div>
      <textarea
        ref={ref}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(path, e.target.value, { shouldDirty: true })}
        className={`min-h-[80px] w-full resize-y rounded-lg border px-3 py-2 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-brand/30 ${hasError ? 'border-red-400' : 'border-navy-100'}`}
      />
    </div>
  );
}
