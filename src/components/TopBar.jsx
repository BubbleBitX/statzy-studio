import React from 'react'
import { useStudio } from '@/store/useStudio'

export default function TopBar({ onExport, onCopy, exporting, exported, onMobilePreview }) {
  const { randomize, reset, setMobilePreview } = useStudio()

  return (
    <header className="h-14 flex items-center px-4 gap-3 border-b shrink-0 z-50"
      style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2 select-none">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-black"
          style={{ background: 'linear-gradient(135deg, #FF3EA4, #7C3AED)', fontFamily: 'Syne' }}>
          S
        </div>
        <div className="flex flex-col">
          <span className="font-black text-sm sm:text-lg tracking-tight" style={{ fontFamily: 'Syne' }}>
            <span style={{ background: 'linear-gradient(90deg,#FF3EA4,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>STATZY</span>
          </span>
          <span className="text-xs font-mono hidden sm:block" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', lineHeight: 1 }}>
            Create Beautiful Stats Cards
          </span>
        </div>
        <span className="text-xs font-mono hidden sm:inline" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>STUDIO</span>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile preview btn */}
        <button
          onClick={() => setMobilePreview(true)}
          className="md:hidden px-2 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)' }}>
          👁
        </button>

        <button
          onClick={randomize}
          className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid var(--border)' }}>
          🎲 <span className="hidden lg:inline">Randomize</span>
        </button>

        <button
          onClick={reset}
          className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid var(--border)' }}>
          ↺ <span className="hidden lg:inline">Reset</span>
        </button>

        <button
          onClick={onCopy}
          className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.3)' }}>
          📋 <span className="hidden lg:inline">Copy</span>
        </button>

        <button
          disabled
          className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-not-allowed opacity-50"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid var(--border)' }}>
          🎬 <span className="hidden lg:inline">GIF</span> <span className="text-xs opacity-60">SOON</span>
        </button>

        <button
          onClick={onExport}
          disabled={exporting}
          className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
          style={{ background: exported ? 'linear-gradient(135deg,#22C55E,#16A34A)' : 'linear-gradient(135deg,#FF3EA4,#7C3AED)', color: '#fff', opacity: exporting ? 0.7 : 1 }}>
          {exporting ? '⏳' : exported ? '✓' : '⬇'} <span className="hidden sm:inline">PNG</span>
        </button>
      </div>
    </header>
  )
}
