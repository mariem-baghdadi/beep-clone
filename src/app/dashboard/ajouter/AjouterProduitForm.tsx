// app/dashboard/ajouter/AjouterProduitForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import BarcodeScanner from "@/component/BarcodeScanner";

interface Props {
  addProduct: (formData: FormData) => Promise<void>;
  categories: string[];
}

export default function AjouterProduitForm({ addProduct, categories }: Props) {
  const [showScanner, setShowScanner] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");

  const handleUseManualBarcode = () => {
    if (manualBarcode.trim()) {
      setBarcode(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  return (
    <>
      {showScanner && (
        <BarcodeScanner
          onScan={(result) => {
            console.log("Code reçu:", result);
            setBarcode(result);
            setShowScanner(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              ← Retour au dashboard
            </Link>
          </div>

          <div className="rounded-lg bg-white p-8 shadow">
            <h1 className="mb-6 text-2xl font-bold">Ajouter un produit</h1>

            <form action={addProduct} className="space-y-4">
              {/* Champ code-barres avec scanner */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code-barres
                </label>
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="barcode"
                      value={barcode}
                      readOnly
                      className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2"
                      placeholder="Scannez ou saisissez le code"
                    />
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      📸 Scanner
                    </button>
                  </div>

                  {/* Saisie manuelle alternative */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualBarcode}
                      onChange={(e) => setManualBarcode(e.target.value)}
                      placeholder="Ou saisissez le code manuellement"
                      className="flex-1 rounded-lg border border-gray-300 p-2"
                    />
                    <button
                      type="button"
                      onClick={handleUseManualBarcode}
                      disabled={!manualBarcode.trim()}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Utiliser
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom du produit *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                  placeholder="Ex: Lait demi-écrémé"
                />
              </div>

              <div>
                <label
                  htmlFor="expiry_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date de péremption *
                </label>
                <input
                  type="date"
                  id="expiry_date"
                  name="expiry_date"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Catégorie *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes (optionnel)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                  placeholder="Informations supplémentaires..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Ajouter le produit
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
