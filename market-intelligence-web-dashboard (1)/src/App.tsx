import { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell,
} from 'recharts';

// =====================================================
// SAMPLE DATA - This will be replaced with Supabase data
// =====================================================

const flowData = [
  { week: 'Nov 3', dealer: -45, assetMgr: 82, leveraged: 125 },
  { week: 'Nov 10', dealer: -52, assetMgr: 95, leveraged: 138 },
  { week: 'Nov 17', dealer: -38, assetMgr: 88, leveraged: 142 },
  { week: 'Nov 24', dealer: -62, assetMgr: 105, leveraged: 155 },
  { week: 'Dec 1', dealer: -48, assetMgr: 112, leveraged: 148 },
  { week: 'Dec 8', dealer: -55, assetMgr: 98, leveraged: 162 },
  { week: 'Dec 15', dealer: -42, assetMgr: 125, leveraged: 175 },
  { week: 'Dec 22', dealer: -58, assetMgr: 132, leveraged: 168 },
];

const assets = [
  { id: 1, name: 'EUR/USD', category: 'G10 FX', net: 156200, delta4w: 45200, pct: 82, signal: 'Bullish', trend: 65 },
  { id: 2, name: 'GBP/USD', category: 'G10 FX', net: -33200, delta4w: -28900, pct: 24, signal: 'Bearish', trend: -42 },
  { id: 3, name: 'USD/JPY', category: 'G10 FX', net: 114500, delta4w: 34500, pct: 88, signal: 'Bullish', trend: 78 },
  { id: 4, name: 'AUD/USD', category: 'G10 FX', net: -60300, delta4w: 18200, pct: 18, signal: 'Neutral', trend: 12 },
  { id: 5, name: 'XAU/USD', category: 'Metals', net: 233500, delta4w: 67800, pct: 92, signal: 'Strong Buy', trend: 85 },
  { id: 6, name: 'CL', category: 'Energy', net: 272300, delta4w: -56400, pct: 45, signal: 'Bearish', trend: -35 },
  { id: 7, name: 'ES', category: 'Index', net: 425800, delta4w: 89400, pct: 78, signal: 'Bullish', trend: 58 },
  { id: 8, name: 'ZN', category: 'Rates', net: -285400, delta4w: -52600, pct: 12, signal: 'Bearish', trend: -72 },
];

const macroData = {
  regime: 'Risk On',
  confidence: 78,
  dxy: 102.45,
  dxyChange: -0.32,
  vix: 14.25,
  vixPct: 22,
  us10y: 4.28,
  curve2s10s: -18,
  riskAppetite: 68,
  liquidity: 72,
};

const analytics = [
  { label: 'Bullish Breakout', winRate: 62, meanReturn: 1.8, samples: 245, edge: 'Strong' },
  { label: 'Bearish Reversal', winRate: 58, meanReturn: 1.2, samples: 189, edge: 'Moderate' },
  { label: 'Trend Continuation', winRate: 55, meanReturn: 0.9, samples: 312, edge: 'Moderate' },
  { label: 'Mean Reversion', winRate: 51, meanReturn: 0.6, samples: 156, edge: 'Weak' },
  { label: 'Momentum Fade', winRate: 48, meanReturn: -0.2, samples: 98, edge: 'Weak' },
];

const reports = [
  { date: 'Dec 22, 2024', title: 'Weekly Market Review', summary: 'Risk appetite remains elevated with strong institutional buying in equities and gold. DXY weakness continues to support EM and commodities.' },
  { date: 'Dec 15, 2024', title: 'Positioning Update', summary: 'Leveraged funds increased long exposure in EUR/USD and Gold. Commercial hedgers remain net short across energy complex.' },
  { date: 'Dec 8, 2024', title: 'Macro Regime Shift', summary: 'Transition from neutral to risk-on regime detected. VIX term structure in steep contango suggesting low near-term vol expectations.' },
];

