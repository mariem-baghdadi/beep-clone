// app/auth/verification-email/page.tsx
import Link from "next/link"

export default function VerificationEmailPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">📧</div>
        <h1 className="mb-4 text-2xl font-bold">Vérifiez votre email</h1>
        <p className="mb-6 text-gray-600">
          Un lien de confirmation vous a été envoyé. 
          Cliquez sur ce lien pour activer votre compte.
        </p>
        <Link
          href="/auth/connexion"
          className="text-blue-600 hover:underline"
        >
          Retour à la connexion
        </Link>
      </div>
    </main>
  )
}