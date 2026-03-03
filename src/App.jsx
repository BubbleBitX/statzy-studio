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
  const { exportPng, copyToClipboard, exporting, exported, exportError } = useExport(cardRef)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        onExport={exportPng}
        onCopy={copyToClipboard}
        exporting={exporting}
        exported={exported}
      />

      {/* Mobile layout: stacked */}
      <div className="flex flex-col md:hidden flex-1 overflow-hidden">
        <MobilePreviewSmall cardRef={cardRef} />
        <MobileControlTabs onExport={exportPng} exporting={exporting} exported={exported} />
      </div>

      {/* Small mobile layout (phones) */}
      <div className="hidden xs:flex md:hidden flex-col flex-1 overflow-hidden">
        <MobilePreviewSmall cardRef={cardRef} />
        <MobileControlTabs onExport={exportPng} exporting={exporting} exported={exported} />
      </div>

      {/* Extra small mobile layout (small phones) */}
      <div className="flex flex-col xs:hidden flex-1 overflow-hidden">
        <MobilePreviewSmall cardRef={cardRef} />
        <MobileControlTabs onExport={exportPng} exporting={exporting} exported={exported} />
      </div>

      {/* Tablet layout: 2 columns */}
      <div className="hidden md:flex lg:hidden flex-1 overflow-hidden">
        <div className="flex flex-col w-80 border-r" style={{ borderColor: 'var(--border)' }}>
          <TemplatePanel />
        </div>
        <div className="flex-1 flex flex-col">
          <TabletPreview cardRef={cardRef} />
          <div className="border-t" style={{ borderColor: 'var(--border)' }}>
            <ControlPanel onExport={exportPng} exporting={exporting} exported={exported} exportError={exportError} />
          </div>
        </div>
      </div>

      {/* Desktop layout: 3 columns */}
      <div className="hidden lg:grid flex-1 overflow-hidden"
        style={{ gridTemplateColumns: '280px 1fr 320px' }}>
        <TemplatePanel />
        <DesktopPreview cardRef={cardRef} />
        <ControlPanel onExport={exportPng} exporting={exporting} exported={exported} exportError={exportError} />
      </div>

      {/* Mobile full preview drawer */}
      <MobileDrawer />
    </div>
  )
}

// Desktop center preview
function DesktopPreview({ cardRef }) {
  const { sizeId } = useStudio()
  const sizes = { square: { w: 340, ar: 1.0 }, story: { w: 200, ar: 0.5625 }, banner: { w: 400, ar: 1.91/1.0 } }
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
        <div className="text-center">
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Live Preview
          </p>
          <p style={{ 
            fontFamily: "'Space Mono',monospace", 
            fontSize: 9, 
            color: 'rgba(255,255,255,0.12)', 
            letterSpacing: '0.1em',
            marginTop: 2
          }}>
            Create Beautiful Stats Cards
          </p>
        </div>
        <div style={{ width: s.w, aspectRatio: s.ar, filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.8))', transition: 'all 0.3s ease' }}>
          <LiveCard ref={cardRef} style={{ width: '100%', height: '100%' }} />
        </div>
        <SizeSwitcher />
      </div>
    </main>
  )
}

// Tablet preview (larger than mobile)
function TabletPreview({ cardRef }) {
  const { sizeId } = useStudio()
  const sizes = { square: { w: 280, ar: 1.0 }, story: { w: 180, ar: 0.5625 }, banner: { w: 320, ar: 1.91/1.0 } }
  const s = sizes[sizeId] || sizes.square

  return (
    <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#050510', minHeight: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <div className="relative z-10 flex flex-col items-center gap-3 py-4">
        <div className="text-center">
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Live Preview
          </p>
          <p style={{ 
            fontFamily: "'Space Mono',monospace", 
            fontSize: 8, 
            color: 'rgba(255,255,255,0.1)', 
            letterSpacing: '0.08em',
            marginTop: 2
          }}>
            Create Beautiful Stats Cards
          </p>
        </div>
        <div style={{ width: s.w, aspectRatio: s.ar, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7))', transition: 'all 0.3s ease' }}>
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
    <div className="flex gap-2 flex-wrap justify-center">
      {sizes.map(s => (
        <button key={s.id} onClick={() => setSize(s.id)}
          className="px-2 py-1 rounded-lg text-xs transition-all"
          style={{
            fontFamily: "'Space Mono',monospace",
            background: sizeId === s.id ? 'rgba(255,255,255,0.08)' : 'transparent',
            border: `1px solid ${sizeId === s.id ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`,
            color: sizeId === s.id ? '#fff' : 'rgba(255,255,255,0.3)',
            minWidth: '60px'
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
  const sizes = { 
    square: { w: 120, ar: 1.0 }, 
    story: { w: 100, ar: 0.5625 }, 
    banner: { w: 140, ar: 1.91/1.0 },
    xs: { square: { w: 100, ar: 1.0 }, story: { w: 80, ar: 0.5625 }, banner: { w: 120, ar: 1.91/1.0 } }
  }
  
  const isXs = typeof window !== 'undefined' ? window.innerWidth < 475 : false
  const currentSizes = isXs ? sizes.xs : sizes
  const s = currentSizes[sizeId] || currentSizes.square
  
  return (
    <div className="flex flex-col items-center justify-center py-3 xs:py-4 px-2 xs:px-3 flex-1 overflow-hidden"
      style={{ background: '#050510', minHeight: 0 }}>
      <div className="text-center mb-2 xs:mb-3">
        <p style={{ 
          fontFamily: "'Space Mono',monospace", 
          fontSize: isXs ? 8 : 10, 
          color: 'rgba(255,255,255,0.3)', 
          letterSpacing: '0.1em', 
          textTransform: 'uppercase',
          marginBottom: 2
        }}>
          Statzy Studio
        </p>
        <p style={{ 
          fontFamily: "'Space Mono',monospace", 
          fontSize: isXs ? 7 : 9, 
          color: 'rgba(255,255,255,0.15)', 
          letterSpacing: '0.05em'
        }}>
          Create Beautiful Stats Cards
        </p>
      </div>
      <div className="relative">
        <div style={{ 
          width: s.w, 
          aspectRatio: s.ar, 
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.8))', 
          transition: 'all 0.3s ease' 
        }}>
          <LiveCard ref={cardRef} style={{ width: '100%', height: '100%' }} />
        </div>
        <p style={{ 
          fontFamily: "'Space Mono',monospace", 
          fontSize: isXs ? 7 : 8, 
          color: 'rgba(255,255,255,0.12)', 
          letterSpacing: '0.15em', 
          textTransform: 'uppercase',
          textAlign: 'center',
          marginTop: 6
        }}>
          Preview
        </p>
      </div>
    </div>
  )
}
