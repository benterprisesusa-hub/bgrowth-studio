import { useState } from 'react';
import {
  Paperclip, Calendar, Clock, CheckCircle2, AlertTriangle, Info, XCircle,
  Download, ExternalLink, ChevronRight, BookOpen, ChevronDown, Copy, Check
} from 'lucide-react';
import type { KnowledgeItem, ContentBlock, Attachment, RelatedContentItem } from './types';
import { MOCK_AUTHORS } from './mockData';

interface PreviewProps {
  item: KnowledgeItem;
}

export function Preview({ item }: PreviewProps) {
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<Record<string, boolean>>({});

  const author = MOCK_AUTHORS.find(a => a.id === item.authorId) || MOCK_AUTHORS[0];
  const headings = item.blocks.filter(b => b.type === 'heading');

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedBlockId(id);
      setTimeout(() => setCopiedBlockId(null), 2000);
    });
  };

  const toggleFaq = (idx: string) => setActiveFaq(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-navy-900 pb-16 font-sans">
      <div className="no-print bg-slate-900 px-6 py-2 text-center text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 border-b border-slate-800">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        Live Website Preview — Renders content exactly as shown on the BGrowth Knowledge portal.
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <div className="flex items-center gap-1.5 text-xs font-medium text-navy-400">
          <span>Knowledge Base</span>
          <ChevronRight className="h-3 w-3" />
          <span className="hover:text-brand-600 cursor-pointer">{item.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-navy-800 truncate max-w-[200px]">{item.title}</span>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-blue-600">{item.contentType}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${item.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600' : item.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
              {item.difficulty}
            </span>
            <span className="text-xs text-navy-400 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {item.readingTime || '5 min read'}</span>
            <span className="text-xs text-navy-400 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {item.lastUpdated}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl max-w-4xl">{item.title || 'Untitled'}</h1>
          <p className="text-lg text-navy-500 font-medium leading-relaxed max-w-3xl border-l-2 border-slate-200 pl-4 py-1 italic">{item.excerpt || 'No excerpt provided.'}</p>

          <div className="flex items-center gap-3 border-t border-b border-navy-50 py-4 mt-6">
            <img src={author.avatar} alt={author.name} className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-white" />
            <div>
              <p className="text-xs font-bold text-navy-400 uppercase tracking-wide">Published By</p>
              <h4 className="text-sm font-extrabold text-navy-800">{author.name}</h4>
              <p className="text-xs text-navy-400">{author.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <article className="lg:col-span-8 bg-white border border-navy-50/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {item.featuredImage && (
            <div className="overflow-hidden rounded-xl shadow-sm border border-navy-50">
              <img src={item.featuredImage} alt="Featured" className="w-full h-auto max-h-[350px] object-cover" />
            </div>
          )}

          {item.blocks && item.blocks.length > 0 ? item.blocks.map((block: ContentBlock) => {
            switch (block.type) {
              case 'paragraph':
                return <p key={block.id} className="text-base text-navy-700 leading-relaxed whitespace-pre-wrap">{block.data?.text || ''}</p>;

              case 'heading': {
                const level = block.data?.level || 2;
                const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                const cls = level === 1 ? 'text-2xl font-extrabold text-navy-900 border-b border-navy-50 pb-2 mt-8' : level === 2 ? 'text-xl font-extrabold text-navy-900 mt-6' : 'text-lg font-bold text-navy-800 mt-4';
                return <Tag key={block.id} id={block.id} className={cls}>{block.data?.text || 'Heading'}</Tag>;
              }

              case 'image':
                return (
                  <div key={block.id} className="my-6 space-y-2">
                    <img src={block.data?.url || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600'} alt={block.data?.caption || ''} className="rounded-lg max-h-96 w-full object-cover border border-navy-50" />
                    {block.data?.caption && <p className="text-center text-xs text-navy-400 italic">{block.data.caption}</p>}
                  </div>
                );

              case 'quote':
                return (
                  <blockquote key={block.id} className="border-l-4 border-brand-500 bg-blue-50/25 py-3 px-5 rounded-r-xl italic my-6">
                    <p className="text-base text-navy-800 leading-relaxed font-medium">"{block.data?.text || ''}"</p>
                    {block.data?.citation && <cite className="block text-xs font-bold text-navy-400 mt-2 not-italic">— {block.data.citation}</cite>}
                  </blockquote>
                );

              case 'callout': {
                const t = block.data?.type || 'info';
                return (
                  <div key={block.id} className={`flex gap-3 rounded-xl p-4 my-5 border ${t === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' : t === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : t === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-blue-50/60 border-blue-100 text-blue-800'}`}>
                    <div className="shrink-0 mt-0.5">
                      {t === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                      {t === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                      {t === 'error' && <XCircle className="h-5 w-5 text-rose-500" />}
                      {t === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div>
                      {block.data?.title && <h5 className="font-extrabold text-sm">{block.data.title}</h5>}
                      <p className="text-sm leading-relaxed mt-0.5">{block.data?.text || ''}</p>
                    </div>
                  </div>
                );
              }

              case 'checklist':
                return (
                  <div key={block.id} className="border border-navy-50 rounded-xl p-5 my-6 bg-slate-50/20">
                    {block.data?.title && <h4 className="font-extrabold text-sm text-navy-800 mb-3 uppercase tracking-wide">{block.data.title}</h4>}
                    <ul className="space-y-2.5">
                      {(block.data?.items || []).map((item: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-navy-700">
                          <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                          <span>{item.text || ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );

              case 'faq':
                return (
                  <div key={block.id} className="space-y-3 my-6">
                    {(block.data?.questions || []).map((faq: any, idx: number) => {
                      const sId = `${block.id}-${idx}`;
                      const isOpen = !!activeFaq[sId];
                      return (
                        <div key={idx} className="border border-navy-50 rounded-xl overflow-hidden bg-white shadow-sm">
                          <button onClick={() => toggleFaq(sId)} className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-navy-800 hover:bg-slate-50">
                            <span>{faq.q || 'Question...'}</span>
                            <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && <div className="p-4 border-t border-navy-50 text-sm text-navy-600 leading-relaxed bg-slate-50/20">{faq.a || ''}</div>}
                        </div>
                      );
                    })}
                  </div>
                );

              case 'comparison': {
                const headers = block.data?.headers || [];
                const rows = block.data?.rows || [];
                return (
                  <div key={block.id} className="overflow-x-auto rounded-xl border border-navy-50 shadow-sm my-6">
                    <table className="min-w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-navy-500 border-b border-navy-50">
                        <tr>{headers.map((h: string, i: number) => <th key={i} className="px-4 py-3">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-navy-50 font-medium text-navy-700 bg-white">
                        {rows.map((row: string[], rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-slate-50/35">
                            {row.map((val: string, cIdx: number) => <td key={cIdx} className="px-4 py-3 whitespace-pre-wrap">{val}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              case 'download':
                return (
                  <div key={block.id} className="flex items-center justify-between gap-4 p-5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/20 my-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0"><Download className="h-5 w-5" /></div>
                      <div>
                        <h5 className="font-extrabold text-sm text-navy-800">{block.data?.filename || 'Attachment'}</h5>
                        <p className="text-xs text-navy-400">{block.data?.size || ''}</p>
                      </div>
                    </div>
                    <a href={block.data?.url || '#'} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                      Download <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                );

              case 'cta':
                return (
                  <div key={block.id} className="p-6 rounded-2xl bg-gradient-to-br from-brand-600 to-blue-800 text-white my-6 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-lg mx-auto">
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">{block.data?.type || 'CTA'}</span>
                      <h4 className="mt-2.5 text-lg font-extrabold">{block.data?.title || 'Call to Action'}</h4>
                      <p className="mt-2 text-xs leading-relaxed text-blue-100">{block.data?.description || ''}</p>
                      <a href={block.data?.linkUrl || '#'} className="mt-5 inline-flex items-center gap-1 px-5 py-2 bg-white hover:bg-slate-50 text-brand-600 rounded-xl text-xs font-extrabold">
                        {block.data?.buttonText || 'Learn More'} <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );

              case 'divider': {
                const style = block.data?.style || 'solid';
                return <hr key={block.id} className={`my-8 border-navy-100 ${style === 'dashed' ? 'border-dashed' : style === 'dotted' ? 'border-dotted border-t-2' : ''}`} />;
              }

              case 'code': {
                const codeText = block.data?.code || '';
                const codeLang = block.data?.language || 'javascript';
                return (
                  <div key={block.id} className="rounded-xl overflow-hidden bg-[#0F172A] border border-slate-800 text-slate-300 font-mono text-xs my-6">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase">
                      <span>{codeLang}</span>
                      <button onClick={() => handleCopyCode(block.id, codeText)} className="flex items-center gap-1 hover:text-white">
                        {copiedBlockId === block.id ? <><Check className="h-3 w-3 text-emerald-500" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto whitespace-pre"><code>{codeText}</code></pre>
                  </div>
                );
              }

              case 'video':
                return (
                  <div key={block.id} className="my-6 overflow-hidden rounded-xl border border-navy-50 bg-slate-900 text-white flex flex-col aspect-video items-center justify-center p-6 text-center">
                    <BookOpen className="h-12 w-12 text-slate-500 mb-3" />
                    <p className="text-sm font-extrabold">Video Resource</p>
                    <p className="text-xs text-slate-400 mt-1 truncate max-w-sm">{block.data?.url || 'No URL'}</p>
                    {block.data?.url && (
                      <a href={block.data.url} target="_blank" rel="noreferrer" className="mt-4 px-4 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        Open <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                );

              default:
                return null;
            }
          }) : (
            <div className="text-center py-12 text-navy-300">
              <BookOpen className="h-10 w-10 mx-auto stroke-1" />
              <p className="mt-2 text-xs">No content blocks added yet.</p>
            </div>
          )}
        </article>

        <aside className="lg:col-span-4 space-y-6">
          {headings.length > 0 && (
            <div className="rounded-2xl border border-navy-50 bg-white p-5 shadow-card">
              <h4 className="text-xs font-black uppercase tracking-widest text-navy-400 mb-3">Table of Contents</h4>
              <nav className="space-y-2">
                {headings.map((heading: ContentBlock) => {
                  const lvl = heading.data?.level || 2;
                  return (
                    <a key={heading.id} href={`#${heading.id}`} className={`block text-xs font-bold text-navy-500 hover:text-brand-600 truncate ${lvl === 3 ? 'pl-3 text-[11px] font-medium border-l border-slate-100' : ''}`}>
                      {heading.data?.text || 'Heading'}
                    </a>
                  );
                })}
              </nav>
            </div>
          )}

          {item.attachments && item.attachments.length > 0 && (
            <div className="rounded-2xl border border-navy-50 bg-white p-5 shadow-card">
              <h4 className="text-xs font-black uppercase tracking-widest text-navy-400 mb-3">Attachments</h4>
              <div className="space-y-3">
                {item.attachments.map((att: Attachment) => (
                  <div key={att.id} className="flex items-center justify-between p-2.5 rounded-xl border border-navy-50 bg-slate-50/40 hover:bg-slate-50">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Paperclip className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-navy-800 truncate">{att.name}</p>
                        <p className="text-[10px] text-navy-400">{att.type} · {att.size}</p>
                      </div>
                    </div>
                    <a href={att.url} className="ml-2 h-7 w-7 rounded-lg bg-white border border-navy-50 text-navy-500 hover:border-brand-500 hover:text-brand-600 flex items-center justify-center shrink-0">
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.relatedContent && item.relatedContent.length > 0 && (
            <div className="rounded-2xl border border-navy-50 bg-white p-5 shadow-card">
              <h4 className="text-xs font-black uppercase tracking-widest text-navy-400 mb-3">Related Content</h4>
              <div className="space-y-2.5">
                {item.relatedContent.map((rel: RelatedContentItem) => (
                  <a key={rel.id} href={rel.url} className="group block p-3 rounded-xl border border-navy-50 bg-white hover:border-blue-300 hover:bg-blue-50/5">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-navy-500">{rel.type}</span>
                    <h5 className="text-xs font-extrabold text-navy-800 mt-1.5 group-hover:text-brand-600 line-clamp-2">{rel.title}</h5>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-navy-50 bg-white p-5 shadow-card text-center">
            <img src={author.avatar} alt={author.name} className="h-16 w-16 rounded-full mx-auto object-cover border-2 border-slate-100 shadow-sm" />
            <h4 className="mt-3 text-sm font-extrabold text-navy-800">{author.name}</h4>
            <p className="text-xs text-brand-600 font-semibold">{author.role}</p>
            <p className="mt-2 text-xs leading-relaxed text-navy-400">{author.bio}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
