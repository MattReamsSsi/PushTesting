import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SsiApiClient from './SsiApiClient';

const initialState = {
  pushLog: []//strings
};

export const authenticateUser = createAsyncThunk('furnaces/authenticateUser', async () => {
  console.log("else");
  const ret =  await SsiApiClient.authenticateUser();
  return ret;
});

export const furnacesSlice = createSlice({
  name: 'furnaces',
  initialState : initialState,
  reducers: {
    addToPushLog: (state, action) => {
      state.pushLog.push(action.payload)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(authenticateUser.pending, (state, action) => {
        console.log("pending");
        state.pushLog.push("pending")
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        console.log("fulfilled");
        state.pushLog.push("fulfilled")
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        console.log("rejected");
        state.pushLog.push("rejected");
      })
  }
});

export const { addToPushLog } = furnacesSlice.actions;

export const selectPushLog = state => state.furnaces.pushLog;

export default furnacesSlice.reducer;