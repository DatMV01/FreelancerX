import { createAppSlice } from "../../createAppSlice";
import { GigDto } from "@/dto/dto.type.";

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

export const gigSlice2 = createAppSlice({
  name: "gigs2",
  initialState,
  reducers: (create) => ({
    setFavoriteGigs: (state, action) => {
      state.data = action.payload;
    },

    addFavoriteGig: (state, action) => {
      const newGig = action.payload;
      const exists = state.data.find((gig) => gig.id === newGig.id);
      if (!exists) {
        state.data.push(newGig);
      }
    },

    removeFavoriteGig: (state, action) => {
      debugger
      const gigId = action.payload.id;
      state.data = state.data.filter((gig) => gig.id !== gigId);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  }),

  selectors: {
    selectFavoriteGigs: (state) => state.data,
    selectFavoriteGigsStatus: (state) => state.loading,
    selectFavoriteGigsError: (state) => state.error,
  },
});

export const {
  setFavoriteGigs,
  setLoading,
  setError,
  addFavoriteGig,
  removeFavoriteGig,
} = gigSlice2.actions;

export const {
  selectFavoriteGigs,
  selectFavoriteGigsStatus,
  selectFavoriteGigsError,
} = gigSlice2.selectors;
