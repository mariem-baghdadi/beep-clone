// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // IMPORTANT: Options adaptées à la production
          const cookieOptions = {
            name,
            value,
            ...options,
            secure: true,                 // Obligatoire en HTTPS
            sameSite: "lax",               // Nécessaire pour les redirects
            httpOnly: false,                // Accessible par le JS
            path: "/",
            maxAge: 60 * 60 * 24 * 7,       // 7 jours
            domain: process.env.NODE_ENV === "production" 
              ? ".vercel.app"                // Adapte à ton domaine
              : undefined,
          };

          request.cookies.set(cookieOptions);
          supabaseResponse.cookies.set(cookieOptions);
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 0,
          });
          supabaseResponse.cookies.set({
            name,
            value: "",
            ...options,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 0,
          });
        },
      },
    },
  );
console.log('🔍 Cookies présents:', request.cookies.getAll().map(c => c.name))
console.log('🔍 URL:', request.url)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/connexion";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}