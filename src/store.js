import { configureStore } from "@reduxjs/toolkit";

import { filterReducer } from "./features/Filters/filter-slice";
import { todoReducer } from "./features/Todos/todos-slice";

import * as api from "./api";

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    filter: filterReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});
