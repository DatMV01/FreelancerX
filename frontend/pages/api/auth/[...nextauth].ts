import { axiosInstanceV1 } from "@/lib/apiClient";
import * as jwt from "jsonwebtoken";
import NextAuth, {
  AuthOptions,
  DefaultSession,
  Session,
  User,
} from "next-auth";
import { encode, JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import Google from "next-auth/providers/google";
import { setTimeout } from "node:timers/promises";

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
  phoneNumber: string;
  role: RoleDto;
  status: StatusDto;
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
    expires: DefaultSession["expires"];
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
    iat: number;
    exp: number;
    sessionId: string;
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
        email: { label: "email", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
 
        try {
          const { data, status } = await axiosInstanceV1.post(
            "/auth/email/login",
            {
              email: credentials.email,
              password: credentials.password,
            },
          );

          console.log(data);

          console.log(status);

          if (status !== 200) {
            throw new Error("Invalid credentials");
          }

          return data;
        } catch (error: any) {
       
          console.error(
            "Login error:",
            error.response?.data || error.message,
          );

          throw new Error(
            error.response?.data || "Login Failed",
          );
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
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    // async session({ session, token, user }) { return session },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        // Decode accessToken để lấy iat và exp từ backend
        const payload = jwt.decode(user.accessToken) as jwt.JwtPayload | null;
        if (payload?.exp && payload?.iat) {
          token.iat = payload.iat;
          token.exp = payload.exp;
          token.payload = payload;
        }

        token = {
          ...token,
          ...user,
        };
      }

      console.log("jwt CB", token);

      // Nếu accessToken còn hạn thì dùng tiếp
      if (!token.exp || Date.now() < Number(token.exp) * 1000) return token;

      // Nếu hết hạn thì refresh token
      return await refreshAccessToken(token);
    },

    //Hàm session() trong callbacks của NextAuth có nhiệm vụ cập nhật session object,
    // giúp client (frontend) truy cập được accessToken và thông tin user trong session.
    // const { data: session } = useSession();
    async session({ session, token }: { session: Session; token: JWT }) {
      session = {
        ...session,
        ...token,
      };

      console.log("session CB", session);

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
  debug: Boolean(process.env.NEXTAUTH_DEBUG) || true,
};

async function refreshAccessToken(token: any) {
  debugger;
  try {
    const response = await axiosInstanceV1.post("/auth/email/refresh", {
      refreshToken: token.refreshToken,
    });

    if (!(response.status === 200)) throw new Error("Failed to refresh token");

    const { accessToken, refreshToken } = response.data;

    const decoded = jwt.decode(accessToken) as jwt.JwtPayload | null;

    return {
      ...token,
      accessToken: accessToken,
      refreshToken: refreshToken,
      iat: decoded?.iat,
      exp: decoded?.exp,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

// export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
export default NextAuth(authOptions);
