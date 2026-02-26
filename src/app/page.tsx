// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      {/* Le conteneur principal avec un fond gris clair */}
      
      {/* Une carte blanche pour mettre le contenu en valeur */}
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        
        {/* Titre principal */}
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          Bienvenue sur <span className="text-blue-600">BEEP </span>
        </h1>
        
        {/* Description */}
        <p className="mb-8 text-lg text-gray-600">
          Votre application pour ne plus jamais oublier de consommer vos aliments à temps.
          Scannez, organisez, et recevez des rappels.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/auth/inscription"
            className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Créer un compte
          </Link>
          <Link
            href="/auth/connexion"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Se connecter
          </Link>
        </div>

        {/* Note : ces liens ne fonctionnent pas encore, on va les créer ensuite
        <p className="mt-6 text-sm text-gray-400">
          ⚡ Prochaine étape : créer les pages d'authentification
        </p> */}
      </div>
    </main>
  );
}