import * as jwt from "jsonwebtoken";
import NextAuth, { AuthOptions, DefaultSession, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { setTimeout } from "node:timers/promises";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */

  interface User {
    id: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    accessToken: string;
    refreshToken: string;
    user: any;
  }
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**user
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string,
      accessToken: string;
      refreshToken: string;
      username: string;
    } & DefaultSession["user"];
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** This is an example. You can find me in types/next-auth.d.ts */
    accessToken: string;
    user: User;
    exp: number | undefined;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.NEXTAUTH_GOOGLE_ID || "",
      clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await setTimeout(1000);
        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/auth/email/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials as any),
            },
          );

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          if (response.ok && response.status === 200) {
            const data = await response.json();
            return data;
          }

          return null;
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  session: { strategy: "jwt" },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    // async session({ session, token, user }) { return session },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
    async jwt({ token, user: data }) {
      if (data) {
        const decodedAccessToken = jwt.decode(
          data.accessToken,
        ) as jwt.JwtPayload;

        token.user = data.user;
        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken;
        token.iat = decodedAccessToken.iat;
        token.exp = decodedAccessToken.exp;
      }

      if (typeof token.exp === "number" && Date.now() < token.exp * 1000) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session = {
        ...session,
        user: token.user as any,
        accessToken: token.accessToken as any,
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
  debug: Boolean(process.env.NEXTAUTH_DEBUG) || true,
};
async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/auth/email/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const newTokens = await res.json();

    const decodedAccessToken = jwt.decode(
      newTokens.accessToken,
    ) as jwt.JwtPayload;

    return {
      ...token,
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken || token.refreshToken,
      iat: decodedAccessToken.iat,
      exp: decodedAccessToken.exp,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

// export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
export default NextAuth(authOptions);
