<template lang="pug">
div#todo
  p
    input(type="text" v-model="task" v-on:keydown.enter="submit" v-focus="true")
  ul
    li(v-for="item in items" v-bind:class="{ completed: item.completed }")
      input(type="checkbox" v-model="item.completed")
      |{{ item.title }}
      button(v-on:click="task_delete(item)") [x]
</template>

<script>
export default {
  name: 'todo',
  data () {
    return {
      task: "",
      items: {}
    }
  },
  watch: {
    items: {
      deep: true
    }
  },
  created () {
  },
  methods: {
    submit (e) {
      let uuid = this.uuid();
      this.$set(this.items, uuid,
        {
          id: uuid,
          title: this.task,
          completed: false
        }
      );
      this.task = "";
    },
    task_delete (todo) {
      this.$delete(this.items, todo.id);
    },
    uuid () {
      var uuid = "", i, random;
      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i == 8 || i == 12 || i == 16 || i == 20) {
          uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
      }
      return uuid;
    }
  }
}
</script>

<style lang="scss" scoped>
.completed {
  color: #aaaaaa;
}
</style>
