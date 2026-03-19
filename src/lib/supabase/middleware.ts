import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log("🍪 [Middleware] Création cookie:", name);
            // Appliquer les mêmes options à la requête ET à la réponse
            const cookieOptions = {
              name,
              value,
              ...options,
              secure: true, // HTTPS obligatoire
              sameSite: "lax" as const, // Important pour les redirects
              path: "/",
              maxAge: 60 * 60 * 24 * 30, // 30 jours
              domain:
                process.env.NODE_ENV === "production"
                  ? ".vercel.app"
                  : undefined, // CRUCIAL pour Vercel
            };
    
            request.cookies.set(cookieOptions);
            response.cookies.set(cookieOptions);
          });
        },
      },
    } ,  
  );

  console.log(
    "🔍 [Middleware] Cookies reçus:",
    request.cookies.getAll().map((c) => c.name),
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/connexion";
    return  NextResponse.redirect(url);
  }

  return response;
}
