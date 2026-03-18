// lib/email-smtp.ts
import nodemailer from 'nodemailer'

interface ProductInfo {
  name: string
  expiry_date: string
  daysLeft: number
}

// Créer le transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendExpiryNotificationSMTP(
  userEmail: string,
  userName: string,
  products: ProductInfo[]
) {
  // Trier les produits par urgence
  const sortedProducts = [...products].sort((a, b) => a.daysLeft - b.daysLeft)
  
  const subject = products.length === 1 
    ? `🔔 1 produit va bientôt expirer`
    : `🔔 ${products.length} produits vont bientôt expirer`

  // Fonction pour formater la date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Style selon l'urgence (simplifié)
  const getUrgencyStyle = (daysLeft: number) => {
    if (daysLeft <= 1) return { emoji: '🔴', color: '#dc2626', label: 'URGENT' }
    if (daysLeft <= 3) return { emoji: '🟠', color: '#f97316', label: 'Attention' }
    return { emoji: '🟡', color: '#eab308', label: 'Bientôt' }
  }

  // Construire le HTML (vous pouvez reprendre le même template que Resend)
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .product { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>BEEP Clone</h1>
          <p>Rappel de dates de péremption</p>
        </div>
        <div class="content">
          <p>Bonjour <strong>${userName}</strong>,</p>
          <p>Voici les produits qui arrivent bientôt à expiration :</p>
          
          ${sortedProducts.map(p => {
            const style = getUrgencyStyle(p.daysLeft)
            return `
              <div class="product" style="border-left-color: ${style.color}">
                <div style="font-size: 20px; margin-bottom: 5px;">${style.emoji} <strong>${p.name}</strong></div>
                <div style="color: #666;">${formatDate(p.expiry_date)}</div>
                <div style="color: ${style.color}; font-weight: bold; margin-top: 5px;">
                  ${style.label} · J-${p.daysLeft}
                </div>
              </div>
            `
          }).join('')}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Voir tous mes produits
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Cet email a été envoyé automatiquement par BEEP Clone</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/preferences">Modifier mes préférences</a></p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    console.log(`📧 Envoi SMTP à ${userEmail}...`)
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BEEP Clone" <noreply@votredomaine.com>',
      to: userEmail,
      subject: subject,
      html: html,
    })

    console.log('✅ Email SMTP envoyé:', info.messageId)
    return { success: true, data: info }
    
  } catch (error) {
    console.error('❌ Erreur SMTP:', error)
    return { success: false, error }
  }
}