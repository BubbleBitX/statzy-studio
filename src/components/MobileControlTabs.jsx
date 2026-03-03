import React, { useState } from 'react'
import ControlPanel from './ControlPanel'
import TemplatePanel from './TemplatePanel'

const TABS = [
  { id: 'templates', label: 'Style',    icon: '🎭' },
  { id: 'content',   label: 'Content',  icon: '✏️' },
  { id: 'colors',    label: 'Colors',   icon: '🎨' },
  { id: 'export',    label: 'Export',   icon: '⬇' },
]

export default function MobileControlTabs({ onExport, onExportGif, exporting, exported }) {
  const [tab, setTab] = useState('content')

  return (
    <div className="md:hidden flex flex-col border-t" style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
      {/* Tab bar */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-colors"
            style={{ color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 11, borderBottom: tab === t.id ? '2px solid #7C3AED' : '2px solid transparent' }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span style={{ fontSize: 9, fontFamily: "'Space Mono',monospace", letterSpacing: '0.1em' }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
        {tab === 'templates' && <TemplatePanel />}
        {(tab === 'content' || tab === 'colors' || tab === 'export') && (
          <ControlPanel onExport={onExport} onExportGif={onExportGif} exporting={exporting} exported={exported} />
        )}
      </div>
    </div>
  )
}
