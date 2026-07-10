import { useState, useRef } from 'react';
import { X, Clipboard, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';

interface TemplateImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (sectionTitle: string, items: { label: string; description?: string }[]) => void;
}

export function TemplateImportModal({ isOpen, onClose, onImport }: TemplateImportModalProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'csv'>('paste');
  const [pasteText, setPasteText] = useState('');
  const [sectionTitle, setSectionTitle] = useState('Imported Checklist');
  const [firstLineAsTitle, setFirstLineAsTitle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<{ label: string; description?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePasteImport = () => {
    setError(null);
    const lines = pasteText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setError('Please paste some text first.');
      return;
    }

    let finalTitle = sectionTitle.trim() || 'Imported Checklist';
    let itemsToImport = lines;

    if (firstLineAsTitle && lines.length > 1) {
      finalTitle = lines[0];
      itemsToImport = lines.slice(1);
    }

    const items = itemsToImport.map((line) => ({
      label: line,
      description: '',
    }));

    onImport(finalTitle, items);
    resetForm();
    onClose();
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setCsvPreview([]);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setError('Please select a valid .csv or .txt file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setError('The file is empty.');
          return;
        }

        // Split into lines
        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
        if (lines.length === 0) {
          setError('No content found in the file.');
          return;
        }

        const parsedItems: { label: string; description?: string }[] = [];
        
        lines.forEach((line) => {
          // Check if line has comma/semicolon/tab separation
          let parts = [line];
          if (line.includes(';')) {
            parts = line.split(';');
          } else if (line.includes('\t')) {
            parts = line.split('\t');
          } else if (line.includes(',')) {
            // Basic CSV split, ignoring quotes for simplicity or handles basic commas
            parts = line.split(',');
          }

          const label = parts[0]?.replace(/^["']|["']$/g, '').trim();
          const description = parts[1]?.replace(/^["']|["']$/g, '').trim() || '';

          if (label) {
            parsedItems.push({ label, description });
          }
        });

        if (parsedItems.length === 0) {
          setError('Could not find any checklist items in the file.');
        } else {
          setCsvPreview(parsedItems);
          // Suggest title from file name
          const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          setSectionTitle(nameWithoutExt);
        }
      } catch (err) {
        setError('Error reading the file: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    };

    reader.readAsText(file);
  };

  const handleCsvImport = () => {
    if (csvPreview.length === 0) {
      setError('Please select and load a valid CSV file first.');
      return;
    }
    const finalTitle = sectionTitle.trim() || 'Imported Checklist';
    onImport(finalTitle, csvPreview);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPasteText('');
    setSectionTitle('Imported Checklist');
    setFirstLineAsTitle(false);
    setError(null);
    setCsvPreview([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-navy-100 bg-white shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-50 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-navy-900">Import Checklist Items</h3>
            <p className="text-xs text-navy-400">Quickly create checklist sections from Excel or Word</p>
          </div>
          <button
            type="button"
            onClick={() => { resetForm(); onClose(); }}
            className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-navy-50 px-5">
          <button
            type="button"
            onClick={() => { setActiveTab('paste'); setError(null); }}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition-all ${
              activeTab === 'paste'
                ? 'border-brand text-brand'
                : 'border-transparent text-navy-500 hover:text-navy-800'
            }`}
          >
            <Clipboard className="h-4 w-4" />
            Paste from Excel / Word
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('csv'); setError(null); }}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition-all ${
              activeTab === 'csv'
                ? 'border-brand text-brand'
                : 'border-transparent text-navy-500 hover:text-navy-800'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Upload CSV
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-5">
          
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section Title Field */}
          <div className="mb-4">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">
              Section Title
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              disabled={activeTab === 'paste' && firstLineAsTitle}
              placeholder="e.g. Safety Inspection Checklist"
              className="w-full rounded-xl border border-navy-100 bg-white px-3 py-2 text-sm text-navy-800 placeholder-navy-300 shadow-sm focus:border-brand focus:outline-hidden focus:ring-1 focus:ring-brand disabled:bg-navy-50 disabled:text-navy-400"
            />
          </div>

          {/* PASTE TAB */}
          {activeTab === 'paste' && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                  Paste Items (one per line)
                </label>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`Item 1: Check fire extinguisher pressure&#10;Item 2: Inspect emergency exit signs&#10;Item 3: Verify first aid kit is stocked`}
                  className="h-48 w-full rounded-xl border border-navy-100 bg-white p-3 font-mono text-xs text-navy-800 placeholder-navy-300 shadow-sm focus:border-brand focus:outline-hidden focus:ring-1 focus:ring-brand"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer py-1 text-xs font-medium text-navy-700">
                <input
                  type="checkbox"
                  checked={firstLineAsTitle}
                  onChange={(e) => setFirstLineAsTitle(e.target.checked)}
                  className="rounded border-navy-300 text-brand focus:ring-brand"
                />
                Use first line of pasted text as Section Title
              </label>

              <p className="text-xs text-navy-400 leading-relaxed bg-navy-50/50 rounded-xl p-3">
                💡 <strong>Tip:</strong> You can select a column directly in Excel, copy it, and paste it here! Each row in Excel will automatically become an individual checklist item.
              </p>
            </div>
          )}

          {/* CSV TAB */}
          {activeTab === 'csv' && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                  Choose CSV File
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.txt"
                  onChange={handleCsvFileChange}
                  className="w-full text-xs text-navy-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand hover:file:bg-brand-100 cursor-pointer"
                />
              </div>

              {csvPreview.length > 0 && (
                <div className="mt-2">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-navy-400">
                    Preview ({csvPreview.length} items found)
                  </p>
                  <div className="max-h-36 overflow-y-auto rounded-xl border border-navy-100 bg-navy-50/50 p-2 text-xs divide-y divide-navy-100">
                    {csvPreview.slice(0, 10).map((item, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between gap-4">
                        <span className="font-semibold text-navy-800 truncate">{item.label}</span>
                        {item.description && (
                          <span className="text-navy-400 text-[10px] truncate max-w-[50%]">{item.description}</span>
                        )}
                      </div>
                    ))}
                    {csvPreview.length > 10 && (
                      <div className="py-1.5 text-center text-[10px] font-semibold text-navy-400">
                        And {csvPreview.length - 10} more items...
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="text-xs text-navy-400 leading-relaxed bg-navy-50/50 rounded-xl p-3">
                💡 <strong>CSV Format:</strong> The first column will be the item's title. Optionally, the second column can be the item's helper description (separated by a semicolon <code>;</code> or comma <code>,</code>).
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-navy-50 px-5 py-4 bg-navy-50/30">
          <SecondaryButton size="sm" onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="sm"
            onClick={activeTab === 'paste' ? handlePasteImport : handleCsvImport}
            disabled={activeTab === 'paste' ? !pasteText.trim() : csvPreview.length === 0}
          >
            Import Checklist Section
          </PrimaryButton>
        </div>

      </div>
    </div>
  );
}
