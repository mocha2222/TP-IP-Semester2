import { defineStore } from "pinia";
import axios from "axios";

const API_BASE = "http://localhost:3000";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
  }),
  getters: {
    countTodos: (state) => state.todos.length,
  },
  actions: {
    async fetchTodos() {
      try {
        const response = await axios.get(`${API_BASE}/tasks`);
        const data = response.data;
        this.todos = Array.isArray(data) ? data : data ? [data] : [];
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    },
    async addTodo(taskName) {
      if (!taskName) {
        return;
      }
      try {
        const response = await axios.post(`${API_BASE}/tasks`, {
          name: taskName,
        });
        const created = response.data;
        if (created) {
          this.todos.push(created);
        }
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    },
    async toggleStatus(todoId) {
      const todo = this.todos.find((item) => item.id === todoId);
      if (!todo) {
        return;
      }
      const isDone = todo.completedAt != null;
      const endpoint = isDone ? "pending" : "done";
      try {
        const response = await axios.patch(
          `${API_BASE}/tasks/${todoId}/${endpoint}`,
          {}
        );
        const updated = response.data;
        if (updated) {
          const index = this.todos.findIndex((item) => item.id === todoId);
          if (index !== -1) {
            this.todos[index] = updated;
          }
        }
      } catch (error) {
        console.error("Failed to toggle todo status:", error);
      }
    },
    async clearAll() {
      try {
        const response = await axios.get(`${API_BASE}/tasks`);
        const tasks = Array.isArray(response.data)
          ? response.data
          : response.data
          ? [response.data]
          : [];

        await Promise.all(tasks.map((task) => axios.delete(`${API_BASE}/tasks/${task.id}`)));

        this.todos = [];
        return { message: "success", deletedCount: tasks.length };
      } catch (error) {
        console.error("Failed to delete all todos:", error);
        return null;
      }
    },
  },
});