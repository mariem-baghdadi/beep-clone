// app/api/cron/check-expiry/route.ts
import { createClient } from "@/lib/supabase/server";
import { sendExpiryNotification } from "@/lib/email";
import { NextResponse } from "next/server";
import { sendExpiryNotificationSMTP } from "@/lib/email-smtp";

export async function GET() {
  try {
    const supabase = await createClient();

    // Dates clés
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);
    const in7DaysStr = in7Days.toISOString().split("T")[0];

    console.log("🔍 Vérification pour tous les utilisateurs");
    console.log("Période:", todayStr, "→", in7DaysStr);
    console.log("🔬 TEST ULTIME avec dates en dur");

    const { data: testHardcoded, error: hardError } = await supabase
      .from("products")
      .select("id, name, expiry_date")
      .gte("expiry_date", "2026-03-17")
      .lte("expiry_date", "2026-03-24");

    console.log(
      "✅ Résultat test en dur:",
      testHardcoded?.length || 0,
      "produits",
    );
    if (hardError) console.log("❌ Erreur:", hardError);
    if (testHardcoded?.length) console.table(testHardcoded);
    console.log("🔬 TEST 2: Tous les produits sans filtre");

    const { data: allProducts, error: allError } = await supabase
      .from("products")
      .select("id, name, expiry_date");

    if (allError) {
      console.log("❌ Erreur:", allError);
    } else {
      console.log(`✅ ${allProducts?.length || 0} produits trouvés`);
      if (allProducts?.length) {
        console.table(allProducts);
      }
    }
    // ÉTAPE 1 : Récupérer tous les produits qui expirent dans les 7 jours
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .gte("expiry_date", todayStr)
      .lte("expiry_date", in7DaysStr)
      .order("expiry_date", { ascending: true });

    if (productsError) {
      console.error("❌ Erreur produits:", productsError);
      return NextResponse.json(
        { error: productsError.message },
        { status: 500 },
      );
    }

    console.log(`📦 ${products?.length || 0} produits trouvés`);

    if (!products || products.length === 0) {
      return NextResponse.json({
        message: "Aucun produit à notifier",
        products: 0,
      });
    }

    // ÉTAPE 2 : Récupérer les emails des utilisateurs UNIQUEMENT pour les produits trouvés
    const userIds = [...new Set(products.map((p) => p.user_id))];
    console.log("👤 IDs utilisateurs concernés:", userIds);

    // Récupérer les emails depuis la table users (qui a maintenant la politique publique)
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email")
      .in("id", userIds);

    if (usersError) {
      console.error("❌ Erreur récupération users:", usersError);
    } else {
      console.log(
        `✅ ${users?.length || 0} utilisateurs trouvés dans la table users`,
      );
    }

    // Créer le dictionnaire des emails
    const userEmails: Record<string, string> = {};
    users?.forEach((user) => {
      if (user.email) {
        userEmails[user.id] = user.email;
        console.log(`✅ Email trouvé: ${user.email}`);
      }
    });
    // ÉTAPE 3 : Grouper les produits par utilisateur
    const userProducts: Record<string, any[]> = {};

    products.forEach((product) => {
      const userEmail = userEmails[product.user_id];
      if (!userEmail) return;

      if (!userProducts[userEmail]) {
        userProducts[userEmail] = [];
      }
      userProducts[userEmail].push(product);
    });

    console.log(
      `👥 ${Object.keys(userProducts).length} utilisateur(s) avec des produits`,
    );

    // ÉTAPE 4 : Envoyer les notifications
    const results = [];

    for (const [userEmail, productList] of Object.entries(userProducts)) {
      // Calculer les jours restants pour chaque produit
      const productsWithDays = productList.map((p) => ({
        name: p.name,
        expiry_date: p.expiry_date,
        daysLeft: getDaysLeft(p.expiry_date),
      }));

      console.log(
        `📧 Envoi à ${userEmail} (${productsWithDays.length} produits)`,
      );

      const emailResult = await sendExpiryNotificationSMTP(
        userEmail,
        userEmail.split("@")[0],
        productsWithDays,
      );

      if (emailResult.success) {
        console.log(`✅ Email envoyé à ${userEmail}`);
        results.push({
          email: userEmail,
          productsNotified: productsWithDays.length,
          success: true,
        });
      } else {
        console.error(`❌ Échec pour ${userEmail}:`, emailResult.error);
        results.push({
          email: userEmail,
          error: emailResult.error,
          success: false,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Notifications envoyées à ${results.length} utilisateurs`,
      details: results,
      totalProducts: products.length,
    });
  } catch (error) {
    console.error("❌ Erreur générale:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 },
    );
  }
}

// Fonction utilitaire pour calculer les jours restants
function getDaysLeft(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
