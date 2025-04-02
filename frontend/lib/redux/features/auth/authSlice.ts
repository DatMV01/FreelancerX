import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { signIn, signOut } from "next-auth/react";
import { createAppSlice } from "../../createAppSlice";

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
  avatar: string;
  role: RoleDto;
  status: StatusDto;
  freelancer?: any;
}

interface StatusDto {
  id: number;
  name: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  accessExpires: number | null;
  refreshExpires: number | null;
  payload: any | null;
  user: UserDto | null;
  expires: Date | null;
  status: "idle" | "loading" | "failed";
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  accessExpires: null,
  refreshExpires: null,
  payload: null,
  user: null,
  expires: null,
  status: "idle",
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    setAccessToken: create.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.accessToken = action.payload;
      },
    ),

    setUser: create.reducer((state, action: PayloadAction<UserDto | null>) => {
      state.user = action.payload;
    }),

    setAuthFromSession: create.reducer(
      (state, action: PayloadAction<AuthState>) => {
        const {
          accessToken,
          refreshToken,
          user,
          accessExpires,
          refreshExpires,
          payload,
          expires,
        } = action.payload;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = user;
        state.accessExpires = accessExpires;
        state.refreshExpires = refreshExpires;
        state.payload = payload;
        state.expires = expires;
      },
    ),

    logout: create.reducer((state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.accessExpires = null;
      state.refreshExpires = null;
      state.payload = null;
    }),

    loginAsync: create.asyncThunk(
      async (payload: {
        provider: "credentials" | "google";
        email?: string;
        password?: string;
      }) => {
        if (payload.provider === "google") {
          const result = (await signIn("google", { redirect: false })) as any;

          if (!result?.ok) {
            throw new Error(result?.error || "Google login failed");
          }

          return {
            accessToken: result.accessToken,
            user: result.user, // NextAuth sẽ trả về user
          };
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const result = (await signIn("credentials", {
            redirect: false,
            email: payload.email,
            password: payload.password,
          })) as any;

          return result;
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),

    logoutAsync: create.asyncThunk(
      async () => {
        await signOut();
      },
      {
        fulfilled: (state) => {
          state.accessToken = null;
          state.refreshToken = null;
          state.user = null;
          state.accessExpires = null;
          state.refreshExpires = null;
          state.payload = null;
        },
      },
    ),

    refreshAccessTokenAsync: create.asyncThunk(
      async (refreshToken: string, { rejectWithValue }) => {
        try {
          const response = await axios.post("/api/auth/refresh-token", {
            refreshToken,
          });
          return response.data;
        } catch (error) {
          return rejectWithValue("Refresh token failed");
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.accessExpires = Date.now() + action.payload.expiresIn * 1000;
        },
        rejected: (state) => {
          state.status = "failed";
          state.accessToken = null;
          state.refreshToken = null;
          state.user = null;
        },
      },
    ),
  }),

  selectors: {
    selectAccessToken: (auth) => auth.accessToken,
    selectRefreshToken: (auth) => auth.refreshToken,
    selectAuthStatus: (auth) => auth.status,
    selectUser: (auth) => auth.user,
    selectIsLogin: (auth): boolean => auth.user !== null,
  },
});

export const {
  setAccessToken,
  setUser,
  logout,
  loginAsync,
  logoutAsync,
  setAuthFromSession,
  refreshAccessTokenAsync,
} = authSlice.actions;

export const {
  selectAccessToken,
  selectAuthStatus,
  selectUser,
  selectRefreshToken,
  selectIsLogin,
} = authSlice.selectors;
