import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './counterSlice';
import furnacesSlice from './furnacesSlice';

const store = configureStore({
  reducer: {
    counter: counterSlice,
    furnaces: furnacesSlice
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
