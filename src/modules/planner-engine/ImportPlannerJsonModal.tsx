import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ImportPlannerJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (plannerData: any) => void;
}

export function ImportPlannerJsonModal({ isOpen, onClose, onImport }: ImportPlannerJsonModalProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFillExample = () => {
    const example = {
      id: `imported-planner-${Date.now()}`,
      settings: {
        name: "Planejador de Metas Semanais",
        description: "Planeje e monitore suas atividades semanais de alta performance.",
        icon: "🎯",
        primaryColor: "#7C3AED",
        accentColor: "#1E1B4B",
        category: "Produtividade",
      },
      blocks: [
        {
          id: `b-1-${Math.random().toString(36).slice(2, 6)}`,
          title: "Foco Principal da Semana",
          description: "Defina seus objetivos cruciais de negócio.",
          icon: "🚀",
          color: "#7C3AED",
          enabled: true,
          config: {
            type: "goals",
            goals: [
              { id: "g1", label: "Meta de Vendas: Conectar com 10 leads qualificados", placeholder: "" },
              { id: "g2", label: "Entrega técnica da sprint principal", placeholder: "" }
            ]
          }
        },
        {
          id: `b-2-${Math.random().toString(36).slice(2, 6)}`,
          title: "Checklist de Rotina Diária",
          description: "Ações essenciais que devem ser feitas todos os dias.",
          icon: "✅",
          color: "#059669",
          enabled: true,
          config: {
            type: "checklist",
            items: [
              { id: "i1", label: "Revisar as métricas de conversão de anúncios", required: true },
              { id: "i2", label: "Responder todos os e-mails e mensagens de suporte", required: true },
              { id: "i3", label: "Postar atualização de conteúdo no LinkedIn", required: false }
            ],
            allowAddItems: true
          }
        }
      ]
    };
    setJsonText(JSON.stringify(example, null, 2));
    setError(null);
  };

  const handleImport = () => {
    setError(null);
    if (!jsonText.trim()) {
      setError('Por favor, cole a configuração JSON primeiro.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.settings?.name) {
        setError('O JSON do planejador precisa de uma propriedade "settings.name" definida.');
        return;
      }
      if (!Array.isArray(parsed.blocks)) {
        setError('O planejador precisa conter uma lista de "blocks" válida.');
        return;
      }

      onImport(parsed);
      setJsonText('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? `Erro de sintaxe JSON: ${err.message}` : 'Configuração JSON inválida.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-navy-100 bg-white shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-50 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-navy-900">Importar Planejador (JSON)</h3>
            <p className="text-xs text-navy-400">Insira a configuração JSON para adicionar um planejador imediatamente</p>
          </div>
          <button
            type="button"
            onClick={() => { setJsonText(''); setError(null); onClose(); }}
            className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4 flex justify-between items-center">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">
              Configuração JSON do Planejador
            </label>
            <button
              type="button"
              onClick={handleFillExample}
              className="text-xs font-semibold text-brand hover:text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              Preencher Exemplo
            </button>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => { setJsonText(e.target.value); setError(null); }}
            placeholder={`{\n  "settings": {\n    "name": "Meu Planejador de Projetos",\n    "description": "Exemplo",\n    "icon": "📋",\n    "primaryColor": "#1061EC",\n    "accentColor": "#0B1D3A",\n    "category": "Geral"\n  },\n  "blocks": []\n}`}
            className="h-72 w-full rounded-xl border border-navy-100 bg-white p-3 font-mono text-xs text-navy-800 placeholder-navy-300 shadow-sm focus:border-brand focus:outline-hidden focus:ring-1 focus:ring-brand"
          />

          <p className="mt-3 text-xs text-navy-400 leading-relaxed bg-navy-50/50 rounded-xl p-3">
            💡 <strong>Dica:</strong> Você pode exportar qualquer planejador de sua lista como JSON clicando no botão de download, alterá-lo e importá-lo aqui!
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-navy-50 px-5 py-4 bg-navy-50/30">
          <button
            type="button"
            onClick={() => { setJsonText(''); setError(null); onClose(); }}
            className="rounded-xl border border-navy-200 px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!jsonText.trim()}
            className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            Importar Planejador
          </button>
        </div>

      </div>
    </div>
  );
}
