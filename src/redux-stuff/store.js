import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './counterSlice';
import furnacesSlice from './furnacesSlice';

export default configureStore({
  reducer: {
    counter: counterSlice,
    furnaces: furnacesSlice
  },
});
