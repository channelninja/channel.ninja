import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitResponseDto, LndInvoiceResponseDto, NodeInfoDto, NodeResponseDto } from '../generated';
import { RootState } from './store';

export interface GlobalState {
  isSocketConnected?: boolean;
  pubKey?: string;
  invoice?: LndInvoiceResponseDto;
  invoicePaid: boolean;
  nodes?: NodeResponseDto[];
  nodeInfo?: NodeInfoDto;
  fee?: number;
  isMaintenanceMode: boolean;
  transactionIdsByPubkey: { [pubkey: string]: string };
  txExplorerUrl?: string;
}

const initialState: GlobalState = {
  isSocketConnected: false,
  invoicePaid: false,
  isMaintenanceMode: false,
  transactionIdsByPubkey: {},
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    initApp: (state, action: PayloadAction<InitResponseDto & { availableWebLNMethods: string[] }>) => {
      state.isMaintenanceMode = action.payload.maintenance;
      state.fee = action.payload.fee;
      state.txExplorerUrl = action.payload.txExplorerUrl;
    },
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
    channelOpened: (state, action: PayloadAction<{ transactionId: string; pubKey: string }>) => {
      state.transactionIdsByPubkey = {
        ...state.transactionIdsByPubkey,
        [action.payload.pubKey]: action.payload.transactionId,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  initApp,
  socketChanged,
  invoiceFetched,
  nodesFetched,
  invoicePaid,
  nodeInfoChanged,
  validPubKeyEntered,
  channelOpened,
} = globalSlice.actions;

export default globalSlice.reducer;

export const selectIsSocketConnected = (state: RootState) => state.global.isSocketConnected;
export const selectPubKey = (state: RootState) => state.global.pubKey;
export const selectInvoice = (state: RootState) => state.global.invoice;
export const selectInvoicePaid = (state: RootState) => state.global.invoicePaid;
export const selectNodes = (state: RootState) => state.global.nodes;
export const selectFee = (state: RootState) => state.global.fee;
export const selectIsMaintenanceMode = (state: RootState) => state.global.isMaintenanceMode;
