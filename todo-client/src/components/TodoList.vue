<template>
  <ul class="todoLists">
    <template v-if="status === 'all'">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
      />
    </template>

    <template v-else-if="status === 'active'">
      <TodoItem
        v-for="todo in activeTodos"
        :key="todo.id"
        :todo="todo"
      />
    </template>

    <template v-else>
      <TodoItem
        v-for="todo in doneTodos"
        :key="todo.id"
        :todo="todo"
      />
    </template>
  </ul>
</template>

<script>
import { mapState } from "pinia";
import TodoItem from "./TodoItem.vue";
import { useTodoStore } from "../stores/todo.store";

export default {
  name: "TodoList",

  props: ["status"],

  components: {
    TodoItem,
  },

  setup() {
    const todoStore = useTodoStore();

    return {
      todoStore,
    };
  },

  async mounted() {
    await this.todoStore.fetchTodos();
  },

  computed: {
    ...mapState(useTodoStore, [
      "todos",
      "activeTodos",
      "doneTodos",
      "countTodos",
    ]),
  },
};
</script>