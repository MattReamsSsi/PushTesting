import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SsiApiClient from './SsiApiClient';

const initialState = {
  pushLog: []//strings
};

export const authenticateUser = createAsyncThunk('furnaces/authenticateUser', async (username, password) => {
  return await SsiApiClient.authenticateUser(username, password);
});

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