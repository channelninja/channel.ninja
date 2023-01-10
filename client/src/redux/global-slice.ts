import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  LndInvoiceResponseDto,
  NodeInfoDto,
  NodeResponseDto,
} from "../generated";
import { TooltipState } from "../utils/tooltips";

export interface GlobalState {
  tooltip?: TooltipState;
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

const calculateTooltip = (state: GlobalState): TooltipState | undefined => {
  if (state.invoicePaid) return TooltipState.RECOMMENDATION_LIST;
  if (state.invoice) return TooltipState.QR_CODE;
  if (state.isSocketConnected) return TooltipState.CONNECTED;
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    socketChanged: (state, action: PayloadAction<boolean>) => {
      state.isSocketConnected = action.payload;

      if (action.payload) {
        state.tooltip = TooltipState.CONNECTED;
      } else {
        state.tooltip = TooltipState.CONNECTING;
      }
    },
    invoiceFetched: (state, action: PayloadAction<LndInvoiceResponseDto>) => {
      state.invoice = action.payload;
      state.tooltip = TooltipState.QR_CODE;
    },
    nodesFetched: (state, action: PayloadAction<NodeResponseDto[]>) => {
      state.nodes = action.payload;
    },
    invoicePaid: (state) => {
      state.invoice = undefined;
      state.invoicePaid = true;
      state.tooltip = TooltipState.RECOMMENDATION_LIST;
    },
    invalidPubkey: (state) => {
      state.tooltip = TooltipState.NO_NODES_FOUND;
    },
    ninjaMouseEntered: (state) => {
      state.tooltip = TooltipState.SHOW_MY_NODE;
    },
    resetTooltip: (state) => {
      const tooltip = calculateTooltip(state);

      state.tooltip = tooltip;
    },
    ninjaClicked: (state) => {
      state.tooltip = TooltipState.MY_NODE_COPIED;
    },
    qrCodeClicked: (state) => {
      state.tooltip = TooltipState.INVOICE_COPIED;
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
  invalidPubkey,
  ninjaClicked,
  ninjaMouseEntered,
  nodeInfoChanged,
  qrCodeClicked,
  resetTooltip,
  validPubKeyEntered,
} = globalSlice.actions;

export default globalSlice.reducer;
