<template lang="pug">
div#hoge
  p hoge text
  p {{ message }}
  | plain text
  ul(v-for="item in items")
    li {{ item }}
</template>

<script>
export default {
  name: 'hoge',
  data () {
    return {
      message: 'hoge piyo',
      items: []
    }
  },
  created () {
    this.fetch_json("./hoge.json");
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
