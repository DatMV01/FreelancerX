import * as jwt from "jsonwebtoken";
import NextAuth, { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

interface RoleDto {
  id: number;
  name: string;
}

interface UserDto {
  id: string;
  email: string;
  provider: string;
  fullName: string;
  country: string;
  phone: string;
  role: RoleDto;
  status: StatusDto;
  avatar?: string;
  freelancer?: any;
}

interface StatusDto {
  id: number;
  name: string;
}

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */

  interface User {
    accessToken: string;
    refreshToken: string;
    accessExpires: number;
    refreshExpires: number;
    user: UserDto;
  }
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**user
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session extends User {
    expires: number;
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** JWT Backend Type */
    accessToken: string;
    refreshToken: string;
    user: UserDto;
    accessExpires: number;
    refreshExpires: number;
    payload: any;
  }
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined.");
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
        email: { label: "email", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/email/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await response.json();
          return data; // Successful login
        } catch (error: any) {
          const errorMessage =
            error.response?.data || error.message || "An error occurred";

          console.error("Login error:", errorMessage);

          throw new Error(errorMessage);
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
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 0, // Disables rolling session
  },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    // async session({ session, token, user }) { return session },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user: User;
      trigger: any;
      session: any;
    }) {
      if (user) {
        // Decode accessToken để lấy iat và exp từ backend
        // const payload = jwt.decode(user.accessToken) as jwt.JwtPayload | null;

        token = {
          // expires: user.accessExpires,
          // payload,
          // ...user,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessExpires: user.accessExpires,
          refreshExpires: user.refreshExpires,
          user: {
            id: user.user.id,
            avatar: user.user.avatar,
            email: user.user.email,
            provider: user.user.provider,
            fullName: user.user.fullName,
            country: user.user.country,
            phone: user.user.phone,
            role: {
              id: user.user.role.id,
              name: user.user.role.name,
            },
            status: {
              id: user.user.status.id,
              name: user.user.status.name,
            },
            freelancer: user?.user?.freelancer?.id
              ? {
                  id: user.user.freelancer?.id || null,
                  level: user.user.freelancer?.level || null,
                  displayName: user.user.freelancer?.displayName || null,
                }
              : null,
          },
        } as any;
      }


      if (trigger === "update") {
         
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await response.json();

          token = {
            ...token,
            user: {
              ...data,
              freelancer: {
                id: data.freelancer?.id || null,
                level: data.freelancer?.level || null,
                displayName: data.freelancer?.displayName || null,
              },
            },
          };
        } catch (error: any) {
          const errorMessage =
            error.response?.data || error.message || "An error occurred";

          throw new Error(errorMessage);
        }
      }

      console.log("user", user);
      console.log("token", token);
      console.log("trigger", trigger);
      console.log("session", session);

      const refreshBuffer = 60 * 60 * 1000; // 60 minutes before expiration
      if (Date.now() < token.accessExpires - refreshBuffer) {
        console.log("Token still valid, no refresh needed.");
        return token;
      }

      console.log("Token expired or close to expiration, refreshing...");
      return refreshAccessToken(token);
    },

    //Hàm session() trong callbacks của NextAuth có nhiệm vụ cập nhật session object,
    // giúp client (frontend) truy cập được accessToken và thông tin user trong session.
    // const { data: session } = useSession();
    async session({ session, token }: { session: Session; token: JWT }) {
      session = {
        ...session,
        ...token,
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token.refreshToken}` },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      },
    );

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    const payload = jwt.decode(data.accessToken) as jwt.JwtPayload | null;

    token = {
      expires: data.accessExpires,
      payload,
      ...data,
    } as any;

    return token;
  } catch (error) {
    console.error("Error refreshing access token", error);

    // Force logout by clearing the session
    return {
      error: "RefreshAccessTokenError",
      accessToken: null,
      refreshToken: null,
      user: null,
      expires: 0,
    } as any;
  }
}

// export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
export default NextAuth(authOptions);
