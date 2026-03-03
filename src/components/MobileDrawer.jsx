import React, { useRef } from 'react'
import { useStudio } from '@/store/useStudio'
import LiveCard from './LiveCard'
import { useExport } from '@/hooks/useExport'

export default function MobileDrawer() {
  const { isMobilePreviewOpen, setMobilePreview, color1, color2 } = useStudio()
  const cardRef = useRef(null)
  const { exportPng, exporting, exported } = useExport(cardRef)

  if (!isMobilePreviewOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:hidden"
      style={{ background: '#050510' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, background: `linear-gradient(90deg,${color1},${color2})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          Preview
        </span>
        <button onClick={() => setMobilePreview(false)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
          ✕
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div style={{ width: '100%', maxWidth: 340, aspectRatio: 1.1 }}>
          <LiveCard ref={cardRef} />
        </div>
      </div>

      {/* Export */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button onClick={exportPng} disabled={exporting}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{ background: exported ? 'linear-gradient(135deg,#22C55E,#16A34A)' : `linear-gradient(135deg,${color1},${color2})`, color: '#fff', fontFamily: "'Syne',sans-serif" }}>
          {exporting ? '⏳ Exporting…' : exported ? '✓ Saved!' : '⬇ Export PNG'}
        </button>
      </div>
    </div>
  )
}
