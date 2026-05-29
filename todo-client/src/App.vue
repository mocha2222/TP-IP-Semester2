<template>
  <div class="container">
    <AddTodo @added="handleAddTodo" />

    <div class="tabs">
      <button
        @click="currentTab = 'all'"
        :class="{ active: currentTab === 'all' }"
      >
        All
      </button>

      <button
        @click="currentTab = 'active'"
        :class="{ active: currentTab === 'active' }"
      >
        Active
      </button>

      <button
        @click="currentTab = 'done'"
        :class="{ active: currentTab === 'done' }"
      >
        Done
      </button>
    </div>

    <TodoLists :status="currentTab" />

    <div class="pending-tasks">
      <span>
        You have
        <span class="pending-num">
          {{ nbOfTodo }}
        </span>
        tasks pending.
      </span>

      <button
        class="clear-button"
        @click="clearAllTodos"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import AddTodo from "./components/AddTodo.vue";
import TodoLists from "./components/TodoList.vue";
import { useTodoStore } from "./stores/todo.store";

export default {
  name: "App",

  setup() {
    const store = useTodoStore();

    return {
      store,
    };
  },

  data() {
    return {
      currentTab: "all",
    };
  },

  components: {
    AddTodo,
    TodoLists,
  },

  computed: {
    ...mapState(useTodoStore, {
      nbOfTodo: "countTodos",
    }),
  },

  methods: {
    handleAddTodo(todo) {
      this.store.addTodo(todo);
    },

    clearAllTodos() {
      this.store.clearAll();
    },
  },
};
</script>

<style>
.tabs {
  margin: 20px 0;
}

.tabs button {
  margin-right: 10px;
  padding: 8px 15px;
  cursor: pointer;
}

.tabs .active {
  background: #4caf50;
  color: white;
}
</style>