import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slice/auth-slice";
import userReducer from "./slice/user-slice";
import canvasReducer from "./slice/canvas-slice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		canvas: canvasReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
