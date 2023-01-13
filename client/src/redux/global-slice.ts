import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LndInvoiceResponseDto,
  NodeInfoDto,
  NodeResponseDto,
} from "../generated";
import { RootState } from "./store";

export interface GlobalState {
  isSocketConnected?: boolean;
  pubKey?: string;
  invoice?: LndInvoiceResponseDto;
  invoicePaid: boolean;
  nodes?: NodeResponseDto[];
  nodeInfo?: NodeInfoDto;
}

const initialState: GlobalState = {
  isSocketConnected: false,
  invoicePaid: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    socketChanged: (state, action: PayloadAction<boolean>) => {
      state.isSocketConnected = action.payload;
    },
    invoiceFetched: (state, action: PayloadAction<LndInvoiceResponseDto>) => {
      state.invoice = action.payload;
    },
    nodesFetched: (state, action: PayloadAction<NodeResponseDto[]>) => {
      state.nodes = action.payload;
    },
    invoicePaid: (state) => {
      state.invoice = undefined;
      state.invoicePaid = true;
    },
    nodeInfoChanged: (state, action: PayloadAction<NodeInfoDto>) => {
      state.nodeInfo = action.payload;
    },
    validPubKeyEntered: (state, action: PayloadAction<string>) => {
      state.invoicePaid = false;
      state.pubKey = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  socketChanged,
  invoiceFetched,
  nodesFetched,
  invoicePaid,
  nodeInfoChanged,
  validPubKeyEntered,
} = globalSlice.actions;

export default globalSlice.reducer;

export const selectIsSocketConnected = (state: RootState) =>
  state.global.isSocketConnected;
export const selectPubKey = (state: RootState) => state.global.pubKey;
export const selectInvoice = (state: RootState) => state.global.invoice;
export const selectInvoicePaid = (state: RootState) => state.global.invoicePaid;
export const selectNodes = (state: RootState) => state.global.nodes;
