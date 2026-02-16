import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  try {
    const route = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value;

    const isPrivate = route.startsWith("/user") || route.startsWith("/admin");

    //Si el usuario no está autenticado y la ruta es privada, redirigir hacia el login.
    if (isPrivate && !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    //Si el usuario está autenticado y la ruta es privada, redirigir hacia el dashboard.
    if (!isPrivate && token) {
      const role = request.cookies.get('role')?.value;
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.error();
  }
}

export const config = {
  matcher: '/about/:path*',
}
