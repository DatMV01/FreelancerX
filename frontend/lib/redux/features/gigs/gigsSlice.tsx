import { GigDto } from "@/dto/dto.type.";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { createAppSlice } from "../../createAppSlice";

interface GigsState {
  favorites: GigDto[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: GigsState = {
  favorites: [],
  status: "idle",
  error: null,
};

export const gigSlice = createAppSlice({
  name: "gigs",
  initialState,
  reducers: (create) => ({
    fetchFavoriteGigs: create.asyncThunk(
      async () => {
        const response = await axiosInstanceV1.get("/gig/favorites");

        return response.data;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.favorites = action.payload;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),

    addFavoriteGig: create.asyncThunk(
      async (
        payload: {
          gigId: string;
        },
        { rejectWithValue },
      ) => {
        debugger;
        try {
          const response = await axiosInstanceV1.post("/gig/favorites", {
            gigId: payload.gigId,
          });

          return {
            data: response.data,
          };
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          debugger;
          state.status = "idle";

          const { data } = action.payload;
          if (data) state.favorites = [...state.favorites, data];
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),

    removeFavoriteGig: create.asyncThunk(
      async (
        payload: {
          gigId: string;
        },
        { rejectWithValue },
      ) => {
        debugger;
        try {
          const response = await axiosInstanceV1.delete(
            "/gig/favorites/" + payload.gigId,
          );

          return {
            data: response.data,
            gigId: payload.gigId,
          };
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          debugger;
          state.status = "idle";

          const { data, gigId } = action.payload;
          if (data)
            state.favorites = Array.from(state.favorites).filter(
              (_) => _.id !== gigId,
            );
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
  }),

  selectors: {
    selectFavoriteGigs: (_) => _.favorites,
    selectFavoriteGigsStatus: (_) => _.status,
  },
});

export const { addFavoriteGig, removeFavoriteGig, fetchFavoriteGigs } =
  gigSlice.actions;

export const { selectFavoriteGigs, selectFavoriteGigsStatus } =
  gigSlice.selectors;
