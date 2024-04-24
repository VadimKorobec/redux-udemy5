import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {resetToDefault} from '../Reset/reset-action';

export const createTodo = createAsyncThunk(
  '@@todos/create-todo',
  async (title, {
    dispatch,
  }) => {
    dispatch({type: 'SET_LOADING'});

    const res = await fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title, completed: false})
    })
    const data = res.json();
    dispatch(addTodo(data))
  }
);


const todoSlice = createSlice({
  name: '@@todos',
  initialState: [],
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload)
      },
      prepare: (title) => ({
        payload: {
          title,
          completed: false
        }
      })
    },
    removeTodo: (state, action) => {
      const id = action.payload;
      return state.filter((todo) => todo.id !== id);
    },
    toggleTodo: (state, action) => {
      const id = action.payload;
      const todo = state.find((todo) => todo.id === id);
      todo.completed = !todo.completed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetToDefault, () => {
        return []
      })
  }
});
export const {addTodo, removeTodo, toggleTodo} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;


export const selectVisibleTodos = (state, filter) => {
  switch (filter) {
    case 'all': {
      return state.todos;
    }
    case 'active': {
      return state.todos.filter(todo => !todo.completed);
    }
    case 'completed': {
      return state.todos.filter(todo => todo.completed);
    }
    default: {
      return state.todos;
    }
  }
}