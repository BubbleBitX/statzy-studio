import React from 'react'
import { useStudio, TEMPLATES } from '@/store/useStudio'
import { hexAlpha } from '@/utils/colors'

const TIER_CONFIG = {
  free: { label: 'FREE',    bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' },
  pro:  { label: 'PRO',     bg: 'rgba(124,58,237,0.25)',  color: '#C084FC' },
  ex:   { label: '★ EXCL',  bg: 'linear-gradient(135deg,#FF3EA4,#FFBE0B)', color: '#000' },
}

const THUMBS = {
  blob:    { bg: 'linear-gradient(135deg,#1A0530,#0D1A30)', accent: '#FF3EA4' },
  glass:   { bg: 'linear-gradient(145deg,#0A1628,#1A0D35)', accent: '#3DFAFF' },
  rave:    { bg: '#04040C',                                   accent: '#FF3EA4' },
  chrome:  { bg: 'linear-gradient(135deg,#E8E0FF,#FFE8F5)',  accent: '#7C3AED' },
  minimal: { bg: '#0D0D1A',                                   accent: '#FF3EA4' },
}

export default function TemplatePanel() {
  const { templateId, setTemplate, color1 } = useStudio()

  return (
    <aside className="flex flex-col overflow-hidden border-r" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
      <div className="px-3 sm:px-4 py-3 border-b shrink-0"
        style={{ borderColor: 'var(--border)', fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
        Templates
      </div>

      <div className="overflow-y-auto p-1 sm:p-2 flex flex-col gap-1.5 sm:gap-2 flex-1">
        {TEMPLATES.map((t) => {
          const active = templateId === t.id
          const thumb = THUMBS[t.id]
          const tier = TIER_CONFIG[t.tier]

          return (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className="rounded-xl overflow-hidden text-left transition-all duration-200 w-full"
              style={{
                border: `2px solid ${active ? color1 : 'transparent'}`,
                outline: 'none',
                background: 'rgba(255,255,255,0.03)',
              }}>

              {/* Thumbnail */}
              <div className="h-16 sm:h-20 flex items-center justify-center relative overflow-hidden"
                style={{ background: thumb.bg }}>
                {/* Mini preview dots */}
                <div className="flex flex-col items-center gap-1 sm:gap-1.5 opacity-70">
                  <div className="h-1.5 sm:h-2 rounded-full" style={{ width: 32, background: thumb.accent, filter: 'blur(1px)' }} />
                  <div className="h-4 sm:h-5 rounded font-black text-xs flex items-center" style={{ color: '#fff', fontFamily: 'Syne', letterSpacing: '-0.02em' }}>
                    50K
                  </div>
                  <div className="h-1 sm:h-1.5 rounded-full opacity-40" style={{ width: 24, background: '#fff' }} />
                </div>
                {active && (
                  <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 sm:top-1.5 sm:right-1.5 rounded-full flex items-center justify-center text-white"
                    style={{ background: color1, fontSize: 6, sm: { fontSize: 8 } }}>✓</div>
                )}
              </div>

              {/* Label */}
              <div className="flex items-center justify-between px-2 py-1.5 sm:px-2.5 sm:py-2"
                style={{ background: 'rgba(0,0,0,0.4)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,0.65)' }}>
                  {t.name}
                </span>
                <span className="rounded-full px-2 py-0.5" style={{ fontSize: 8, fontFamily: "'Space Mono',monospace", background: tier.bg, color: tier.color, fontWeight: 700 }}>
                  {tier.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
