import { useState } from 'react';
import { Settings } from 'lucide-react';
import { TemplatesScreen } from './TemplatesScreen';
import { InstancesScreen } from './InstancesScreen';
import { FillScreen } from './FillScreen';
import { NewInstanceDialog } from './NewInstanceDialog';
import { TemplateBuilderScreen } from './TemplateBuilderScreen';
import { SettingsScreen, loadSettings } from './SettingsScreen';
import { api_saveInstance, serializeData } from './api';
import { buildDefaultValues } from '../../engine/defaultValues';
import type { BuilderView, ChecklistInstance, ParsedTemplate } from './types';

type View = BuilderView | { screen: 'settings' };

interface ChecklistBuilderProps {
  ownerEmail: string;
}

export function ChecklistBuilder({ ownerEmail }: ChecklistBuilderProps) {
  const [view, setView] = useState<View>({ screen: 'templates' });
  const [creating, setCreating] = useState(false);
  const settings = loadSettings(ownerEmail);

  const goTemplates = () => setView({ screen: 'templates' });
  const goInstances = (template: ParsedTemplate) => setView({ screen: 'instances', template });
  const openFill = (template: ParsedTemplate, instance: ChecklistInstance) =>
    setView({ screen: 'fill', template, instance });
  const startNew = (template: ParsedTemplate) => setView({ screen: 'newInstance', template });

  const handleNewConfirm = async (template: ParsedTemplate, clientOrJobRef: string) => {
    setCreating(true);
    try {
      const instance = await api_saveInstance({
        templateId: template.templateId,
        ownerEmail: settings.ownerEmail || ownerEmail,
        clientOrJobRef,
        dataJson: serializeData(buildDefaultValues(template.config)),
        progressPercent: 0,
      });
      openFill(template, instance);
    } catch (e) {
      console.error('Failed to create instance', e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-[#f4f6fb]">
      {/* Settings gear button — always visible except inside fill/builder */}
      {view.screen !== 'fill' && view.screen !== 'builder' && view.screen !== 'settings' && (
        <button
          type="button"
          onClick={() => setView({ screen: 'settings' })}
          title="Settings"
          className="no-print fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-cardHover border border-navy-100 text-navy-500 hover:text-brand hover:border-brand transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      )}

      {view.screen === 'templates' && (
        <TemplatesScreen
          ownerEmail={settings.ownerEmail || ownerEmail}
          onOpen={goInstances}
          onNew={() => setView({ screen: 'builder' } as View)}
          onEdit={(draft) => setView({ screen: 'builder', existingDraft: draft } as View)}
        />
      )}

      {view.screen === 'settings' && (
        <SettingsScreen
          ownerEmail={ownerEmail}
          onBack={goTemplates}
        />
      )}

      {view.screen === 'builder' && (
        <TemplateBuilderScreen
          ownerEmail={settings.ownerEmail || ownerEmail}
          onBack={goTemplates}
          initialDraft={'existingDraft' in view ? view.existingDraft : undefined}
        />
      )}

      {view.screen === 'instances' && (
        <InstancesScreen
          template={view.template}
          ownerEmail={settings.ownerEmail || ownerEmail}
          onBack={goTemplates}
          onOpen={(inst) => openFill(view.template, inst)}
          onNew={() => startNew(view.template)}
        />
      )}

      {view.screen === 'fill' && (
        <FillScreen
          template={view.template}
          instance={view.instance}
          ownerEmail={settings.ownerEmail || ownerEmail}
          onBack={() => goInstances(view.template)}
        />
      )}

      {view.screen === 'newInstance' && (
        <>
          <InstancesScreen
            template={view.template}
            ownerEmail={settings.ownerEmail || ownerEmail}
            onBack={goTemplates}
            onOpen={(inst) => openFill(view.template, inst)}
            onNew={() => {}}
          />
          {!creating && (
            <NewInstanceDialog
              template={view.template}
              onConfirm={(ref) => handleNewConfirm(view.template, ref)}
              onCancel={() => goInstances(view.template)}
            />
          )}
          {creating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
