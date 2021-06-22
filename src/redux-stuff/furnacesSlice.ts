import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SsiApiClient from './SsiApiClient';
import StorageStuff from '../StorageStuff';
import FirebaseStuff from '../FirebaseStuff';
import type { RootState } from './store';

interface FurnacesState {
  currentUser: string
  currentTopic: string
  pushLog: string[]
}

const initialState: FurnacesState = {
  currentUser: null,
  currentTopic: null,
  pushLog: []
};

export const authenticateUser = createAsyncThunk('furnaces/authenticateUser', async ({username, password}: any) => {

  console.log("matt auth 2");

  const {authenticated, user, nodeId} = await SsiApiClient.authenticateUser(username, password);
  if(authenticated) {
    await StorageStuff.saveUsername(user.userName);
    const oldTopic = await StorageStuff.getFirebaseTopic();
    const newTopic = FirebaseStuff.createTopic(nodeId, user);
    FirebaseStuff.subscribeToTopic(oldTopic, newTopic);
    await StorageStuff.saveFirebaseTopic(newTopic);
    const currentTopic = await StorageStuff.getFirebaseTopic();
    const savedUsername = await StorageStuff.getUsername();
    return {authenticated, username: savedUsername, currentTopic};
  }
  return {authenticated, username, currentTopic: null};
});

export const getUserFromStorage = createAsyncThunk('furnaces/getUserFromStorage', async () => {
  const userName = await StorageStuff.getUsername();
  const topic = await StorageStuff.getFirebaseTopic();
  return {userName, topic};
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
        //console.log("payload: " + action.payload);
        if(action.payload.authenticated) {
          state.currentUser = action.payload.username;
          state.currentTopic = action.payload.currentTopic;
        }
        state.pushLog.push("fulfilled")
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        console.log("rejected");
        state.pushLog.push("rejected");
      })
      .addCase(getUserFromStorage.fulfilled, (state, action) => {
        console.log("getUserFromStorage.fulfilled");
        state.currentUser = action.payload.userName;
        state.currentTopic = action.payload.topic;
      })
  }
});

export const { addToPushLog } = furnacesSlice.actions;

export const selectPushLog = (state: RootState) => state.furnaces.pushLog;
export const selectCurrentUser = (state: RootState) => state.furnaces.currentUser;
export const selectCurrentTopic = (state: RootState) => state.furnaces.currentTopic;

export default furnacesSlice.reducer;