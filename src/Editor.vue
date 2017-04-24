<template lang="pug">
div#editor
    p run socket.io command `cd socket.io && node app`
    p(v-if="isConnected") connected
    button(@click="pingServer") ping

    div.menu
        button.btn-bold(v-on:click="bold") bold
        button.btn-bold(v-on:click="strike") strike
        button.btn-bold(v-on:click="underline") underline
        button.btn-bold(v-on:click="italic") italic
    div#editor-main(contenteditable="true" v-on:mouseup="caret_update" v-on:keyup="caret_update")
        |ダミーテキストです。
</template>

<script>
export default {
  name: 'editor',
  data () {
    return {
      isConnected: false,
      socketMessage: ''
    }
  },
  sockets: {
    connect(client) {
      // Fired when the socket connects.
      this.isConnected = true;
      console.log("connected");
    },

    disconnect() {
      this.isConnected = false;
      console.log("dis-connected");
    },

    server_to_client (data) {
      let guide = document.getElementById('js-other-cursor-' + data.user_id) || document.createElement('div');
      guide.id = 'js-other-cursor-' + data.user_id;
      guide.classList.add('other-cursor');
      let guideStyle = guide.style;
      guideStyle.position = 'absolute';
      guideStyle.top = data.top + 'px';
      guideStyle.left = data.left + 'px';
      document.body.appendChild(guide);
    }
  },
  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit('pingServer', 'PING!')
    },
    set_style (style) {
      document.execCommand(style, false, null);
    },
    bold () {
      this.set_style('bold');
    },
    strike () {
      this.set_style('strikeThrough');
    },
    underline () {
      this.set_style('underline');
    },
    italic () {
      this.set_style('italic');
    },
    caret_update () {
      let sel = window.getSelection();
      let range = sel.getRangeAt(0);

      // 座標を計測するためのダミー用のspanを入れる
      let anchor = document.createElement('span');
      range.insertNode(anchor);

      let position = anchor.getBoundingClientRect();

      this.set_guide(position);
      this.set_information(position);

      anchor.parentElement.removeChild(anchor);

      this.$socket.emit("client_to_server", { top: position.top, left: position.left});
    },
    set_guide (position) {
      let guide = document.getElementById('js-cursor-guide') || document.createElement('div');
      guide.id = 'js-cursor-guide';
      let guideStyle = guide.style;
      guideStyle.width = position.left + 'px';
      guideStyle.height = position.top + 'px';
      document.body.appendChild(guide);
    },
    set_information (position) {
      let information = document.getElementById('js-cursor-information') || document.createElement('div');
      information.id = 'js-cursor-information';
      information.innerText = 'Top: ' + position.top + ' / Left: ' + position.left;
      let informationStyle = information.style;
      informationStyle.top = position.top + 30 + 'px';
      informationStyle.left = position.left + 'px';
      document.body.appendChild(information);
    }
  }
}
</script>

<style lang="scss">
    #editor-main {
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic", YuGothic, "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ", Meiryo, sans-serif;
        cursor: text;
        width: 40%;
        height: 500px;
        border: 1px solid #cccccc;
        padding: 10px;
        line-height: 1.6;
        outline: 0;
    }
    #js-cursor-guide {
        position: absolute;
        top: 0;
        left: 0;
        border: 1px dashed #ff0000;
        border-left: none;
        border-top: none;
        pointer-events: none;
    }
    #js-cursor-information {
        position: absolute;
        background-color: #000000;
        color: #ffffff;
        font-size: 12px;
        padding: 3px;
        opacity: 0.7;
        pointer-events: none;
    }
    .other-cursor {
        width: 2px;
        height: 20px;
        background-color: #ff7733;
    }
</style>