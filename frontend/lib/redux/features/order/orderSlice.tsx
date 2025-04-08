import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { createAppSlice } from "../../createAppSlice";

interface OrderState {
  info: any;
  status: "idle" | "loading" | "failed";
  paymentUrl: string | null;
  error: string | null;
}

const initialState: OrderState = {
  info: null,
  status: "idle",
  paymentUrl: null,
  error: null,
};

export const orderSlice = createAppSlice({
  name: "order",
  initialState,
  reducers: (create) => ({
    resetOrder: create.reducer(
      (state, action: PayloadAction<string | null>) => initialState,
    ),

    setOrderInfo: create.reducer((state, action: PayloadAction<any>) => {
      state.info = action.payload;
    }),

    createOrderAsync: create.asyncThunk(
      async (payload: string, { rejectWithValue }) => {
        try {
          const response = await axiosInstanceV1.post("/orders", payload);

          return response.data; // { paymentUrl }
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
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
  }),

  selectors: {
    selectOrder: (order) => order.info,
  },
});

export const { resetOrder, setOrderInfo } = orderSlice.actions;

export const { selectOrder } = orderSlice.selectors;
