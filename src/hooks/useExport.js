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

  return { exportPng, copyToClipboard, exporting, exported, exportError }
}
