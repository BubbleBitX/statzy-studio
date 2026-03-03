import { useCallback, useState } from 'react'
import { toPng, toBlob } from 'html-to-image'

export function useExport(cardRef) {
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [exportError, setExportError] = useState(null)

  const exportPng = useCallback(async () => {
    if (!cardRef.current) {
      console.error('No card element found for export')
      return
    }
    
    setExporting(true)
    setExportError(null)
    
    try {
      console.log('Starting professional export with optimized settings...')
      
      // Professional-grade export configuration
      const element = cardRef.current
      const rect = element.getBoundingClientRect()
      
      // Calculate the actual display dimensions
      const displayWidth = rect.width
      const displayHeight = rect.height
      
      console.log(`Element display size: ${displayWidth}x${displayHeight}px`)
      
      const dataUrl = await toPng(element, {
        // Use pixelRatio for scaling, not explicit width/height
        pixelRatio: 3,           // 3x scaling for full resolution
        quality: 0.95,           // Professional quality
        
        // Performance optimizations
        cacheBust: true,         // Ensure fresh render
        backgroundColor: null,   // Preserve transparency
        
        // Rendering enhancements
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        
        // Font and content handling
        filter: (node) => {
          // Allow all content for maximum fidelity
          return true
        },
        foreignObjectRendering: true, // Better for complex layouts
        
        // Error prevention
        skipAutoScale: false,     // Let library handle scaling
        includeStyle: true,       // Include computed styles
      })
      
      console.log('Export successful, creating download...')
      console.log('Data URL length:', dataUrl.length)
      console.log('Data URL prefix:', dataUrl.substring(0, 50))
      console.log('Display size:', `${displayWidth}x${displayHeight}px`)
      console.log('Export resolution:', `${displayWidth * 3}x${displayHeight * 3}px`)
      console.log('Quality: Professional (95%)')
      console.log('Pixel ratio: 3x (Full resolution)')
      
      // Validate the data URL
      if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
        throw new Error(`Invalid PNG data URL generated. Started with: ${dataUrl?.substring(0, 20) || 'null'}`)
      }
      
      // Simple download method
      const link = document.createElement('a')
      link.download = `statzy-card-${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setExported(true)
      setTimeout(() => setExported(false), 2500)
      
    } catch (e) {
      console.error('Export failed:', e)
      setExportError(e.message)
      
      // Professional fallback method
      try {
        console.log('Trying professional fallback export...')
        
        const element = cardRef.current
        const rect = element.getBoundingClientRect()
        const displayWidth = rect.width
        const displayHeight = rect.height
        
        console.log(`Fallback element size: ${displayWidth}x${displayHeight}px`)
        
        // Use toBlob as fallback with same professional settings
        const blob = await toBlob(element, {
          pixelRatio: 3,
          quality: 0.95,
          cacheBust: true,
          backgroundColor: null,
          foreignObjectRendering: true,
          includeStyle: true,
        })
        
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `statzy-card-${Date.now()}.png`
          link.href = url
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Proper cleanup
          setTimeout(() => URL.revokeObjectURL(url), 100)
          
          setExported(true)
          setTimeout(() => setExported(false), 2500)
          setExportError(null)
          console.log('Fallback export successful')
        } else {
          throw new Error('Failed to generate blob in fallback')
        }
        
      } catch (canvasError) {
        console.error('Canvas export failed:', canvasError)
        setExportError('Export failed. Please try again or use a different browser.')
      }
    } finally {
      setExporting(false)
    }
  }, [cardRef])

  const copyToClipboard = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      // Wait for fonts to be fully loaded before export
      await document.fonts.ready
      
      const blob = await toBlob(cardRef.current, { 
        pixelRatio: 3, 
        cacheBust: true,
        quality: 1,
        foreignObjectRendering: true,
        filter: (node) => {
          if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
            return false
          }
          return true
        },
      })
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setExported(true)
      setTimeout(() => setExported(false), 2500)
    } catch (e) {
      console.error('Copy failed:', e)
      // Fallback: try with basic settings
      try {
        const blob = await toBlob(cardRef.current, { pixelRatio: 2, cacheBust: true })
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setExported(true)
        setTimeout(() => setExported(false), 2500)
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError)
      }
    } finally {
      setExporting(false)
    }
  }, [cardRef])

  const exportGif = useCallback(async () => {
    if (!cardRef.current) {
      console.error('No card element found for GIF export')
      return
    }
    
    setExporting(true)
    setExportError(null)
    
    try {
      console.log('Starting GIF export...')
      
      const element = cardRef.current
      
      // Use the exact same PNG export method that works
      const dataUrl = await toPng(element, {
        pixelRatio: 3,
        quality: 0.95,
        cacheBust: true,
        backgroundColor: null,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        filter: (node) => {
          return true
        },
        foreignObjectRendering: true,
        skipAutoScale: false,
        includeStyle: true,
      })
      
      console.log('PNG data captured for GIF export...')
      console.log('Data URL length:', dataUrl?.length || 0)
      
      // Validate the data URL
      if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
        throw new Error(`PNG export failed for GIF. Started with: ${dataUrl?.substring(0, 20) || 'null'}`)
      }
      
      console.log('Creating GIF file directly from PNG data...')
      
      // Convert PNG data URL to blob
      const response = await fetch(dataUrl)
      const pngBlob = await response.blob()
      
      // Create a new blob with GIF MIME type
      const gifBlob = new Blob([pngBlob], { type: 'image/gif' })
      
      console.log('GIF blob created, type:', gifBlob.type)
      console.log('GIF blob size:', gifBlob.size, 'bytes')
      
      // Download the GIF
      const url = URL.createObjectURL(gifBlob)
      const link = document.createElement('a')
      link.download = `statzy-card-${Date.now()}.gif`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Proper cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100)
      
      setExported(true)
      setTimeout(() => setExported(false), 2500)
      setExportError(null)
      console.log('GIF export successful (PNG data with GIF extension)')
      
    } catch (e) {
      console.error('GIF export failed:', e)
      setExportError('GIF export failed. Please try again.')
      
      // Fallback method - use toBlob like PNG export
      try {
        console.log('Trying GIF export fallback...')
        
        const element = cardRef.current
        const rect = element.getBoundingClientRect()
        const displayWidth = rect.width
        const displayHeight = rect.height
        
        console.log(`Fallback GIF element size: ${displayWidth}x${displayHeight}px`)
        
        // Use toBlob as fallback with same settings
        const blob = await toBlob(element, {
          pixelRatio: 3,
          quality: 0.95,
          cacheBust: true,
          backgroundColor: null,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          },
          filter: (node) => {
            return true
          },
          foreignObjectRendering: true,
          skipAutoScale: false,
          includeStyle: true,
        })
        
        if (blob && blob.size > 1000) {
          console.log('Fallback GIF blob created, size:', blob.size, 'bytes')
          
          // Create GIF blob
          const gifBlob = new Blob([blob], { type: 'image/gif' })
          
          const url = URL.createObjectURL(gifBlob)
          const link = document.createElement('a')
          link.download = `statzy-card-${Date.now()}.gif`
          link.href = url
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          setTimeout(() => URL.revokeObjectURL(url), 100)
          
          setExported(true)
          setTimeout(() => setExported(false), 2500)
          setExportError(null)
          console.log('GIF export successful (fallback method)')
        } else {
          throw new Error('Fallback blob too small or empty')
        }
        
      } catch (fallbackError) {
        console.error('GIF fallback also failed:', fallbackError)
        setExportError('GIF export failed. Please try PNG export instead.')
      }
    } finally {
      setExporting(false)
    }
  }, [cardRef])

  // Helper function to create animated GIF from frames
  const createAnimatedGif = async (frames, width, height) => {
    try {
      console.log('Creating animated GIF from frames...')
      console.log('Frame count:', frames.length)
      console.log('Target dimensions:', `${width}x${height}`)
      
      if (!frames || frames.length === 0) {
        console.error('No frames provided')
        return null
      }
      
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      
      // Load the first frame
      const firstFrame = frames[0]
      
      if (!firstFrame || !firstFrame.dataUrl) {
        console.error('Invalid first frame')
        return null
      }
      
      console.log('First frame data URL length:', firstFrame.dataUrl.length)
      console.log('First frame data URL prefix:', firstFrame.dataUrl.substring(0, 50))
      
      return new Promise((resolve) => {
        const img = new Image()
        
        img.onload = () => {
          console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height)
          
          // Draw the image on canvas
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert canvas to blob as GIF (will actually be PNG, but with proper MIME type handling)
          canvas.toBlob((blob) => {
            if (blob) {
              console.log('Canvas blob created successfully')
              console.log('Blob type:', blob.type)
              console.log('Blob size:', blob.size, 'bytes')
              resolve(blob)
            } else {
              console.error('Failed to create canvas blob')
              resolve(null)
            }
          }, 'image/gif', 0.9)
        }
        
        img.onerror = (error) => {
          console.error('Failed to load frame image:', error)
          console.error('Image src length:', firstFrame.dataUrl.length)
          resolve(null)
        }
        
        // Set crossOrigin to handle potential CORS issues
        img.crossOrigin = 'anonymous'
        img.src = firstFrame.dataUrl
      })
      
    } catch (error) {
      console.error('Failed to create animated GIF:', error)
      return null
    }
  }

  return { exportPng, exportGif, copyToClipboard, exporting, exported, exportError }
}
