// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProductActions from "@/components/ProductActions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/connexion");
  }

  // Version CORRIGÉE avec la bonne jointure
  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories!category_id (
        name
      )
    `,
    )
    .order("expiry_date", { ascending: true });

  if (error) {
    console.error("Erreur chargement produits:", error);
  }

  console.log("Produits chargés:", products); // Pour debug

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const getExpiryColor = (date: string) => {
    const today = new Date();
    const expiry = new Date(date);
    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "text-red-600 font-bold";
    if (diffDays <= 3) return "text-orange-600 font-semibold";
    if (diffDays <= 7) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* En-tête */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Partie gauche - Titre et email */}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-800 truncate sm:text-3xl">
              Mes produits
            </h1>
            <p className="truncate text-sm text-gray-600 sm:text-base">
              Bienvenue, {user.email?.toString().split("@")[0]}
            </p>
          </div>

          {/* Partie droite - Boutons */}
          <div className="flex flex-wrap items-center jus gap-2 sm:gap-4">
            {/* Bouton Ajouter - toujours visible */}
            <Link
              href="/dashboard/ajouter"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-base"
              title="Ajouter un produit"
            >
              <span className="text-lg">+</span>
              <span className="hidden sm:ml-1 sm:inline">
                Ajouter un produit
              </span>
            </Link>

            {/* Boutons secondaires - icônes seulement sur mobile, texte sur desktop */}
            <Link
              href="/dashboard/preferences"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-2 py-2 text-gray-700 transition hover:bg-gray-50 sm:px-4 sm:py-2"
              title="Préférences"
            >
              <span className="text-lg">⚙️</span>
              <span className="hidden sm:ml-1 sm:inline">Préférences</span>
            </Link>

            <Link
              href="/dashboard/categories"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-2 py-2 text-gray-700 transition hover:bg-gray-50 sm:px-4 sm:py-2"
              title="Catégories"
            >
              <span className="text-lg">🏷️</span>
              <span className="hidden sm:ml-1 sm:inline">Catégories</span>
            </Link>

            {/* Bouton Déconnexion - icône seulement sur mobile, texte sur desktop */}
            <Link
              href="/auth/signout"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-2 py-2 text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:py-2"
              title="Déconnexion"
            >
              <span className="text-lg">🚪</span>
              <span className="hidden sm:ml-1 sm:inline">Déconnexion</span>
            </Link>
          </div>
        </div>
        {/* Liste des produits */}
        {!products || products.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-lg text-gray-600">
              Vous n'avez pas encore de produits.
            </p>
            <Link
              href="/dashboard/ajouter"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Ajoutez votre premier produit →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product: any) => {
              // Récupérer le nom de la catégorie correctement
              const categoryName = product.categories?.name || "Autre";

              return (
                <div
                  key={product.id}
                  className="rounded-lg bg-white p-4 shadow"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs">
                      {categoryName}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-600">Expire le :</span>{" "}
                      <span className={getExpiryColor(product.expiry_date)}>
                        {formatDate(product.expiry_date)}
                      </span>
                    </p>

                    {product.barcode && (
                      <p className="text-xs text-gray-400">
                        Code: {product.barcode}
                      </p>
                    )}

                    {product.notes && (
                      <p className="text-xs italic text-gray-500">
                        📝 {product.notes}
                      </p>
                    )}
                  </div>

                  <ProductActions productId={product.id} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
