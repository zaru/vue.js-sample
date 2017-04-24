<template lang="pug">
div#editor
    div.menu
        button.btn-bold(v-on:click="bold") bold
        button.btn-bold(v-on:click="strike") strike
        button.btn-bold(v-on:click="underline") underline
        button.btn-bold(v-on:click="italic") italic
    div#editor-main(contenteditable="true")
</template>

<script>
export default {
  name: 'editor',
  data () {
    return {
    }
  },
  methods: {
    set_style (style) {
      let sel = window.getSelection();
      if(!sel.rangeCount) return;

      let range = sel.getRangeAt(0);
      let newNode = document.createElement('span');

      newNode.setAttribute('style', style);

      newNode.innerHTML = sel.toString();
      range.deleteContents();
      range.insertNode(newNode);

      // debug code
      let tmpDiv = document.createElement('div');
      tmpDiv.appendChild(range.cloneContents());
      console.log(tmpDiv.innerHTML);
    },
    bold () {
      this.set_style('font-weight: bold;');
    },
    strike () {
      this.set_style('text-decoration: line-through;');
    },
    underline () {
      this.set_style('text-decoration: underline;');
    },
    italic () {
      this.set_style('font-style: italic');
    }
  }
}
</script>

<style lang="scss" scoped>
    #editor-main {
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic", YuGothic, "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ", Meiryo, sans-serif;
        cursor: text;
        width: 100%;
        height: 500px;
        border: 1px solid #cccccc;
        padding: 10px;
        line-height: 1.6;
        outline: 0;
    }
</style>
