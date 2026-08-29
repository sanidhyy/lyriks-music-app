import { configureStore } from "@reduxjs/toolkit";

import playerReducer from "./features/playerSlice";
import { musicApi } from "./services/musicApi";

// redux store
export const store = configureStore({
  reducer: {
    [musicApi.reducerPath]: musicApi.reducer,
    player: playerReducer,
  },
  // set default middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(musicApi.middleware),
});
