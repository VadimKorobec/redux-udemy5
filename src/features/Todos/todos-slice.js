import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { resetToDefault } from "../Reset/reset-action";

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (title, { dispatch }) => {
    dispatch({ type: "SET_LOADING" });

    const res = await fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, completed: false }),
    });
    const data = res.json();
    dispatch(addTodo(data));
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    loading: "idle",
    error: null,
  },
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        return [...state, action.payload];
      },
      prepare: (title) => ({
        payload: {
          title,
          completed: false,
        },
      }),
    },
    removeTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    toggleTodo: (state, action) => {
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetToDefault, () => {
        return [];
      })
      .addCase(createTodo.pending);
  },
});
export const { addTodo, removeTodo, toggleTodo } = todoSlice.actions;

export const todoReducer = todoSlice.reducer;

export const selectVisibleTodos = (state, filter) => {
  switch (filter) {
    case "all": {
      return state.todos;
    }
    case "active": {
      return state.todos.items.filter((todo) => !todo.completed);
    }
    case "completed": {
      return state.todos.items.filter((todo) => todo.completed);
    }
    default: {
      return state.todos;
    }
  }
};
