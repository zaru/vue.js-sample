<template lang="pug">
div#ajax
  p {{ message }}
  ul
    li(v-for="item in items") {{ item }}
</template>

<script>
export default {
  name: 'ajax',
  data () {
    return {
      message: 'Ajax sample code',
      items: []
    }
  },
  created () {
    this.fetch_json("./ajax.json");
  },
  methods: {
    fetch_json(url) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "json";
      xhr.addEventListener("loadend", this.set_data);
      xhr.send();
    },
    set_data(e) {
      this.items = e.target.response;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
