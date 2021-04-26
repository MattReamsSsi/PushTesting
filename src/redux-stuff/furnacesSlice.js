import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pushLog: []//strings
};

export const furnacesSlice = createSlice({
  name: 'furnaces',
  initialState : initialState,
  reducers: {
    addToPushLog: (state, action) => {
      state.pushLog.push(action.payload)
    }
  }
});

export const { addToPushLog } = furnacesSlice.actions;

export const selectPushLog = state => state.furnaces.pushLog;

export default furnacesSlice.reducer;