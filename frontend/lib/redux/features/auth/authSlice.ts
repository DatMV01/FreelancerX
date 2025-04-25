import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { createAppSlice } from "../../createAppSlice";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { RoleEnum } from "@/dto/dto.type.";

enum FreelancerRankEnum {
  NEW = "NEW",
  LEVEL1 = "LEVEL1",
  LEVEL2 = "LEVEL2",
  LEVEL3 = "LEVEL3",
}

enum FreelancerSkillProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

enum FreelancerLanguageProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  FLUENT = "Fluent",
}

interface FreelancerLanguage {
  id: number;
  alpha3: string;
  name: string;
  proficiency: FreelancerLanguageProficiency;
}

interface FreelancerSkill {
  id: number;
  name: string;
  proficiency: FreelancerSkillProficiency;
}

interface FreelancerProfile {
  createdAt: string;
  id: string;
  email: string;
  country: string;
  userId: string;
  level: FreelancerRankEnum;
  bio: string;
  avatar: string;
  phone: string;
  freelancersLanguages: FreelancerLanguage[];
  freelancersSkills: FreelancerSkill[];
  reviewCount: number;
  completedOrderCount: number;
  earnings: string;
  withdrawnAmount: string;
  completedRate: string;
  reviews?: {
    id: number;
    username: string;
    rating: number;
    comment: string;
  }[];
  gigs?: {
    id: number;
    title: string;
    description: string;
    price: number;
    deliveryTime: string;
    revisions: number;
    rating: number;
    reviews: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    freelancerId: string;
    status: string;
  }[];
}

interface RoleDto {
  id: number;
  name: string;
}

interface UserDto {
  id: string;
  email: string;
  provider: string;
  fullName: string;
  phone: string;
  country: string;
  phoneNumber: string;
  avatar: string;
  role: RoleDto;
  status: StatusDto;
  freelancer?: FreelancerProfile | null;
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
  sesion: null;
  freelancer: FreelancerProfile | null;
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
  sesion: null,
  freelancer: null,
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
        state.status = "loading";

        const {
          accessToken,
          refreshToken,
          user,
          accessExpires,
          refreshExpires,
          payload,
          expires,
        } = action.payload;
        state.sesion = action.payload as any;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = user;
        state.freelancer = state.freelancer ?? (user?.freelancer as any);
        state.accessExpires = accessExpires;
        state.refreshExpires = refreshExpires;
        state.payload = payload;
        state.expires = expires;

        state.status = "idle";
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

    syncNexthAuthSesion: create.asyncThunk(
      async () => {
        debugger;
        const session = await getSession();

        return session;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          debugger;

          const sesion = action.payload;

          if (sesion) {
            const {
              accessToken,
              refreshToken,
              user,
              accessExpires,
              refreshExpires,
              payload,
              expires,
            } = sesion as any;

            state.sesion = sesion as any;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.user = user;
            state.freelancer = state.freelancer ?? (user?.freelancer as any);
            state.accessExpires = accessExpires;
            state.refreshExpires = refreshExpires;
            state.payload = payload;
            state.expires = expires;
          }

          state.accessToken = null;
          state.refreshToken = null;
          state.user = null;
          state.accessExpires = null;
          state.refreshExpires = null;
          state.payload = null;
        },
        rejected: (state) => {
          debugger;
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
          const response = await axiosInstanceV1.post("/api/auth/refresh", {
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
        },
      },
    ),
    signUpAsFreelancer: create.asyncThunk(
      async (data: any, { rejectWithValue }) => {
        try {
          const response = await axiosInstanceV1.post("/freelancer", data);
          return response.data;
        } catch (error: any) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            return rejectWithValue(error.response.data.message);
          }

          return rejectWithValue("signUpAsFreelancer failed");
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.freelancer = action.payload;
          if (state.user) {
            state.user.freelancer = action.payload;
            state.user.avatar = action.payload.avatar;
            state.user.phone = action.payload.phone;
            state.user.country = action.payload.country;
            state.user.role = {
              id: RoleEnum.FREELANCER,
              name: RoleEnum[RoleEnum.FREELANCER],
            };
          }
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),

    updateFreelancerProfile: create.asyncThunk(
      async (data: any, { rejectWithValue }) => {
        try {
          const response = await axiosInstanceV1.patch(
            `/freelancer/${data.id}`,
            data,
          );
          return response.data;
        } catch (error: any) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            return rejectWithValue(error.response.data.message);
          }

          return rejectWithValue("updateFreelancerProfile failed");
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          if (state.user) {
            state.user.freelancer = action.payload;
            state.user.avatar = action.payload.avatar;
            state.user.country = action.payload.country;
            state.user.phone = action.payload.phone;
            state.user.fullName = action.payload.fullName;
          }
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),

    refetchMeAsync: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await axios.get("/me");
          return response.data;
        } catch (error: any) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            return rejectWithValue(error.response.data.message);
          }

          return rejectWithValue("Refetch me failed");
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.user = action.payload.user;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
  }),

  selectors: {
    selectAccessToken: (auth) => auth.accessToken,
    selectRefreshToken: (auth) => auth.refreshToken,
    selectAuthStatus: (auth) => auth.status,
    selectUser: (auth) => auth.user,
    selectSession: (auth) => auth.sesion,
    selectFreelancer: (auth) => auth.freelancer,
  },
});

export const {
  setAccessToken,
  setUser,
  logout,
  loginAsync,
  logoutAsync,
  setAuthFromSession,
  syncNexthAuthSesion,
  refreshAccessTokenAsync,
  signUpAsFreelancer,
  refetchMeAsync,
  updateFreelancerProfile,
} = authSlice.actions;

export const {
  selectAccessToken,
  selectAuthStatus,
  selectUser,
  selectSession,
  selectFreelancer,
  selectRefreshToken,
} = authSlice.selectors;
