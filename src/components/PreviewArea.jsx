import React, { useRef } from 'react'
import { useStudio, SIZES } from '@/store/useStudio'
import LiveCard from './LiveCard'
import { useExport } from '@/hooks/useExport'

export default function PreviewArea({ onExportReady }) {
  const cardRef = useRef(null)
  const { sizeId, setSize } = useStudio()
  const { exportPng, copyToClipboard, exporting, exported } = useExport(cardRef)
  const currentSize = SIZES.find(s => s.id === sizeId) || SIZES[0]

  // Expose export to parent
  React.useEffect(() => {
    if (onExportReady) onExportReady({ exportPng, copyToClipboard, exporting, exported })
  }, [exporting, exported])

  return (
    <main className="flex flex-col items-center justify-center relative overflow-hidden flex-1"
      style={{ background: '#050510' }}>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 flex flex-col items-center gap-4">

        {/* Label */}
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          Live Preview
        </p>

        {/* Card stage */}
        <div style={{
          width: currentSize.w,
          aspectRatio: currentSize.ar,
          filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.8))',
          transition: 'width 0.3s ease, aspect-ratio 0.3s ease',
        }}>
          <LiveCard ref={cardRef} />
        </div>

        {/* Size switcher */}
        <div className="flex gap-2">
          {SIZES.map(s => (
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

      </div>
    </main>
  )
}
