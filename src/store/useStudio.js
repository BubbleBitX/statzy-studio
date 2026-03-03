import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const TEMPLATES = [
  { id: 'blob',    name: 'Bubblegum Blob', tier: 'pro',  desc: 'Animated blobs' },
  { id: 'glass',   name: 'Neon Glass',     tier: 'pro',  desc: 'Glassmorphism' },
  { id: 'rave',    name: 'Rave Scanner',   tier: 'ex',   desc: 'Neon scan line' },
  { id: 'chrome',  name: 'Y2K Chrome',     tier: 'ex',   desc: 'Retro shimmer' },
  { id: 'minimal', name: 'Clean Minimal',  tier: 'free', desc: 'Bold & clean' },
]

export const PALETTES = [
  { name: 'Default', c1: '#FF3EA4', c2: '#7C3AED', c3: '#3DFAFF', bg: '#0D0D1A' },
  { name: 'Sunset',  c1: '#FF6B6B', c2: '#FF8E53', c3: '#FFBE0B', bg: '#1A0A0A' },
  { name: 'Ocean',   c1: '#00B4D8', c2: '#0077B6', c3: '#90E0EF', bg: '#05101F' },
  { name: 'Forest',  c1: '#52B788', c2: '#2D6A4F', c3: '#95D5B2', bg: '#071410' },
  { name: 'Candy',   c1: '#FF85A1', c2: '#C77DFF', c3: '#A8DAFF', bg: '#120A1A' },
  { name: 'Fire',    c1: '#FF4500', c2: '#FF8C00', c3: '#FFD700', bg: '#1A0500' },
  { name: 'Mint',    c1: '#00F5D4', c2: '#00BBF9', c3: '#F15BB5', bg: '#030F12' },
  { name: 'Mono',    c1: '#FFFFFF', c2: '#888888', c3: '#AAAAAA', bg: '#000000' },
]

export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok',    label: 'TikTok',    icon: '🎵' },
  { id: 'youtube',   label: 'YouTube',   icon: '▶️' },
  { id: 'twitter',   label: 'X/Twitter', icon: '𝕏' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: '💼' },
]

export const FONTS = [
  { id: 'Syne',            label: 'Syne',   preview: 'Aa' },
  { id: 'Space Mono',      label: 'Mono',   preview: 'Aa' },
  { id: 'Outfit',          label: 'Outfit', preview: 'Aa' },
  { id: 'DM Serif Display',label: 'Serif',  preview: 'Aa' },
]

export const SIZES = [
  { id: 'square', label: 'Square', w: 340, ar: 1.1,   desc: '1:1 Feed' },
  { id: 'story',  label: 'Story',  w: 200, ar: 0.56,  desc: '9:16' },
  { id: 'banner', label: 'Banner', w: 400, ar: 1.91,  desc: 'Wide' },
]

const DEFAULT = {
  // Template
  templateId: 'blob',

  // Content
  statNumber: '50K',
  statLabel: 'Followers',
  handle: '@yourhandle',
  growth: '▲ +12.4%',
  platformId: 'instagram',
  mini1: { value: '4.8%',  label: 'Eng. Rate' },
  mini2: { value: '1.2M',  label: 'Impressions' },
  mini3: { value: '84K',   label: 'Reach' },

  // Colors
  color1: '#FF3EA4',
  color2: '#7C3AED',
  color3: '#3DFAFF',
  colorBg: '#0D0D1A',
  activePalette: 0,

  // Typography
  fontId: 'Syne',
  numSize: 76,

  // Shape
  radius: 24,
  showMini: true,
  showLive: true,
  showWatermark: true,

  // Size
  sizeId: 'square',

  // UI state
  activePanelTab: 'content',
  isMobilePreviewOpen: false,
}

export const useStudio = create(
  persist(
    (set, get) => ({
      ...DEFAULT,

      // Setters
      setTemplate: (id) => set({ templateId: id }),
      setContent: (key, val) => set({ [key]: val }),
      setMini: (n, key, val) => set((s) => ({ [`mini${n}`]: { ...s[`mini${n}`], [key]: val } })),
      setPlatform: (id) => set({ platformId: id }),
      setColor: (key, val) => set({ [key]: val, activePalette: -1 }),
      applyPalette: (idx) => {
        const p = PALETTES[idx]
        set({ color1: p.c1, color2: p.c2, color3: p.c3, colorBg: p.bg, activePalette: idx })
      },
      setFont: (id) => set({ fontId: id }),
      setNumSize: (v) => set({ numSize: Number(v) }),
      setRadius: (v) => set({ radius: Number(v) }),
      toggle: (key) => set((s) => ({ [s]: !s[key] })),
      setToggle: (key) => set((s) => ({ [key]: !s[key] })),
      setSize: (id) => set({ sizeId: id }),
      setMobilePreview: (v) => set({ isMobilePreviewOpen: v }),

      randomize: () => {
        const rand = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
        const fonts = FONTS.map(f => f.id)
        const tmpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]
        set({
          color1: rand(),
          color2: rand(),
          color3: rand(),
          colorBg: '#' + Math.floor(Math.random() * 0x202020 + 0x050505).toString(16),
          fontId: fonts[Math.floor(Math.random() * fonts.length)],
          templateId: tmpl.id,
          activePalette: -1,
        })
      },

      reset: () => set(DEFAULT),
    }),
    {
      name: 'statzy-studio',
      partialize: (s) => ({
        templateId: s.templateId,
        statNumber: s.statNumber,
        statLabel: s.statLabel,
        handle: s.handle,
        growth: s.growth,
        platformId: s.platformId,
        color1: s.color1,
        color2: s.color2,
        color3: s.color3,
        colorBg: s.colorBg,
        fontId: s.fontId,
        numSize: s.numSize,
        radius: s.radius,
        showMini: s.showMini,
        showLive: s.showLive,
        showWatermark: s.showWatermark,
      }),
    }
  )
)
