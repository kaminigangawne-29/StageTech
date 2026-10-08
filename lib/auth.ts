import { NextAuthOptions, getServerSession as nextAuthGetServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Extend next-auth types to include id and role on the session / token.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "TECHNICIAN" | "PRODUCTION" | "ADMIN";
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "TECHNICIAN" | "PRODUCTION" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "TECHNICIAN" | "PRODUCTION" | "ADMIN";
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) {
          // Use a generic message to avoid leaking whether the email exists.
          throw new Error("Invalid email or password.");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "TECHNICIAN" | "PRODUCTION" | "ADMIN",
        };
      },
    }),
  ],

  callbacks: {
    /**
     * Runs when a JWT is created (sign-in) or updated.
     * Persist the user id and role on the token so they survive across requests.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },

    /**
     * Runs whenever the session is checked.
     * Surface id and role on the client-accessible session object.
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // Redirect auth errors back to the login page with ?error=...
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
};

/**
 * Convenience wrapper so callers don't have to import `authOptions` separately.
 *
 * Usage (Server Component / Route Handler):
 *   const session = await getServerSession();
 */
export const getServerSession = () =>
  nextAuthGetServerSession(authOptions);
