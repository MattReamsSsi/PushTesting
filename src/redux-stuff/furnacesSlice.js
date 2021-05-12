import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SsiApiClient from './SsiApiClient';
import StorageStuff from '../StorageStuff';
import FirebaseStuff from '../FirebaseStuff';

const initialState = {
  currentUser: null,//string
  currentTopic: null,//string
  pushLog: []//strings
};

export const authenticateUser = createAsyncThunk('furnaces/authenticateUser', async ({username, password}) => {
  const {authenticated, user} = await SsiApiClient.authenticateUser(username, password);
  if(authenticated) {
    console.log("000");
    await StorageStuff.saveUsername(user.userName);
    console.log("001");
    const oldTopic = await StorageStuff.getFirebaseTopic();
    console.log("002");
    const newTopic = FirebaseStuff.createTopic(user);
    console.log("003");
    console.log("oldTopic: " + oldTopic);
    console.log("newTopic: " + newTopic);
    FirebaseStuff.subscribeToTopic(oldTopic, newTopic);
    console.log("004");
    await StorageStuff.saveFirebaseTopic(topic);
    console.log("005");
    const currentTopic = await StorageStuff.getFirebaseTopic();
    console.log("006");
    const savedUsername = await StorageStuff.getUsername();
    console.log("007");
    return {authenticated, username: savedUsername, currentTopic};
  }
  return {authenticated, username, currentTopic: null};
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
        state.currentUser = action.payload;
      })
  }
});

export const { addToPushLog } = furnacesSlice.actions;

export const selectPushLog = state => state.furnaces.pushLog;
export const selectCurrentUser = state => state.furnaces.currentUser;
export const selectCurrentTopic = state => state.furnaces.currentTopic;

export default furnacesSlice.reducer;