import { defineStore } from "pinia";
import { apolloClient } from "../apollo/client";

import {
  GET_TODOS,
  ADD_TODO,
  TOGGLE_TODO,
  DELETE_TODO,
} from "../graphql/todos";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
  }),

  getters: {
    countTodos(state) {
      return state.todos.filter(
        (todo) => !todo.is_done
      ).length;
    },

    completedTasks(state) {
      return state.todos.filter(
        (todo) => todo.is_done
      );
    },

    pendingTasks(state) {
      return state.todos.filter(
        (todo) => !todo.is_done
      );
    },

    activeTodos(state) {
      return state.todos.filter(
        (todo) => !todo.is_done
      );
    },

    doneTodos(state) {
      return state.todos.filter(
        (todo) => todo.is_done
      );
    },
  },

  actions: {
    async fetchTodos() {
      const { data } = await apolloClient.query({
        query: GET_TODOS,
        fetchPolicy: "network-only",
      });

      this.todos = data.todos;
    },

    async addTodo(todoName) {
      if (!todoName.trim()) return;

      await apolloClient.mutate({
        mutation: ADD_TODO,
        variables: {
          title: todoName,
        },
      });

      await this.fetchTodos();
    },

    async toggleStatus(todoId) {
      const todo = this.todos.find(
        (t) => t.id === todoId
      );

      if (!todo) return;

      await apolloClient.mutate({
        mutation: TOGGLE_TODO,
        variables: {
          id: todo.id,
          done: !todo.is_done,
        },
      });

      await this.fetchTodos();
    },

    async deleteTodo(todoId) {
      await apolloClient.mutate({
        mutation: DELETE_TODO,
        variables: {
          id: todoId,
        },
      });

      await this.fetchTodos();
    },

    async clearAll() {
      for (const todo of this.todos) {
        await apolloClient.mutate({
          mutation: DELETE_TODO,
          variables: {
            id: todo.id,
          },
        });
      }

      await this.fetchTodos();
    },
  },
});