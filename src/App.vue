<template lang="pug">
div#app
  h1 Vue.js sample code
  ul
    li(v-for="item in items"): a(v-bind:href="item.url") {{ item.title }}
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      items: [
        { url: "ajax.html", title: "Ajax" },
        { url: "todo.html", title: "Todo" },
        { url: "editor.html", title: "Editor" },
        { url: "paper.html", title: "Paper" },
        { url: "drag_drop.html", title: "Drag & Drop" },
        { url: "draggable_sample.html", title: "Draggable" }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
