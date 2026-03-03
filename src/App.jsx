import React, { useRef, useState, useCallback } from 'react'
import TopBar from './components/TopBar'
import TemplatePanel from './components/TemplatePanel'
import PreviewArea from './components/PreviewArea'
import ControlPanel from './components/ControlPanel'
import MobileDrawer from './components/MobileDrawer'
import MobileControlTabs from './components/MobileControlTabs'
import { useStudio } from './store/useStudio'
import { useExport } from './hooks/useExport'
import LiveCard from './components/LiveCard'

export default function App() {
  const cardRef = useRef(null)
  const { color1, color2 } = useStudio()
  const { exportPng, exportGif, copyToClipboard, exporting, exported, exportError } = useExport(cardRef)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        onExport={exportPng}
        onExportGif={exportGif}
        onCopy={copyToClipboard}
        exporting={exporting}
        exported={exported}
      />

      {/* Desktop layout: 3 columns */}
      <div className="hidden md:grid flex-1 overflow-hidden"
        style={{ gridTemplateColumns: '260px 1fr 280px' }}>
        <TemplatePanel />
        <DesktopPreview cardRef={cardRef} />
        <ControlPanel onExport={exportPng} onExportGif={exportGif} exporting={exporting} exported={exported} exportError={exportError} />
      </div>

      {/* Mobile layout: preview + bottom tabs */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        <MobilePreviewSmall cardRef={cardRef} />
        <MobileControlTabs onExport={exportPng} exporting={exporting} exported={exported} />
      </div>

      {/* Mobile full preview drawer */}
      <MobileDrawer />
    </div>
  )
}

// Desktop center preview
function DesktopPreview({ cardRef }) {
  const { sizeId } = useStudio()
  const sizes = { square: { w: 340, ar: 1.1 }, story: { w: 200, ar: 0.56 }, banner: { w: 400, ar: 1.91 } }
  const s = sizes[sizeId] || sizes.square

  return (
    <main className="flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#050510' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          Live Preview
        </p>
        <div style={{ width: s.w, aspectRatio: s.ar, filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.8))', transition: 'all 0.3s ease' }}>
          <LiveCard ref={cardRef} style={{ width: '100%', height: '100%' }} />
        </div>
        <SizeSwitcher />
      </div>
    </main>
  )
}

function SizeSwitcher() {
  const { sizeId, setSize } = useStudio()
  const sizes = [
    { id: 'square', label: 'Square' },
    { id: 'story',  label: 'Story' },
    { id: 'banner', label: 'Banner' },
  ]
  return (
    <div className="flex gap-2">
      {sizes.map(s => (
        <button key={s.id} onClick={() => setSize(s.id)}
          className="px-3 py-1.5 rounded-lg text-xs transition-all"
          style={{
            fontFamily: "'Space Mono',monospace",
            background: sizeId === s.id ? 'rgba(255,255,255,0.08)' : 'transparent',
            border: `1px solid ${sizeId === s.id ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`,
            color: sizeId === s.id ? '#fff' : 'rgba(255,255,255,0.3)',
          }}>
          {s.label}
        </button>
      ))}
    </div>
  )
}

// Mobile small preview strip
function MobilePreviewSmall({ cardRef }) {
  const { sizeId } = useStudio()
  return (
    <div className="flex items-center justify-center py-6 px-4 flex-1 overflow-hidden"
      style={{ background: '#050510', minHeight: 0 }}>
      <div style={{ width: 200, aspectRatio: 1.1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))' }}>
        <LiveCard ref={cardRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}
