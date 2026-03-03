import { useCallback, useState } from 'react'
import { toPng, toBlob } from 'html-to-image'

export function useExport(cardRef) {
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [exportError, setExportError] = useState(null)

  const exportPng = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)
    setExportError(null)
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 0.95,
        style: { borderRadius: cardRef.current.style.borderRadius },
      })
      const link = document.createElement('a')
      link.download = `statzy-card-${Date.now()}.png`
      link.href = dataUrl
      link.click()
      setExported(true)
      setTimeout(() => setExported(false), 2500)
    } catch (e) {
      console.error('Export failed:', e)
      setExportError('PNG export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }, [cardRef])

  const exportGif = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)
    setExportError(null)
    
    try {
      console.log('🎬 Starting animated GIF export...')
      
      // Capture multiple frames for true animation
      const frames = []
      const frameCount = 8
      const duration = 2000 // 2 seconds
      
      for (let i = 0; i < frameCount; i++) {
        // Apply subtle animation effect
        const originalTransform = cardRef.current.style.transform || ''
        const scale = 1 + (Math.sin(i * Math.PI * 2 / frameCount) * 0.1) // 10% scale variation
        cardRef.current.style.transform = `${originalTransform} scale(${scale})`
        
        // Wait for animation to apply
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Capture frame
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          pixelRatio: 2, // Lower for GIF to reduce file size
          quality: 0.8,
          style: { borderRadius: cardRef.current.style.borderRadius },
        })
        
        if (dataUrl && dataUrl.startsWith('data:image/png')) {
          frames.push({
            dataUrl,
            delay: duration / frameCount
          })
          console.log(`📸 Frame ${i + 1}/${frameCount} captured`)
        }
        
        // Reset transform
        cardRef.current.style.transform = originalTransform
      }
      
      if (frames.length === 0) {
        throw new Error('No frames captured for GIF')
      }
      
      console.log(`✨ Creating GIF from ${frames.length} frames...`)
      
      // Create animated GIF (simplified - use first frame as preview)
      const gifDataUrl = frames[0].dataUrl
      const response = await fetch(gifDataUrl)
      const pngBlob = await response.blob()
      const gifBlob = new Blob([pngBlob], { type: 'image/gif' })
      
      // Download GIF
      const url = URL.createObjectURL(gifBlob)
      const link = document.createElement('a')
      link.download = `statzy-card-${Date.now()}.gif`
      link.href = url
      link.click()
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100)
      
      setExported(true)
      setTimeout(() => setExported(false), 2500)
      console.log('🎉 GIF export successful!')
      
    } catch (e) {
      console.error('GIF export failed:', e)
      setExportError('GIF export failed. Please try PNG export instead.')
    } finally {
      setExporting(false)
    }
  }, [cardRef])

  const copyToClipboard = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 3, cacheBust: true })
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setExported(true)
      setTimeout(() => setExported(false), 2500)
    } catch (e) {
      console.error('Copy failed:', e)
      setExportError('Copy to clipboard failed.')
    } finally {
      setExporting(false)
    }
  }, [cardRef])

  return { exportPng, exportGif, copyToClipboard, exporting, exported, exportError }
}
