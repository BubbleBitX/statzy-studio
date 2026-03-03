import React, { useState } from 'react'
import { useStudio, PALETTES, PLATFORMS, FONTS, SIZES } from '@/store/useStudio'

// ── Sub-components ─────────────────────────────────────────────────────────

function Section({ title, icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
        style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
        <span>{icon}</span>
        <span>{title}</span>
        <span className="ml-auto transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none', fontSize: 9 }}>▼</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

function Label({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{children}</span>
      {right && <span style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(255,255,255,0.55)' }}>{right}</span>}
    </div>
  )
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      className="studio-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

function Toggle({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="rounded-full transition-all duration-200 flex-shrink-0"
        style={{
          width: 36, height: 20,
          background: value ? '#7C3AED' : 'rgba(255,255,255,0.12)',
          position: 'relative', border: 'none', cursor: 'pointer',
        }}>
        <span style={{
          position: 'absolute', top: 2, left: 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'transform 0.2s',
          transform: value ? 'translateX(16px)' : 'translateX(0)',
          display: 'block',
        }} />
      </button>
    </div>
  )
}

function ColorSwatch({ hex, label, onChange }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="rounded-xl relative overflow-hidden cursor-pointer transition-transform hover:scale-110"
        style={{ width: 36, height: 36, background: hex, border: '2px solid rgba(255,255,255,0.15)' }}>
        <input type="color" value={hex} onChange={e => onChange(e.target.value)} />
      </div>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em' }}>{label}</span>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function ControlPanel({ onExport, onExportGif, exporting, exported, exportError }) {
  const {
    statNumber, statLabel, handle, growth, platformId,
    mini1, mini2, mini3,
    color1, color2, color3, colorBg, activePalette,
    fontId, numSize, radius,
    showMini, showLive, showWatermark,
    sizeId,
    setContent, setMini, setPlatform,
    setColor, applyPalette,
    setFont, setNumSize, setRadius, setToggle, setSize,
    randomize,
  } = useStudio()

  const currentSize = SIZES.find(s => s.id === sizeId)

  return (
    <aside className="flex flex-col overflow-hidden border-l" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
      <div className="overflow-y-auto flex-1">

        {/* ── Content ── */}
        <Section title="Content" icon="✏️">
          <div className="flex flex-col gap-3">
            <div>
              <Label>Main Stat</Label>
              <Input value={statNumber} onChange={v => setContent('statNumber', v)} placeholder="50K, 1M, 340%…" />
            </div>
            <div>
              <Label>Stat Label</Label>
              <Input value={statLabel} onChange={v => setContent('statLabel', v)} placeholder="Followers, Views…" />
            </div>
            <div>
              <Label>Your Handle</Label>
              <Input value={handle} onChange={v => setContent('handle', v)} placeholder="@handle" />
            </div>
            <div>
              <Label>Growth Badge</Label>
              <Input value={growth} onChange={v => setContent('growth', v)} placeholder="▲ +12.4%" />
            </div>

            {/* Platform */}
            <div>
              <Label>Platform</Label>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setPlatform(p.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all"
                    style={{
                      background: platformId === p.id ? 'rgba(255,62,164,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${platformId === p.id ? color1 : 'var(--border)'}`,
                      color: platformId === p.id ? '#fff' : 'rgba(255,255,255,0.5)',
                    }}>
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini stats */}
            <div>
              <Label>Mini Stats</Label>
              <div className="flex flex-col gap-2">
                {[1,2,3].map(n => {
                  const m = n === 1 ? mini1 : n === 2 ? mini2 : mini3
                  return (
                    <div key={n} className="flex gap-2">
                      <input className="studio-input" value={m.value} onChange={e => setMini(n,'value',e.target.value)} placeholder="Value" style={{ flex: 1 }} />
                      <input className="studio-input" value={m.label} onChange={e => setMini(n,'label',e.target.value)} placeholder="Label" style={{ flex: 1 }} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Colors ── */}
        <Section title="Colors" icon="🎨">
          {/* Palette presets */}
          <Label>Quick Palettes</Label>
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {PALETTES.map((p, i) => (
              <button key={i} onClick={() => applyPalette(i)}
                className="rounded-lg h-8 relative overflow-hidden transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg,${p.c1},${p.c2})`,
                  border: `2px solid ${activePalette === i ? 'rgba(255,255,255,0.5)' : 'transparent'}`,
                }}
                title={p.name}
              >
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                  style={{ fontSize: 8, fontFamily: "'Space Mono',monospace", background: 'rgba(0,0,0,0.4)' }}>
                  {p.name}
                </span>
              </button>
            ))}
          </div>

          {/* Custom colors */}
          <Label>Custom Colors</Label>
          <div className="flex justify-between">
            <ColorSwatch hex={color1}   label="Color 1" onChange={v => setColor('color1', v)} />
            <ColorSwatch hex={color2}   label="Color 2" onChange={v => setColor('color2', v)} />
            <ColorSwatch hex={color3}   label="Accent"  onChange={v => setColor('color3', v)} />
            <ColorSwatch hex={colorBg}  label="BG"      onChange={v => setColor('colorBg', v)} />
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography" icon="🔤">
          <Label>Font Family</Label>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {FONTS.map(f => (
              <button key={f.id} onClick={() => setFont(f.id)}
                className="py-2 rounded-lg text-sm transition-all"
                style={{
                  fontFamily: `'${f.id}', sans-serif`,
                  background: fontId === f.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${fontId === f.id ? 'rgba(124,58,237,0.5)' : 'var(--border)'}`,
                  color: fontId === f.id ? '#fff' : 'rgba(255,255,255,0.55)',
                }}>
                {f.label}
              </button>
            ))}
          </div>

          <Label right={`${numSize}px`}>Number Size</Label>
          <input type="range" min="40" max="100" value={numSize}
            onChange={e => setNumSize(e.target.value)}
            className="w-full"
            style={{ background: `linear-gradient(to right, ${color1} 0%, ${color1} ${((numSize-40)/60)*100}%, rgba(255,255,255,0.1) ${((numSize-40)/60)*100}%)` }}
          />
        </Section>

        {/* ── Shape & Layout ── */}
        <Section title="Shape" icon="⬜">
          <Label right={`${radius}px`}>Corner Radius</Label>
          <input type="range" min="0" max="40" value={radius}
            onChange={e => setRadius(e.target.value)}
            className="w-full mb-4"
            style={{ background: `linear-gradient(to right, ${color1} 0%, ${color1} ${(radius/40)*100}%, rgba(255,255,255,0.1) ${(radius/40)*100}%)` }}
          />

          <Label>Export Size</Label>
          <div className="flex gap-1.5 mb-4">
            {SIZES.map(s => (
              <button key={s.id} onClick={() => setSize(s.id)}
                className="flex-1 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: sizeId === s.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${sizeId === s.id ? 'rgba(124,58,237,0.5)' : 'var(--border)'}`,
                  color: sizeId === s.id ? '#fff' : 'rgba(255,255,255,0.45)',
                }}>
                <div style={{ fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>{s.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Toggle value={showMini}      onChange={() => setToggle('showMini')}      label="Mini stat chips" />
            <Toggle value={showLive}      onChange={() => setToggle('showLive')}      label="Live indicator dot" />
            <Toggle value={showWatermark} onChange={() => setToggle('showWatermark')} label="Statzy watermark" />
          </div>
        </Section>

      </div>

      {/* ── Export ── */}
      <div className="p-3 border-t flex flex-col gap-2 shrink-0" style={{ borderColor: 'var(--border)' }}>
        <button onClick={onExport} disabled={exporting}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: exported ? 'linear-gradient(135deg,#22C55E,#16A34A)' : `linear-gradient(135deg,${color1},${color2})`,
            color: '#fff', opacity: exporting ? 0.7 : 1,
            fontFamily: "'Syne',sans-serif",
          }}>
          {exporting ? '⏳ Exporting…' : exported ? '✓ Exported!' : '⬇ Export PNG (Free)'}
        </button>
        <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-not-allowed opacity-50"
          disabled
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid var(--border)' }}>
          🎬 Animated GIF <span style={{ fontSize: 10, opacity: 0.6 }}>COMING SOON</span>
        </button>
        <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-not-allowed opacity-50"
          disabled
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid var(--border)' }}>
          📹 Video Recap <span style={{ fontSize: 10, opacity: 0.6 }}>COMING SOON</span>
        </button>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', fontFamily: "'Space Mono',monospace" }}>
          PNG export is free · Premium features coming soon
        </p>
        
        {/* Error display */}
        {exportError && (
          <div style={{
            marginTop: 8,
            padding: 8,
            borderRadius: 6,
            fontSize: 10,
            color: '#FCA5A5',
            background: 'rgba(252,165,165,0.1)',
            border: '1px solid rgba(252,165,165,0.2)',
            fontFamily: "'Space Mono',monospace",
            textAlign: 'center'
          }}>
            ⚠️ {exportError}
          </div>
        )}
      </div>
    </aside>
  )
}
