import { useCallback, useState } from 'react'
import { toPng, toBlob } from 'html-to-image'
import { useStudio } from './store/useStudio'

export function useExport(cardRef) {
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [exportError, setExportError] = useState(null)
  const { sizeId } = useStudio()

  const exportPng = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)
    setExportError(null)
    
    try {
      // Get platform-specific export dimensions
      const size = useStudio.getState().sizeId
      const sizeConfig = useStudio.getState().SIZES.find(s => s.id === size)
      
      if (!sizeConfig) {
        throw new Error('Invalid size configuration')
      }
      
      const { exportWidth, exportHeight } = sizeConfig
      
      console.log(`Exporting ${size} at ${exportWidth}x${exportHeight}px`)
      
      // Create a temporary container with standard export dimensions
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '-9999px'
      tempContainer.style.width = `${exportWidth}px`
      tempContainer.style.height = `${exportHeight}px`
      tempContainer.style.overflow = 'hidden'
      tempContainer.style.background = 'transparent'
      
      // Clone the card for export
      const cardClone = cardRef.current.cloneNode(true)
      cardClone.style.width = '100%'
      cardClone.style.height = '100%'
      cardClone.style.transform = 'none'
      cardClone.style.borderRadius = cardRef.current.style.borderRadius || '24px'
      
      // Scale the content to fit the export dimensions
      const currentWidth = cardRef.current.offsetWidth
      const currentHeight = cardRef.current.offsetHeight
      const scaleX = exportWidth / currentWidth
      const scaleY = exportHeight / currentHeight
      const scale = Math.min(scaleX, scaleY)
      
      cardClone.style.transform = `scale(${scale})`
      cardClone.style.transformOrigin = 'top left'
      
      tempContainer.appendChild(cardClone)
      document.body.appendChild(tempContainer)
      
      // Export with high quality
      const dataUrl = await toPng(tempContainer, {
        cacheBust: true,
        pixelRatio: 2, // High quality export
        quality: 0.95,
        backgroundColor: null,
        width: exportWidth,
        height: exportHeight,
        style: {
          transform: 'none',
        },
        filter: (node) => {
          // Skip any hidden elements
          return node.style?.display !== 'none'
        },
      })
      
      // Clean up
      document.body.removeChild(tempContainer)
      
      if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
        throw new Error('Failed to generate PNG data')
      }
      
      // Download with platform-specific filename
      const link = document.createElement('a')
      link.download = `statzy-${size}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
      
      setExported(true)
      setTimeout(() => setExported(false), 2500)
      
      console.log(`✅ Export successful: ${exportWidth}x${exportHeight}px`)
      
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
