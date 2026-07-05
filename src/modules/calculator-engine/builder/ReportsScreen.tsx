import { useState } from "react";
import {
  BarChart3,
  Search,
  Download,
  Filter,
  CheckCircle,
  Calendar,
  Users,
  Clock,
  ChevronDown,
  TrendingUp,
  Award,
  DollarSign,
  Briefcase
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from "recharts";

export default function ReportsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Stats row details
  const stats = [
    { label: "Total Calculator Uses", value: "12,410", desc: "+14.2% from last month", icon: Users, color: "#1061EC" },
    { label: "Form Conversion Rate", value: "68.2%", desc: "CTR of active capture fields", icon: TrendingUp, color: "#22C55E" },
    { label: "Total Synced Leads", value: "8,460", desc: "Successfully saved to HubSpot", icon: Award, color: "#8B5CF6" },
    { label: "Avg completion time", value: "1m 45s", desc: "Low friction and churn rate", icon: Clock, color: "#F59E0B" },
  ];

  // Daily submissions data series
  const dailySubmissions = [
    { date: "Jun 20", uses: 320, leads: 220 },
    { date: "Jun 21", uses: 410, leads: 280 },
    { date: "Jun 22", uses: 380, leads: 240 },
    { date: "Jun 23", uses: 490, leads: 350 },
    { date: "Jun 24", uses: 510, leads: 390 },
    { date: "Jun 25", uses: 440, leads: 300 },
    { date: "Jun 26", uses: 480, leads: 340 },
    { date: "Jun 27", uses: 590, leads: 410 },
    { date: "Jun 28", uses: 620, leads: 430 },
    { date: "Jun 29", uses: 550, leads: 380 },
    { date: "Jun 30", uses: 580, leads: 390 },
    { date: "Jul 01", uses: 690, leads: 490 },
    { date: "Jul 02", uses: 710, leads: 510 },
    { date: "Jul 03", uses: 640, leads: 450 },
    { date: "Jul 04", uses: 680, leads: 470 },
  ];

  // Top conversion sources series
  const trafficSources = [
    { name: "Webflow Embed", value: 5240, color: "#1061EC" },
    { name: "Direct Link URL", value: 3120, color: "#8B5CF6" },
    { name: "WordPress Block", value: 2430, color: "#F59E0B" },
    { name: "HubSpot Iframe", value: 1620, color: "#22C55E" },
  ];

  // Recent calculator submissions log
  const submissionLogs = [
    { id: "log-1", email: "martin.fowler@thoughtworks.com", calculator: "SaaS Project ROI", output: "$114,200", status: "Synced", date: "Today, 14:32" },
    { id: "log-2", email: "clara.oswald@gmail.com", calculator: "Cleaning Quote Estimator", output: "$284.00", status: "Synced", date: "Today, 13:15" },
    { id: "log-3", email: "jonathan.b@marketingteam.co", calculator: "SaaS Project ROI", output: "$65,000", status: "Synced", date: "Today, 11:04" },
    { id: "log-4", email: "hannah.abbott@hogwarts.edu", calculator: "Cleaning Quote Estimator", output: "$415.00", status: "Synced", date: "Yesterday", statusText: "Synced" },
    { id: "log-5", email: "richard.hendricks@piedpiper.com", calculator: "SaaS Project ROI", output: "$2,450,000", status: "Synced", date: "Yesterday" },
    { id: "log-6", email: "brent.spiner@starfleet.mil", calculator: "Cleaning Quote Estimator", output: "$180.00", status: "Synced", date: "3 days ago" },
  ];

  const handleExportCSV = () => {
    setCopiedSuccess(true);
    alert("Export complete! Synced CSV package with 12,410 submission rows has been compiled and saved to downloads folder.");
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const filteredLogs = submissionLogs.filter((log) =>
    log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.calculator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.output.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="reports-analytics-screen" className="space-y-6">
      {/* Upper Banner */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0D1B4C] flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#1061EC]" />
            Reports & Submission Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyze conversion traffic, lead retention CTR logs, and complete calculator calculation entries.
          </p>
        </div>

        {/* Export CSV CTA */}
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-all self-start md:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Export Calculation Logs (CSV)</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                <span className="text-xl font-extrabold text-[#0D1B4C] mt-1 block tracking-tight">{stat.value}</span>
                <p className="text-[9px] text-slate-500 mt-0.5">{stat.desc}</p>
              </div>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: stat.color }}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0D1B4C]">Completed Submissions Timeline</h3>
              <p className="text-[11px] text-slate-400">Comparing complete calculations vs. successfully capture leads.</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-[#1061EC]" />
                <span>Calculations done</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                <span>Leads Captured</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySubmissions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1061EC" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1061EC" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: 600, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: 600, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="uses" stroke="#1061EC" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUses)" />
                <Area type="monotone" dataKey="leads" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic channel Doughnut */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#0D1B4C]">Lead Capture Channels</h3>
            <p className="text-[11px] text-slate-400">Total volume grouped by deployment environment.</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [val.toLocaleString(), "Leads"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Total Captured</span>
              <span className="text-lg font-extrabold text-[#0D1B4C]">12.4K</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {trafficSources.map((src) => (
              <div key={src.name} className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                  <span>{src.name}</span>
                </div>
                <span className="font-mono font-bold text-[#0D1B4C]">{src.value.toLocaleString()} ({Math.round(src.value / 12410 * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submission log table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#0D1B4C]">Lead Calculation Log Entries</h3>
            <p className="text-[11px] text-slate-400">Review detailed input metadata and email submissions.</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or calculator..."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Lead Email Address</th>
                <th className="py-3 px-4">Active Calculator</th>
                <th className="py-3 px-4">Computed Output</th>
                <th className="py-3 px-4">Hubspot Sync Status</th>
                <th className="py-3 px-4">Submitted Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{log.email}</td>
                  <td className="py-3.5 px-4 text-slate-500">{log.calculator}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1061EC]">{log.output}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Synced
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-medium">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
