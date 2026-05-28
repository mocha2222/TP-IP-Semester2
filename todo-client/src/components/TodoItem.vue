<template>
  <li
    class="list pending"
    @click="toggleStatus(todo.id)"
  >
    <input
      type="checkbox"
      :checked="todo.is_done"
    />

    <span
      class="task"
      :style="{
        textDecoration: todo.is_done
          ? 'line-through'
          : 'none'
      }"
    >
      {{ todo.title }}
    </span>

    <i
      class="uil uil-trash"
      @click.stop="deleteTodo(todo.id)"
    ></i>
  </li>
</template>

<script>
import { useTodoStore } from "../stores/todo.store";

export default {
  props: ["todo"],

  setup() {
    const todoStore = useTodoStore();

    return {
      todoStore,
    };
  },

  methods: {
    toggleStatus(todoId) {
      this.todoStore.toggleStatus(todoId);
    },

    deleteTodo(todoId) {
      this.todoStore.deleteTodo(todoId);
    },
  },
};
</script>