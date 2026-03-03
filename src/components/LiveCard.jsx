import React, { forwardRef } from 'react'
import { useStudio, PLATFORMS } from '@/store/useStudio'
import { hexAlpha, isLight } from '@/utils/colors'

// ── Template backgrounds ───────────────────────────────────────────────────
function BgBlob({ c1, c2, c3, bg }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: bg }} />
      <div style={{
        position: 'absolute', width: 180, height: 180, borderRadius: '50%',
        background: c1, filter: 'blur(50px)', opacity: 0.75,
        top: -50, left: -50,
        animation: 'blobFloat 6s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', width: 140, height: 140, borderRadius: '50%',
        background: c2, filter: 'blur(50px)', opacity: 0.65,
        bottom: -30, right: -20,
        animation: 'blobFloat 6s ease-in-out infinite alternate',
        animationDelay: '-2s',
      }} />
      <div style={{
        position: 'absolute', width: 100, height: 100, borderRadius: '50%',
        background: c3, filter: 'blur(45px)', opacity: 0.4,
        top: '40%', left: '45%',
        animation: 'blobFloat 6s ease-in-out infinite alternate',
        animationDelay: '-4s',
      }} />
    </>
  )
}

function BgGlass({ c1, c3 }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg,#0A1628,#1A0D35,#0D2020)' }} />
      <div style={{
        position: 'absolute', width: 220, height: 220, borderRadius: '50%',
        background: `radial-gradient(circle, ${hexAlpha(c3, 0.5)}, transparent 70%)`,
        filter: 'blur(35px)', top: -80, right: -60,
        animation: 'orbDrift 7s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', width: 180, height: 180, borderRadius: '50%',
        background: `radial-gradient(circle, ${hexAlpha(c1, 0.4)}, transparent 70%)`,
        filter: 'blur(35px)', bottom: -60, left: -40,
        animation: 'orbDrift 7s ease-in-out infinite alternate',
        animationDelay: '-3s',
      }} />
    </>
  )
}

function BgRave({ c1 }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#04040C' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${c1}, transparent)`,
        boxShadow: `0 0 20px ${c1}`,
        animation: 'scanLine 3s linear infinite',
        top: '-5%',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        border: `1px solid ${hexAlpha(c1, 0.25)}`,
        pointerEvents: 'none',
      }} />
    </>
  )
}

function BgChrome() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#E8E0FF,#FFE8F5,#E0FFF8)' }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
        backgroundSize: '200% 200%',
        animation: 'shimmerAnim 3s ease-in-out infinite',
      }} />
    </>
  )
}

