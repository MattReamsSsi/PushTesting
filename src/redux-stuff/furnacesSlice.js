import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SsiApiClient from './SsiApiClient';
import StorageStuff from '../StorageStuff';

const initialState = {
  currentUser: null,//string
  pushLog: []//strings
};

export const authenticateUser = createAsyncThunk('furnaces/authenticateUser', async ({username, password}) => {
  const authenticated = await SsiApiClient.authenticateUser(username, password);
  if(authenticated) {
    await StorageStuff.saveUsername(username);
    const savedUsername = await StorageStuff.getUsername();
    return {authenticated, username: savedUsername};
  }
  return {authenticated, username};
});

export const getUserFromStorage = createAsyncThunk('furnaces/getUserFromStorage', async () => {
  return await StorageStuff.getUsername();
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
        console.log("payload: " + action.payload);
        if(action.payload.authenticated) {
          state.currentUser = action.payload.username;
        }
        state.pushLog.push("fulfilled")
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        console.log("rejected");
        state.pushLog.push("rejected");
      })
      .addCase(getUserFromStorage.fulfilled, (state, action) => {
        console.log("getUserFromStorage.fulfilled");
        state.currentUser = action.payload;
      })
  }
});

export const { addToPushLog } = furnacesSlice.actions;

export const selectPushLog = state => state.furnaces.pushLog;
export const selectCurrentUser = state => state.furnaces.currentUser;

export default furnacesSlice.reducer;