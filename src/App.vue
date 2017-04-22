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
        { url: "ajax.html", title: "Ajax" }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