function BgMinimal({ c1, c2, bg }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: bg }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${c1}, ${c2})`,
      }} />
    </>
  )
}

// ── Main LiveCard ─────────────────────────────────────────────────────────
const LiveCard = forwardRef(function LiveCard({ style, ...props }, ref) {
  const {
    templateId, color1, color2, color3, colorBg, fontId, numSize, radius,
    statNumber, statLabel, handle, growth, platformId,
    mini1, mini2, mini3, showMini, showLive, showWatermark, sizeId
  } = useStudio()

  const platform = PLATFORMS.find(p => p.id === platformId)
  const chromeBg = templateId === 'chrome'
  const textColor = chromeBg ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)'
  const subColor  = chromeBg ? 'rgba(0,0,0,0.4)'  : 'rgba(255,255,255,0.4)'

  // Responsive padding based on card size and aspect ratio
  const getResponsivePadding = () => {
    const cardWidth = style?.width || 340
    const cardHeight = style?.height || 340
    const isStory = sizeId === 'story'
    const isBanner = sizeId === 'banner'
    
    if (isStory) {
      // Story format (9:16) - less padding needed
      if (cardWidth <= 140) return 12 // Extra small story
      if (cardWidth <= 180) return 16 // Small story
      if (cardWidth <= 200) return 20 // Medium story
      return 24 // Large story
    }
    
    if (isBanner) {
      // Banner format (16:9) - moderate padding
      if (cardWidth <= 180) return 16 // Extra small banner
      if (cardWidth <= 320) return 20 // Small banner
      if (cardWidth <= 400) return 24 // Medium banner
      return 28 // Large banner
    }
    
    // Square format (1:1) - standard padding
    if (cardWidth <= 120) return 16 // Extra small square
    if (cardWidth <= 160) return 20 // Small square
    if (cardWidth <= 280) return 24 // Medium square
    return 28 // Large square
  }

  const getResponsiveFontSize = (baseSize, minSize = 8) => {
    const cardWidth = style?.width || 340
    const scaleFactor = cardWidth / 340
    const scaledSize = baseSize * scaleFactor
    return Math.max(minSize, scaledSize)
  }

  const cardStyle = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radius,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: getResponsivePadding(),
    fontFamily: `'${fontId}', sans-serif`,
    ...style,
  }

  const gradientText = {
    background: `linear-gradient(135deg, ${color1}, ${color2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: color1, // Fallback color for browsers that don't support text clipping
  }

  const miniCardStyle = {
    flex: 1,
    background: chromeBg ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
    border: `1px solid ${chromeBg ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: 6,
    padding: '6px 4px',
    textAlign: 'center',
    minWidth: 0, // Allow shrinking
  }

  return (
    <div ref={ref} style={cardStyle}>
      {/* ── Background layer ── */}
      {templateId === 'blob'    && <BgBlob    c1={color1} c2={color2} c3={color3} bg={colorBg} />}
      {templateId === 'glass'   && <BgGlass   c1={color1} c3={color3} />}
      {templateId === 'rave'    && <BgRave    c1={color1} />}
      {templateId === 'chrome'  && <BgChrome  />}
      {templateId === 'minimal' && <BgMinimal c1={color1} c2={color2} bg={colorBg} />}

      {/* ── Glass frost panel (glass template) ── */}
      {templateId === 'glass' && (
        <div style={{
          position: 'absolute', inset: getResponsivePadding() / 2,
          borderRadius: Math.max(0, radius - getResponsivePadding() / 4),
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          zIndex: 1,
        }} />
      )}

      {/* ── Card content ── */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: getResponsiveFontSize(10, 8),
            letterSpacing: '0.18em',
            color: subColor, textTransform: 'uppercase',
          }}>
            {platform?.icon} {platform?.label}
          </span>
          {showLive && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Space Mono', monospace", fontSize: getResponsiveFontSize(9, 7), color: color3 }}>
              <span style={{
                display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                background: color3, boxShadow: `0 0 6px ${color3}`,
                animation: 'liveBlink 1.5s ease-in-out infinite',
              }} />
              LIVE
            </span>
          )}
        </div>

        {/* Stat */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: getResponsiveFontSize(numSize, 24),
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            ...gradientText,
          }}>
            {statNumber}
          </div>
          <div style={{ 
            fontSize: getResponsiveFontSize(12, 9), 
            color: subColor, 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase', 
            marginTop: getResponsiveFontSize(6, 4) 
          }}>
            {statLabel}
          </div>
        </div>

        {/* Mini stats */}
        {showMini && (
          <div style={{ display: 'flex', gap: 4 }}>
            {[mini1, mini2, mini3].map((m, i) => (
              <div key={i} style={miniCardStyle}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: getResponsiveFontSize(Math.max(12, numSize / 6), 10),
                  color: textColor,
                  lineHeight: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {m.value}
                </div>
                <div style={{ 
                  fontSize: getResponsiveFontSize(Math.max(7, numSize / 12), 6),
                  color: subColor, 
                  marginTop: 1, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: getResponsiveFontSize(12, 8),
          borderTop: `1px solid ${chromeBg ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.07)'}`,
        }}>
          <span style={{ 
            fontFamily: "'Space Mono', monospace", 
            fontSize: getResponsiveFontSize(11, 8), 
            color: subColor,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            marginRight: 8
          }}>
            {handle}
          </span>
          <span style={{ 
            fontWeight: 700, 
            fontSize: getResponsiveFontSize(13, 9), 
            color: chromeBg ? color1 : color3,
            whiteSpace: 'nowrap'
          }}>
            {growth}
          </span>
        </div>
      </div>

      {/* Watermark */}
      {showWatermark && (
        <div style={{
          position: 'absolute', bottom: 8, right: 10, zIndex: 10,
          fontFamily: "'Space Mono', monospace", fontSize: 8,
          color: chromeBg ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)',
          letterSpacing: '0.08em',
        }}>
          statzy.app
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes blobFloat {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(12px,-12px) scale(1.12); }
        }
        @keyframes orbDrift {
          0% { transform: translate(0,0); }
          100% { transform: translate(20px,20px); }
        }
        @keyframes scanLine {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        @keyframes shimmerAnim {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
        @keyframes liveBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
})

export default LiveCard
