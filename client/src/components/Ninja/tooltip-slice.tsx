import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TooltipKey } from './tooltip.enum';

export enum TooltipType {
  ERROR = 'error',
  INFO = 'info',
}

type TooltipState = {
  key: TooltipKey | undefined;
  type?: TooltipType;
};

const initialState: TooltipState = {
  key: undefined,
};

export const tooltipSlice = createSlice({
  name: 'tooltip',
  initialState,
  reducers: {
    tooltipChanged: (state, action: PayloadAction<{ key: TooltipKey; type?: TooltipType }>) => {
      state.key = action.payload.key;
      state.type = action.payload.type;
    },
    resetTooltip: (state) => {
      state.key = undefined;
      state.type = undefined;
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
