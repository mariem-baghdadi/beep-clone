// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import ProductActions from "./ProductActions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const { error: urlError } = (await searchParams) || {};

  // Dans le JSX, après l'en-tête, ajoutez :
  {
    urlError && (
      <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
        {urlError}
      </div>
    );
  }
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/connexion");
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("expiry_date", { ascending: true });

  if (error) {
    console.error("Erreur chargement produits:", error);
  }

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mes produits</h1>
            <p className="text-gray-600">Bienvenue, {user.email}</p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard/ajouter"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              + Ajouter un produit
            </Link>

            <Link
              href="/auth/signout"
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Déconnexion
            </Link>
          </div>
        </div>

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
            {products.map((product: any) => (
              <div key={product.id} className="rounded-lg bg-white p-4 shadow">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <span className="rounded-full bg-gray-200 px-2 py-1 text-xs">
                    {product.category}
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

                {/* Utilisation du composant client pour les actions */}
                <ProductActions productId={product.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
