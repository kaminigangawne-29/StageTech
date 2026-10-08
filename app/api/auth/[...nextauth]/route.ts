import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Single source-of-truth Next.js App Router route handler for NextAuth.
 * All Auth.js requests (sign-in, sign-out, session, CSRF, etc.) are
 * handled here via GET and POST.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
