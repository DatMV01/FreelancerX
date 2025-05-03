import { GigDto } from "@/dto/dto.type.";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { createAppSlice } from "../../createAppSlice";

interface GigsState {
  data: GigDto[];
  loading: boolean;
  error: string | null;
}

const initialState: GigsState = {
  data: [],
  loading: false,
  error: null,
};

export const gigSlice = createAppSlice({
  name: "gigs",
  initialState,
  reducers: (create) => ({
    fetchFavoriteGigs: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await axiosInstanceV1.get("/gig/favorites");
          return response.data;
        } catch (error: any) {
          return rejectWithValue(
            error.response?.data?.message || error.message,
          );
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.data = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          state.data = [];
        },
      },
    ),

    addFavoriteGig: create.asyncThunk(
      async (payload: { gigId: string }, { rejectWithValue }) => {
        try {
          const response = await axiosInstanceV1.post("/gig/favorites", {
            gigId: payload.gigId,
          });
          return response.data;
        } catch (error: any) {
          return rejectWithValue(
            error.response?.data?.message || error.message,
          );
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          const newGig = action.payload;
          if (newGig) state.data.push(newGig);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      },
    ),

    removeFavoriteGig: create.asyncThunk(
      async (payload: { gigId: string }, { rejectWithValue }) => {
        try {
          await axiosInstanceV1.delete(`/gig/favorites/${payload.gigId}`);
          return payload.gigId;
        } catch (error: any) {
          return rejectWithValue(
            error.response?.data?.message || error.message,
          );
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          const gigId = action.payload;
          state.data = state.data.filter((gig) => gig.id !== gigId);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      },
    ),
  }),

  selectors: {
    selectFavoriteGigs: (state) => state.data,
    selectFavoriteGigsStatus: (state) => state.loading,
    selectFavoriteGigsError: (state) => state.error,
  },
});

export const { addFavoriteGig, removeFavoriteGig, fetchFavoriteGigs } =
  gigSlice.actions;

export const {
  selectFavoriteGigs,
  selectFavoriteGigsStatus,
  selectFavoriteGigsError,
} = gigSlice.selectors;
