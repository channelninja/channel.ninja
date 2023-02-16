import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitResponseDto, NodeResponseDto } from '../../generated';
import { initApp } from '../../redux/global-slice';
import { RootState } from '../../redux/store';

export interface WebLNState {
  openChannelTargetNode?: NodeResponseDto;
  availableMethods: string[];
}

const initialState: WebLNState = {
  availableMethods: [],
};

export const webLNSlice = createSlice({
  name: 'web-ln',
  initialState,
  reducers: {
    openChannelTargetNodeChanged: (state, action: PayloadAction<NodeResponseDto | undefined>) => {
      state.openChannelTargetNode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initApp, (state, action: PayloadAction<InitResponseDto & { availableWebLNMethods: string[] }>) => {
      state.availableMethods = action.payload.availableWebLNMethods;
    });
  },
});

// Action creators are generated for each case reducer function
export const { openChannelTargetNodeChanged } = webLNSlice.actions;

export default webLNSlice.reducer;

export const selectIsOpenChannelAvailable = (state: RootState) => {
  const availableMethods = state.webLN.availableMethods;

  return (
    availableMethods.includes('openchannel') &&
    availableMethods.includes('listpeers') &&
    availableMethods.includes('connectpeer')
  );
};

export const selectIsOpenChannelDialogOpen = (state: RootState) => state.webLN.openChannelTargetNode !== undefined;
