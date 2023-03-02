import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TooltipKey } from './tooltip.enum';

export type TooltipState = {
  key: TooltipKey | undefined;
  message?: string;
};

const initialState: TooltipState = {
  key: undefined,
  message: undefined,
};

export const tooltipSlice = createSlice({
  name: 'tooltip',
  initialState,
  reducers: {
    tooltipChanged: (state, action: PayloadAction<TooltipKey>) => {
      state.key = action.payload;
    },
    resetTooltip: (state) => {
      state.key = undefined;
    },
    ninjaMouseEntered: (state) => {
      state.key = TooltipKey.NINJA_HOVERED;
    },
    connectionsMouseEntered: (state) => {
      state.key = TooltipKey.CONNECTIONS_HOVERED;
    },
  },
});

// Action creators are generated for each case reducer function
export const { ninjaMouseEntered, resetTooltip, connectionsMouseEntered, tooltipChanged } = tooltipSlice.actions;

export default tooltipSlice.reducer;
