import { createSlice } from "@reduxjs/toolkit";
import { TooltipKey } from "./tooltip.enum";

export type TooltipState = {
  key: TooltipKey | undefined;
};

const initialState: TooltipState = {
  key: undefined,
};

export const tooltipSlice = createSlice({
  name: "tooltip",
  initialState,
  reducers: {
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
} = tooltipSlice.actions;

export default tooltipSlice.reducer;
