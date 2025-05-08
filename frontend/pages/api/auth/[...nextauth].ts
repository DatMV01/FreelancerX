import { refreshAccessToken } from "@/pages/auth/auth";
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

          const authResponse = await response.json();
          return authResponse; // Successful login
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
    async jwt({ token, user: authResponse, trigger, session }) {
      if (authResponse) {
        // Decode accessToken để lấy iat và exp từ backend
        // const payload = jwt.decode(user.accessToken) as jwt.JwtPayload | null;

        token = {
          accessToken: authResponse.accessToken,
          refreshToken: authResponse.refreshToken,
          accessExpires: authResponse.accessExpires,
          refreshExpires: authResponse.refreshExpires,
          accessTokenExpires:
            (jwt.decode(authResponse.accessToken) as any)?.exp * 1000,
          user: {
            id: authResponse.user.id,
            avatar: authResponse.user.avatar,
            email: authResponse.user.email,
            provider: authResponse.user.provider,
            fullName: authResponse.user.fullName,
            country: authResponse.user.country,
            phone: authResponse.user.phone,
            role: {
              id: authResponse.user.role.id,
              name: authResponse.user.role.name,
            },
            status: {
              id: authResponse.user.status.id,
              name: authResponse.user.status.name,
            },
            freelancer: authResponse?.user?.freelancer
              ? {
                  id: authResponse.user.freelancer?.id || null,
                  level: authResponse.user.freelancer?.level || null,
                  displayName:
                    authResponse.user.freelancer?.displayName || null,
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

          token.user = {
            ...data,
            freelancer: {
              id: data.freelancer?.id || null,
              level: data.freelancer?.level || null,
              displayName: data.freelancer?.displayName || null,
            },
          };
        } catch (error: any) {
          const errorMessage =
            error.response?.data || error.message || "An error occurred";

          throw new Error(errorMessage);
        }
      }

      // const refreshBuffer = 60 * 60 * 1000; // 60 minutes before expiration
      // if (Date.now() < token.accessExpires - refreshBuffer) {

      if (Date.now() < token.accessExpires) {
        console.log("====================");
        console.log("Token still valid, no refresh needed.");
        // console.log("token.user", token.user);
        //  console.log("user", user);
        // console.log("trigger", trigger);
        // console.log("session", session);
        console.log("====================");
        return token;
      }

      return await refreshAccessToken(token);
    },

    //Hàm session() trong callbacks của NextAuth có nhiệm vụ cập nhật session object,
    // giúp client (frontend) truy cập được accessToken và thông tin user trong session.
    // const { data: session } = useSession();
    //    // Thêm accessToken từ token vào session

    async session({ session, token }: { session: Session; token: JWT }) {
      // Nếu token null (bị logout), session sẽ bị xoá
      if (
        !token ||
        !token.accessToken ||
        token.error === "RefreshAccessTokenError"
      ) {
        return null as any;
      }

      session = {
        ...token,
      } as any;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

// export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
export default NextAuth(authOptions);