// =====================================================
// MAIN APP
// =====================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('flows');
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);

  return (
    <div style={{ minHeight: '100vh', background: '#08090d', color: '#e4e4e7' }}>
      {/* HEADER */}
      <header style={{
        height: 52,
        background: '#0c0d12',
        borderBottom: '1px solid #1e1f26',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'linear-gradient(135deg, #22c55e, #3b82f6)' }} />
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: 0.5 }}>FLOW TERMINAL</span>
          </div>
          
          <div style={{ width: 1, height: 24, background: '#1e1f26' }} />
          
          {/* Tabs */}
          <nav style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'flows', label: 'Positioning Flows' },
              { id: 'regime', label: 'Macro Regime' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'reports', label: 'Reports' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: activeTab === tab.id ? '#1e1f26' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#71717a',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 11, color: '#71717a' }}>Live</span>
          </div>
          <span style={{ fontSize: 11, color: '#52525b', fontFamily: 'monospace' }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
        {activeTab === 'flows' && (
          <FlowsPage 
            selectedAsset={selectedAsset} 
            setSelectedAsset={setSelectedAsset} 
          />
        )}
        {activeTab === 'regime' && <RegimePage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'reports' && <ReportsPage />}
      </main>
    </div>
  );
}

// =====================================================
// FLOWS PAGE
// =====================================================

function FlowsPage({ selectedAsset, setSelectedAsset }: { 
  selectedAsset: typeof assets[0]; 
  setSelectedAsset: (a: typeof assets[0]) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Positioning Flow Analysis</h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>12-week delta by trader type • CFTC TFF Report</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Legend color="#f87171" label="Dealers" />
          <Legend color="#2dd4bf" label="Asset Managers" />
          <Legend color="#fbbf24" label="Leveraged Funds" />
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Asset Selector */}
        <Card title="Assets">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {assets.map(asset => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: selectedAsset.id === asset.id ? '#1e1f26' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  borderLeft: selectedAsset.id === asset.id ? '3px solid #22c55e' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: selectedAsset.id === asset.id ? '#fff' : '#a1a1aa' }}>
                    {asset.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>{asset.category}</div>
                </div>
                <div style={{ 
                  fontSize: 13, 
                  fontFamily: 'monospace', 
                  fontWeight: 500,
                  color: asset.delta4w >= 0 ? '#22c55e' : '#ef4444' 
                }}>
                  {asset.delta4w >= 0 ? '+' : ''}{(asset.delta4w / 1000).toFixed(1)}k
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Main Chart */}
          <Card title={`${selectedAsset.name} — 12 Week Flow`} subtitle={`${selectedAsset.category} • ${selectedAsset.signal}`}>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flowData} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1f26" vertical={false} />
                  <XAxis dataKey="week" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}k`} />
                  <Tooltip 
                    contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
                    labelStyle={{ color: '#a1a1aa' }}
                  />
                  <ReferenceLine y={0} stroke="#27272a" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="dealer" name="Dealers" stroke="#f87171" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="assetMgr" name="Asset Mgrs" stroke="#2dd4bf" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="leveraged" name="Leveraged" stroke="#fbbf24" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Aggregate Chart */}
          <Card title="Aggregate Flows" subtitle="All assets combined">
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flowData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <defs>
                    <linearGradient id="gradDealer" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradAsset" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradLev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1f26" vertical={false} />
                  <XAxis dataKey="week" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}k`} />
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8 }} />
                  <ReferenceLine y={0} stroke="#27272a" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="dealer" stroke="#f87171" fill="url(#gradDealer)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="assetMgr" stroke="#2dd4bf" fill="url(#gradAsset)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="leveraged" stroke="#fbbf24" fill="url(#gradLev)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Flow Table */}
      <Card title="Cross-Asset Flow Matrix" subtitle="Net positioning and 4-week delta">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e1f26' }}>
              <Th left>Asset</Th>
              <Th left>Category</Th>
              <Th>Net Position</Th>
              <Th>4W Delta</Th>
              <Th>Percentile</Th>
              <Th>Trend</Th>
              <Th left>Signal</Th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <tr key={asset.id} style={{ borderBottom: '1px solid #1e1f26' }}>
                <Td left bold>{asset.name}</Td>
                <Td left muted>{asset.category}</Td>
                <Td positive={asset.net >= 0}>{formatNumber(asset.net)}</Td>
                <Td positive={asset.delta4w >= 0}>{formatDelta(asset.delta4w)}</Td>
                <Td><PercentileBar value={asset.pct} /></Td>
                <Td positive={asset.trend >= 0}>{asset.trend > 0 ? '+' : ''}{asset.trend}</Td>
                <Td left><SignalBadge signal={asset.signal} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// =====================================================
