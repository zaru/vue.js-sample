<template lang="pug">
div#todo
  p
    input(type="text" v-model="task" v-on:keydown.enter="submit" autofocus)
  ul
    li(v-for="item in items") {{ item }}
</template>

<script>
export default {
  name: 'todo',
  data () {
    return {
      task: "",
      items: []
    }
  },
  created () {
  },
  methods: {
    submit (e) {
      this.items.push(this.task);
      this.task = "";
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
