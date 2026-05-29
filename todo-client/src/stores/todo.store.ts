import { defineStore } from "pinia";
import { apolloClient } from "../apollo/client";

import {
  GET_TODOS,
  ADD_TODO,
  TOGGLE_TODO,
  DELETE_TODO,
} from "../graphql/todos";

type Todo = {
  id: string;
  title: string;
  is_done: boolean;
  created_at: string;
  __typename?: "todos";
};

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [] as Todo[],
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
    syncTodosCache() {
      apolloClient.cache.writeQuery({
        query: GET_TODOS,
        data: {
          todos: this.todos,
        },
      });
    },

    async fetchTodos() {
      const { data } = await apolloClient.query({
        query: GET_TODOS,
        fetchPolicy: "network-only",
      });

      this.todos = data.todos.map((todo: Todo) => ({
        ...todo,
      }));
      this.syncTodosCache();
    },

    async addTodo(todoName: string) {
      if (!todoName.trim()) return;

      const tempId = `temp-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;

      const optimisticTodo: Todo = {
        id: tempId,
        title: todoName,
        is_done: false,
        created_at: new Date().toISOString(),
        __typename: "todos",
      };

      this.todos = [optimisticTodo, ...this.todos];
      this.syncTodosCache();

      try {
        const { data } = await apolloClient.mutate({
          mutation: ADD_TODO,
          variables: {
            title: todoName,
          },
        });

        const savedTodo = data?.insert_todos_one as Todo | null;
        if (!savedTodo) {
          this.todos = this.todos.filter(
            (todo) => todo.id !== tempId
          );
        } else {
          this.todos = this.todos.map((todo) =>
            todo.id === tempId ? savedTodo : todo
          );
        }

        this.syncTodosCache();
      } catch (error) {
        this.todos = this.todos.filter(
          (todo) => todo.id !== tempId
        );
        this.syncTodosCache();
        throw error;
      }
    },

    async toggleStatus(todoId: string) {
      const previousTodo = this.todos.find(
        (t) => t.id === todoId
      );

      if (!previousTodo) return;

      const nextDoneValue = !previousTodo.is_done;

      this.todos = this.todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              is_done: nextDoneValue,
            }
          : todo
      );
      this.syncTodosCache();

      try {
        const { data } = await apolloClient.mutate({
          mutation: TOGGLE_TODO,
          variables: {
            id: previousTodo.id,
            done: nextDoneValue,
          },
        });

        const updatedTodo = data?.update_todos_by_pk as
          | Pick<Todo, "id" | "is_done">
          | null;

        if (updatedTodo) {
          this.todos = this.todos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  is_done: updatedTodo.is_done,
                }
              : todo
          );
          this.syncTodosCache();
        }
      } catch (error) {
        this.todos = this.todos.map((todo) =>
          todo.id === todoId ? previousTodo : todo
        );
        this.syncTodosCache();
        throw error;
      }
    },

    async deleteTodo(todoId: string) {
      const removedIndex = this.todos.findIndex(
        (todo) => todo.id === todoId
      );

      if (removedIndex === -1) return;

      const removedTodo = this.todos[removedIndex];
      this.todos = this.todos.filter(
        (todo) => todo.id !== todoId
      );
      this.syncTodosCache();

      try {
        await apolloClient.mutate({
          mutation: DELETE_TODO,
          variables: {
            id: todoId,
          },
        });
      } catch (error) {
        const restoredTodos = [...this.todos];
        restoredTodos.splice(
          removedIndex,
          0,
          removedTodo
        );
        this.todos = restoredTodos;
        this.syncTodosCache();
        throw error;
      }
    },

    async clearAll() {
      const previousTodos = [...this.todos];

      if (!previousTodos.length) return;

      this.todos = [];
      this.syncTodosCache();

      const deleteResults = await Promise.allSettled(
        previousTodos.map((todo) =>
          apolloClient.mutate({
            mutation: DELETE_TODO,
            variables: {
              id: todo.id,
            },
          })
        )
      );

      const failedIds = new Set(
        deleteResults
          .map((result, index) =>
            result.status === "rejected"
              ? previousTodos[index].id
              : null
          )
          .filter(Boolean)
      );

      if (failedIds.size) {
        this.todos = previousTodos.filter((todo) =>
          failedIds.has(todo.id)
        );
        this.syncTodosCache();
        throw new Error(
          "Some todos could not be deleted."
        );
      }
    },
  },
});