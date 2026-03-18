// app/dashboard/preferences/PreferencesForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
  user: any
  preferences: {
    notifications_enabled: boolean
    notify_7_days: boolean
    notify_3_days: boolean
    notify_1_day: boolean
    notification_email: string
  }
}

export default function PreferencesForm({ user, preferences }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState(preferences)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      console.log('📤 Envoi des données:', formData)
      
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('📥 Réponse:', response.status, data)

      if (response.ok) {
        setMessage('✅ Préférences mises à jour avec succès')
        setTimeout(() => {
          router.refresh()
        }, 1500)
      } else {
        setMessage(`❌ Erreur: ${data.error || 'Inconnue'}`)
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error)
      setMessage('❌ Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Retour au dashboard
          </Link>
        </div>
        
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-2 text-2xl font-bold">Préférences de notification</h1>
          <p className="mb-6 text-gray-600">
            Gérez comment et quand vous recevez les alertes de péremption
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Activation globale avec beau toggle */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <h3 className="font-medium">Activer les notifications</h3>
                <p className="text-sm text-gray-500">
                  Recevoir des alertes par email
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications_enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications_enabled: e.target.checked
                  })}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>

            {/* Email de notification */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email de notification
              </label>
              <input
                type="email"
                value={formData.notification_email}
                onChange={(e) => setFormData({
                  ...formData,
                  notification_email: e.target.value
                })}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                placeholder="votre@email.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                Laissez vide pour utiliser votre email de connexion
              </p>
            </div>

            {/* Délais de notification avec beaux toggles */}
            <div className="space-y-4">
              <h3 className="font-medium">M'avertir</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">7 jours avant expiration</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={formData.notify_7_days}
                    onChange={(e) => setFormData({
                      ...formData,
                      notify_7_days: e.target.checked
                    })}
                    disabled={!formData.notifications_enabled}
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-disabled:opacity-50"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">3 jours avant expiration</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={formData.notify_3_days}
                    onChange={(e) => setFormData({
                      ...formData,
                      notify_3_days: e.target.checked
                    })}
                    disabled={!formData.notifications_enabled}
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-disabled:opacity-50"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">1 jour avant expiration</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={formData.notify_1_day}
                    onChange={(e) => setFormData({
                      ...formData,
                      notify_1_day: e.target.checked
                    })}
                    disabled={!formData.notifications_enabled}
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-disabled:opacity-50"></div>
                </label>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </Link>
            </div>

            {message && (
              <div className="rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-600">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}