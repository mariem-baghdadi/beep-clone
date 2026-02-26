'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library'
interface Props {
  onScan: (result: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Préparation...')
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    let mounted = true

    const startScanner = async () => {
      try {
        setStatus('Création du lecteur...')
        codeReaderRef.current = new BrowserMultiFormatReader()
        
        setStatus('Recherche des caméras...')
        const devices = await codeReaderRef.current.listVideoInputDevices()
        
        if (devices.length === 0) {
          throw new Error('Aucune caméra trouvée')
        }

        // Prendre la caméra arrière (généralement la dernière)
        const deviceId = devices[devices.length - 1].deviceId
        setStatus(`Caméra trouvée, démarrage...`)

        if (!mounted) return

        await codeReaderRef.current.decodeFromVideoDevice(
          deviceId,
          videoRef.current!,
          (result, error) => {
            if (!mounted) return

            if (result) {
              console.log('✅ Code détecté:', result.getText())
              onScan(result.getText())
            }
            
            if (error && !error.message.includes('NotFoundException')) {
              console.log('Erreur de scan:', error.message)
            }
          }
        )

        setStatus('Prêt à scanner')
        
      } catch (err) {
        console.error('Erreur:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      }
    }

    startScanner()

    return () => {
      mounted = false
      if (codeReaderRef.current) {
        codeReaderRef.current.reset()
      }
    }
  }, [onScan, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Scanner un code-barres</h3>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>
        
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            playsInline
          />
        </div>
        
        <p className="mt-2 text-center text-sm text-gray-600">{status}</p>
        
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
        )}
        
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg border px-4 py-2"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}