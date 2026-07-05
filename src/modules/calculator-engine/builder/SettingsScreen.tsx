import { useState } from "react";
import {
  Settings,
  Globe,
  Mail,
  Palette,
  CheckCircle,
  Database,
  Link,
  Shield,
  RefreshCw,
  Sliders,
  Check
} from "lucide-react";

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState("branding");
  const [saveStatus, setSaveStatus] = useState(false);

  // Styling inputs
  const [fontFamily, setFontFamily] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState("12px");
  const [customCss, setCustomCss] = useState(
    "/* Custom override styles */\n.bgrowth-preview-panel {\n  box-shadow: 0 10px 40px rgba(13, 27, 76, 0.05);\n}"
  );

  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState("https://api.hubspot.com/v1/webhooks/calculator-leads-capture");
  const [syncDelay, setSyncDelay] = useState(5);

  // Custom domains
  const [customDomain, setCustomDomain] = useState("calculator.mybusiness.com");

  // Email
  const [emailFromName, setEmailFromName] = useState("BGrowth Pricing Team");
  const [emailSubject, setEmailSubject] = useState("Your customized calculator quote estimation details");

  const handleSave = () => {
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const menuItems = [
    { id: "branding", label: "Branding & Styles", icon: Palette },
    { id: "integrations", label: "Webhook Integrations", icon: Database },
    { id: "domains", label: "Embed Domains", icon: Globe },
    { id: "notifications", label: "Notification Workflow", icon: Mail },
  ];

  return (
    <div id="settings-admin-screen" className="space-y-6">
      {/* Upper Banner */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0D1B4C] flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#1061EC]" />
            Calculator Engine Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure system-wide administrative variables, sync third-party lead webhooks, and map branding domains.
          </p>
        </div>

        {/* Global Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-all self-start md:self-auto"
        >
          {saveStatus ? <Check className="h-4.5 w-4.5" /> : <RefreshCw className={`h-4 w-4 ${saveStatus ? "animate-spin" : ""}`} />}
          <span>{saveStatus ? "Settings Saved!" : "Save Configuration"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left menu selection */}
        <div className="md:col-span-1 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)] space-y-1 self-start">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                  isActive
                    ? "bg-[#1061EC] text-white shadow-md shadow-blue-500/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Active screen */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-h-[400px]">
          {/* 1. BRANDING STYLE CARD */}
          {activeTab === "branding" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0D1B4C]">Branding, Fonts & Aesthetics</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Customize global styles of widget iframe shells dynamically.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Theme Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="Inter">Inter (Swiss Modern, Minimal)</option>
                    <option value="Space Grotesk">Space Grotesk (Tech, Display)</option>
                    <option value="JetBrains Mono">JetBrains Mono (Technical, Code)</option>
                    <option value="Playfair Display">Playfair Display (Serif, Elegant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Border Radius Style</label>
                  <select
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="0px">Sharp corners (0px)</option>
                    <option value="8px">Subtle curve (8px)</option>
                    <option value="12px">Standard rounded (12px)</option>
                    <option value="20px">Generous curve (20px)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-bold uppercase">Custom Visual CSS Overrides</label>
                <textarea
                  rows={4}
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-[#1061EC]"
                />
              </div>
            </div>
          )}

          {/* 2. WEBHOOK PIPELINES CARD */}
          {activeTab === "integrations" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0D1B4C]">Hubspot & Salesforce Integration pipelines</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Stream completed calculation payloads directly to CRM software instantly.</p>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Target Webhook URL Endpoint</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#1061EC]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Lead Synced Threshold (Secs)</label>
                    <input
                      type="number"
                      value={syncDelay}
                      onChange={(e) => setSyncDelay(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Webhooks payload type</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800">
                      <option>JSON Raw Payload</option>
                      <option>Multipart Form Data</option>
                      <option>HubSpot Lead Standard</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. EMBED DOMAINS CARD */}
          {activeTab === "domains" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0D1B4C]">Custom Domains & Embedded Security</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Authorize specific domains or mask default pricing URLs.</p>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Custom domain redirect mask</label>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-400 font-bold">https://</span>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start">
                  <Globe className="h-4.5 w-4.5 text-[#1061EC] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">DNS Pointing Parameters Required</span>
                    <p className="text-[11px] text-slate-500 leading-normal mt-1">
                      Configure your registrar's DNS records to point an <b>A Record</b> to <code>76.223.10.155</code> or a <b>CNAME</b> to <code>domains.bgrowth-engine.com</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. NOTIFICATION WORKFLOWS */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0D1B4C]">Leads Auto-Responder notifications</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Generate and email result calculation PDFs to users instantly.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">From Sender Label Name</label>
                  <input
                    type="text"
                    value={emailFromName}
                    onChange={(e) => setEmailFromName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Auto-Attach results PDF</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800">
                    <option>Yes, attach dynamic PDF</option>
                    <option>No, send plain email results only</option>
                    <option>Do not send auto-responder</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 font-semibold text-slate-700">
                <label className="block text-[10px] text-slate-500 font-bold uppercase">Lead Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
