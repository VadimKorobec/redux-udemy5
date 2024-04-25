import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { resetToDefault } from "../Reset/reset-action";

export const loadTodos = createAsyncThunk("todos/addTodos", async () => {
  const res = await fetch("http://localhost:3001/todos");
  const data = await res.json();
  return data;
});

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (title) => {
    const res = await fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, completed: false }),
    });
    const data = await res.json();

    return data;
  }
);

export const toggleTodo = createAsyncThunk(
  "todos/toggleTodo",
  async (id, { getState }) => {
    const todo = getState().todos.items.find((todo) => todo.id === id);
    const res = await fetch(`http://localhost:3001/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    const data = await res.json();

    return data;
  }
);

export const removeTodo = createAsyncThunk("todos/removeTodo", async (id) => {
  const res = await fetch(`http://localhost:3001/todos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  await res.json();

  return id;
});

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    loading: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetToDefault, () => {
        return [];
      })
      .addCase(loadTodos.pending, (state, action) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(loadTodos.rejected, (state) => {
        state.loading = "idle";
        state.error = "Something went wrong!";
      })
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = "idle";
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      });
  },
});

export const todoReducer = todoSlice.reducer;

export const selectVisibleTodos = (state, filter) => {
  switch (filter) {
    case "all": {
      return state.todos.items;
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
