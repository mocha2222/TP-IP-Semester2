<template>
  <div class="input-field">
    <textarea
      @keyup.enter.prevent="addTodo"
      ref="input"
      placeholder="Enter your new todo"
    ></textarea>

    <i class="uil uil-notes note-icon"></i>
  </div>
</template>

<script>
export default {
  methods: {
    addTodo(e) {
      const value = e.target.value.trim();

      if (!value) return;

      this.$emit("added", value);

      this.$refs.input.value = "";
    },
  },
};
</script>