// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ProductInfo {
  name: string;
  expiry_date: string;
  daysLeft: number;
}

export async function sendExpiryNotification(
  userEmail: string,
  userName: string,
  products: ProductInfo[],
) {
  // Trier les produits par urgence
  const sortedProducts = [...products].sort((a, b) => a.daysLeft - b.daysLeft);

  // Compter par catégorie d'urgence
  const urgentCount = products.filter((p) => p.daysLeft <= 1).length;
  const warningCount = products.filter(
    (p) => p.daysLeft > 1 && p.daysLeft <= 3,
  ).length;
  const normalCount = products.filter((p) => p.daysLeft > 3).length;

  const subject =
    products.length === 1
      ? `🔔 1 produit va bientôt expirer`
      : `🔔 ${products.length} produits vont bientôt expirer`;

  // Fonction pour formater la date en français
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fonction pour obtenir l'icône et la couleur selon les jours restants
  const getUrgencyStyle = (daysLeft: number) => {
    if (daysLeft <= 1) {
      return {
        emoji: "🔴",
        color: "#dc2626",
        bg: "#fee2e2",
        label: "URGENT",
      };
    }
    if (daysLeft <= 3) {
      return {
        emoji: "🟠",
        color: "#f97316",
        bg: "#fff7ed",
        label: "Attention",
      };
    }
    return {
      emoji: "🟡",
      color: "#eab308",
      bg: "#fef9c3",
      label: "Bientôt",
    };
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
      
      <!-- Conteneur principal -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 20px;">
        <tr>
          <td align="center">
            <!-- Carte principale -->
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
              
              <!-- En-tête -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">BEEP Clone</h1>
                  <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Rappel de dates de péremption</p>
                </td>
              </tr>
              
              <!-- Contenu -->
              <tr>
                <td style="padding: 30px;">
                  
                  <!-- Salutation -->
                  <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.5;">
                    Bonjour <strong style="color: #2563eb;">${userName}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 25px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                    Voici les produits qui arrivent bientôt à expiration dans votre frigo :
                  </p>
                  
                  <!-- Résumé statistiques -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                      ${
                        urgentCount > 0
                          ? `
                        <td width="33%" align="center" style="padding: 10px;">
                          <div style="background-color: #fee2e2; border-radius: 12px; padding: 15px;">
                            <div style="font-size: 24px; margin-bottom: 5px;">🔴</div>
                            <div style="font-size: 20px; font-weight: bold; color: #dc2626;">${urgentCount}</div>
                            <div style="font-size: 12px; color: #991b1b;">URGENT</div>
                          </div>
                        </td>
                      `
                          : ""
                      }
                      ${
                        warningCount > 0
                          ? `
                        <td width="33%" align="center" style="padding: 10px;">
                          <div style="background-color: #fff7ed; border-radius: 12px; padding: 15px;">
                            <div style="font-size: 24px; margin-bottom: 5px;">🟠</div>
                            <div style="font-size: 20px; font-weight: bold; color: #f97316;">${warningCount}</div>
                            <div style="font-size: 12px; color: #9a3412;">Attention</div>
                          </div>
                        </td>
                      `
                          : ""
                      }
                      ${
                        normalCount > 0
                          ? `
                        <td width="33%" align="center" style="padding: 10px;">
                          <div style="background-color: #fef9c3; border-radius: 12px; padding: 15px;">
                            <div style="font-size: 24px; margin-bottom: 5px;">🟡</div>
                            <div style="font-size: 20px; font-weight: bold; color: #eab308;">${normalCount}</div>
                            <div style="font-size: 12px; color: #854d0e;">Bientôt</div>
                          </div>
                        </td>
                      `
                          : ""
                      }
                    </tr>
                  </table>
                  
                  <!-- Liste des produits -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    ${sortedProducts
                      .map((p) => {
                        const style = getUrgencyStyle(p.daysLeft);
                        return `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="40" valign="top" style="padding-right: 15px;">
                                  <div style="font-size: 24px;">${style.emoji}</div>
                                </td>
                                <td valign="top">
                                  <div style="font-weight: bold; color: #1f2937; font-size: 16px; margin-bottom: 4px;">
                                    ${p.name}
                                  </div>
                                  <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">
                                    ${formatDate(p.expiry_date)}
                                  </div>
                                  <div>
                                    <span style="display: inline-block; background-color: ${style.bg}; color: ${style.color}; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
                                      ${style.label} · ${p.daysLeft} jour${p.daysLeft > 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      `;
                      })
                      .join("")}
                  </table>
                  
                  <!-- Conseils -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                    <tr>
                      <td>
                        <h3 style="margin: 0 0 15px; color: #374151; font-size: 16px; font-weight: 600;">💡 Astuces anti-gaspillage</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                          <li>Les produits ${urgentCount > 0 ? "en rouge" : "les plus proches"} sont à consommer en priorité</li>
                          <li>Pensez à congeler ce qui peut l'être</li>
                          <li>Les fruits trop mûrs font d'excellents smoothies</li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Bouton d'action -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" 
                           style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 9999px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);">
                          📋 Voir tous mes produits
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Pied de page -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                    Cet email a été envoyé automatiquement par BEEP Clone
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    Pour modifier vos préférences de notification, 
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/preferences" style="color: #3b82f6; text-decoration: none;">cliquez ici</a>
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Signature -->
            <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px;">
              © 2026 BEEP Clone - Tous droits réservés
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    console.log(`📧 Envoi email à ${userEmail}...`);

    const { data, error } = await resend.emails.send({
      from: `BEEP Clone <${process.env.EMAIL_FROM}>`,
      to: [userEmail],
      subject: subject,
      html: html,
    });
console.log('📧 EMAIL_FROM utilisé:', process.env.EMAIL_FROM)
console.log('📧 From complet:', `BEEP Clone <${process.env.EMAIL_FROM}>`)
    if (error) {
      console.error("❌ Erreur envoi email:", error);
      return { success: false, error };
    }

    console.log("✅ Email envoyé avec succès:", { id: data?.id });
    return { success: true, data };
  } catch (error) {
    console.error("❌ Erreur:", error);
    return { success: false, error };
  }
}
