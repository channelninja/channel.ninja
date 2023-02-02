import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TooltipKey } from "./tooltip.enum";

export type TooltipState = {
  key: TooltipKey | undefined;
  timeoutId?: NodeJS.Timeout;
};

const initialState: TooltipState = {
  key: undefined,
  timeoutId: undefined,
};

export const tooltipSlice = createSlice({
  name: "tooltip",
  initialState,
  reducers: {
    timeoutIdChanged: (state, action: PayloadAction<NodeJS.Timeout>) => {
      state.timeoutId = action.payload;
    },
    tooltipChanged: (state, action: PayloadAction<TooltipKey>) => {
      state.key = action.payload;
    },
    graphNotReady: (state) => {
      state.key = TooltipKey.GRAPH_NOT_READY;
    },
    invalidPubKey: (state) => {
      state.key = TooltipKey.INVALID_PUB_KEY;
    },
    ninjaMouseEntered: (state) => {
      state.key = TooltipKey.NINJA_HOVERED;
    },
    resetTooltip: (state) => {
      state.key = undefined;
    },
    ninjaClicked: (state) => {
      state.key = TooltipKey.NINJA_CLICKED;
    },
    qrCodeClicked: (state) => {
      state.key = TooltipKey.QR_CODE_CLICKED;
    },
    connectionsMouseEntered: (state) => {
      state.key = TooltipKey.CONNECTIONS_HOVERED;
    },
    addressClicked: (state) => {
      state.key = TooltipKey.ADDRESS_CLICKED;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  ninjaClicked,
  ninjaMouseEntered,
  qrCodeClicked,
  resetTooltip,
  invalidPubKey,
  connectionsMouseEntered,
  addressClicked,
  graphNotReady,
  tooltipChanged,
  timeoutIdChanged,
} = tooltipSlice.actions;

export default tooltipSlice.reducer;