// REGIME PAGE
// =====================================================

function RegimePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Macro Regime</h1>
        <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>Current market regime and indicators</p>
      </div>

      {/* Regime Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Primary Regime" value={macroData.regime} highlight />
        <StatCard label="Confidence" value={`${macroData.confidence}%`} positive={macroData.confidence > 60} />
        <StatCard label="Risk Appetite" value={macroData.riskAppetite.toString()} positive={macroData.riskAppetite > 50} />
        <StatCard label="Liquidity Score" value={macroData.liquidity.toString()} positive={macroData.liquidity > 50} />
      </div>

      {/* Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Card title="Dollar Index (DXY)">
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: 32, fontWeight: 600, fontFamily: 'monospace' }}>{macroData.dxy}</div>
            <div style={{ 
              fontSize: 14, 
              color: macroData.dxyChange >= 0 ? '#22c55e' : '#ef4444',
              marginTop: 4 
            }}>
              {macroData.dxyChange >= 0 ? '↑' : '↓'} {Math.abs(macroData.dxyChange)}% weekly
            </div>
          </div>
        </Card>

        <Card title="VIX">
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: 32, fontWeight: 600, fontFamily: 'monospace' }}>{macroData.vix}</div>
            <div style={{ fontSize: 14, color: '#71717a', marginTop: 4 }}>
              {macroData.vixPct}th percentile (52w)
            </div>
          </div>
        </Card>

        <Card title="10Y Treasury">
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: 32, fontWeight: 600, fontFamily: 'monospace' }}>{macroData.us10y}%</div>
            <div style={{ fontSize: 14, color: '#71717a', marginTop: 4 }}>
              2s10s: {macroData.curve2s10s}bp
            </div>
          </div>
        </Card>
      </div>

      {/* Gauges */}
      <Card title="Regime Indicators">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          <GaugeBar label="Risk Appetite" value={macroData.riskAppetite} />
          <GaugeBar label="Liquidity Score" value={macroData.liquidity} />
          <GaugeBar label="Regime Confidence" value={macroData.confidence} />
          <GaugeBar label="VIX Percentile" value={macroData.vixPct} />
        </div>
      </Card>
    </div>
  );
}

// =====================================================
// ANALYTICS PAGE
// =====================================================

function AnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Trading Analytics</h1>
        <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>Edge analysis and Monte Carlo results</p>
      </div>

      {/* Win Rate Chart */}
      <Card title="Win Rate by Strategy" subtitle="Historical performance">
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics} layout="vertical" margin={{ top: 10, right: 30, bottom: 10, left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1f26" horizontal={false} />
              <XAxis type="number" stroke="#52525b" fontSize={11} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="label" stroke="#52525b" fontSize={12} width={95} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8 }} />
              <Bar dataKey="winRate" name="Win Rate" radius={[0, 4, 4, 0]}>
                {analytics.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={entry.winRate >= 55 ? '#22c55e' : entry.winRate >= 50 ? '#f59e0b' : '#ef4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Analytics Table */}
      <Card title="Edge Quality Summary">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e1f26' }}>
              <Th left>Strategy</Th>
              <Th>Win Rate</Th>
              <Th>Mean Return</Th>
              <Th>Samples</Th>
              <Th left>Edge Quality</Th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e1f26' }}>
                <Td left bold>{item.label}</Td>
                <Td positive={item.winRate >= 50}>{item.winRate}%</Td>
                <Td positive={item.meanReturn >= 0}>{item.meanReturn >= 0 ? '+' : ''}{item.meanReturn}%</Td>
                <Td muted>{item.samples}</Td>
                <Td left><EdgeBadge edge={item.edge} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// =====================================================
// REPORTS PAGE
// =====================================================

function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Weekly Reports</h1>
        <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>Market commentary and analysis</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Report List */}
        <Card title="Reports">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {reports.map((report, i) => (
              <button
                key={i}
                onClick={() => setSelectedReport(i)}
                style={{
                  padding: '14px',
                  background: selectedReport === i ? '#1e1f26' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  borderLeft: selectedReport === i ? '3px solid #22c55e' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500, color: selectedReport === i ? '#fff' : '#a1a1aa' }}>
                  {report.title}
                </div>
                <div style={{ fontSize: 12, color: '#52525b', marginTop: 4 }}>{report.date}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Report Content */}
        <Card title={reports[selectedReport].title} subtitle={reports[selectedReport].date}>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: '#d4d4d8' }}>
            {reports[selectedReport].summary}
          </div>
          <div style={{ marginTop: 24, padding: 16, background: '#0c0d12', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#71717a', marginBottom: 8 }}>KEY TAKEAWAYS</div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#a1a1aa' }}>
              <li style={{ marginBottom: 8 }}>Institutional positioning remains constructive</li>
              <li style={{ marginBottom: 8 }}>Watch for regime shift signals in VIX structure</li>
              <li>DXY weakness supportive for risk assets</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

// =====================================================
// UI COMPONENTS
// =====================================================

function Card({ title, subtitle, children }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0c0d12', border: '1px solid #1e1f26', borderRadius: 12, overflow: 'hidden' }}>
      {title && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1f26' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>{subtitle}</div>}
        </div>
      )}
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function StatCard({ label, value, positive, highlight }: { label: string; value: string; positive?: boolean; highlight?: boolean }) {
  return (
    <div style={{ background: '#0c0d12', border: '1px solid #1e1f26', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 12, color: '#52525b', marginBottom: 8 }}>{label}</div>
      <div style={{ 
        fontSize: 24, 
        fontWeight: 600, 
        color: highlight ? '#22c55e' : positive !== undefined ? (positive ? '#22c55e' : '#ef4444') : '#fff' 
      }}>
        {value}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 16, height: 3, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 12, color: '#71717a' }}>{label}</span>
    </div>
  );
}

function Th({ children, left }: { children: React.ReactNode; left?: boolean }) {
  return (
    <th style={{ 
      padding: '12px 16px', 
      fontSize: 11, 
      fontWeight: 600, 
      color: '#52525b', 
      textAlign: left ? 'left' : 'right',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    }}>
      {children}
    </th>
  );
}

function Td({ children, left, bold, muted, positive }: { 
  children: React.ReactNode; 
  left?: boolean; 
  bold?: boolean; 
  muted?: boolean;
  positive?: boolean;
}) {
  return (
    <td style={{ 
      padding: '14px 16px', 
      fontSize: 13, 
      fontFamily: 'monospace',
      textAlign: left ? 'left' : 'right',
      fontWeight: bold ? 500 : 400,
      color: muted ? '#52525b' : positive !== undefined ? (positive ? '#22c55e' : '#ef4444') : '#a1a1aa',
    }}>
      {children}
    </td>
  );
}

function PercentileBar({ value }: { value: number }) {
  const color = value > 80 || value < 20 ? '#ef4444' : value > 70 || value < 30 ? '#f59e0b' : '#22c55e';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
      <div style={{ width: 50, height: 6, background: '#1e1f26', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, color: '#71717a', width: 28, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function GaugeBar({ label, value }: { label: string; value: number }) {
  const color = value >= 60 ? '#22c55e' : value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: '#a1a1aa' }}>{label}</span>
        <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 500 }}>{value}</span>
      </div>
      <div style={{ height: 8, background: '#1e1f26', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}

function SignalBadge({ signal }: { signal: string }) {
  const color = signal.includes('Bull') || signal.includes('Buy') ? '#22c55e' 
    : signal.includes('Bear') || signal.includes('Sell') ? '#ef4444' 
    : '#71717a';
  return (
    <span style={{ 
      fontSize: 11, 
      fontWeight: 500, 
      padding: '4px 10px', 
      borderRadius: 4, 
      background: `${color}20`, 
      color 
    }}>
      {signal}
    </span>
  );
}

function EdgeBadge({ edge }: { edge: string }) {
  const color = edge === 'Strong' ? '#22c55e' : edge === 'Moderate' ? '#f59e0b' : '#ef4444';
  return (
    <span style={{ 
      fontSize: 11, 
      fontWeight: 500, 
      padding: '4px 10px', 
      borderRadius: 4, 
      background: `${color}20`, 
      color 
    }}>
      {edge}
    </span>
  );
}

// =====================================================
// UTILITIES
// =====================================================

function formatNumber(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function formatDelta(n: number): string {
  const prefix = n >= 0 ? '+' : '';
  return `${prefix}${formatNumber(n)}`;
}
