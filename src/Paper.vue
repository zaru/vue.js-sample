<template lang="pug">
div#paper
    div.toolbox(v-show="showToolbox")
        button.btn-bold(v-on:click="bold") b
        button.btn-bold(v-on:click="strike") s
        button.btn-bold(v-on:click="underline") u
        button.btn-bold(v-on:click="italic") i
    div#editor-content
        div#editor-main(contenteditable="true"
            v-on:mouseup="caret_update"
            v-on:keyup="caret_update"
            v-on:keyup.enter="convert_paragraph"
            v-on:selectstart="start_selection"
            )
</template>

<script>
export default {
  name: 'editor',
  data () {
    return {
      showToolbox: true,
      isConnected: false,
      socketMessage: '',
      user_color: this.get_color()
    }
  },
  mounted() {
    document.getElementById('editor-main').focus();
  },
  sockets: {
    connect() {
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    content (content) {
      document.getElementById('editor-main').innerHTML = content;
    },

    sync_caret_and_content_to_client (data) {
      this.set_other_caret(data);
      this.set_other_user(data);
      document.getElementById('editor-main').innerHTML = data.content;
    },

    remove_caret (data) {
      let doms = document.querySelectorAll('[data-user-id="' + data.user_id + '"]');
      doms.forEach( dom => {
        dom.parentElement.removeChild(dom);
      })
    }
  },
  methods: {
    start_selection () {
      document.addEventListener('mouseup', this.show_toolbar, {
        once: true
      });
    },
    show_toolbar () {
      this.showToolbox = true;
      document.addEventListener('mouseup', this.hide_toolbox, {
        once: true
      });
    },
    hide_toolbox() {
      this.showToolbox = false;
    },
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
    convert_paragraph() {
      document.execCommand('formatBlock', false, 'p');
    },
    caret_update () {
      let sel = window.getSelection();
      let range = sel.getRangeAt(0);

      // 座標を計測するためのダミー用のspanを入れる
      let anchor = document.createElement('span');
      range.insertNode(anchor);
      let position = this.caret_position(anchor);

      this.set_guide(position);
      this.set_information(position);

      anchor.parentElement.removeChild(anchor);

      this.$socket.emit("sync_caret_and_content_to_server", {
        top: position.top,
        left: position.left,
        content: document.getElementById('editor-main').innerHTML,
        color: this.user_color
      });
    },
    caret_position (anchor) {
      let parent_position = document.getElementById('editor-main').getBoundingClientRect();
      let caret_position = anchor.getBoundingClientRect();
      return {
        top: caret_position.top - parent_position.top,
        left: caret_position.left - parent_position.left
      };
    },
    set_guide (position) {
      let guide = document.getElementById('js-cursor-guide') || document.createElement('div');
      guide.id = 'js-cursor-guide';
      let guideStyle = guide.style;
      guideStyle.width = position.left + 'px';
      guideStyle.height = position.top + 'px';
      document.getElementById('editor-content').appendChild(guide);
    },
    set_information (position) {
      let information = document.getElementById('js-cursor-information') || document.createElement('div');
      information.id = 'js-cursor-information';
      information.innerText = 'Top: ' + position.top + ' / Left: ' + position.left;
      let informationStyle = information.style;
      informationStyle.top = position.top + 30 + 'px';
      informationStyle.left = position.left + 'px';
      document.getElementById('editor-content').appendChild(information);
    },
    set_other_caret (data) {
      let guide = document.getElementById('js-other-cursor-' + data.user_id) || document.createElement('div');
      guide.id = 'js-other-cursor-' + data.user_id;
      guide.dataset.userId = data.user_id;
      guide.classList.add('other-cursor');
      let guideStyle = guide.style;
      guideStyle.position = 'absolute';
      guideStyle.top = data.top + 'px';
      guideStyle.left = data.left + 'px';
      guideStyle.backgroundColor = data.color;
      document.getElementById('editor-content').appendChild(guide);
    },
    set_other_user (data) {
      let guide = document.getElementById('js-other-user-' + data.user_id) || document.createElement('div');
      guide.id = 'js-other-user-' + data.user_id;
      guide.dataset.userId = data.user_id;
      guide.classList.add('other-user');
      guide.innerText = data.user_id;
      let guideStyle = guide.style;
      guideStyle.position = 'absolute';
      guideStyle.top = data.top - 25 + 'px';
      guideStyle.left = data.left + 'px';
      guideStyle.backgroundColor = data.color;
      document.getElementById('editor-content').appendChild(guide);
    },
    get_color () {
      let colors = ['#14E1E3', '#C5FB25', '#FFAB00', '#FF065B', '#7C32FF', '#FF4C1E', '#FBE525', '#2797FF', '#28C93F'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }
}
</script>

<style lang="scss">
    #editor-content {
        position: relative;
        margin: 100px auto;
        width: 745px;
    }
    #editor-main {
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic", YuGothic, "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ", Meiryo, sans-serif;
        cursor: text;
        background-color: #fafafa;
        padding: 10px;
        line-height: 1.6;
        outline: 0;
        color: #1b2733;
        p {
            font-size: 16px;
            margin: 0px 0px 15px 0px;
        }
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
    }
    .other-user {
        width: auto;
        font-size: 10px;
        color: #ffffff;
        padding: 3px;
    }
    .toolbox {
        background-color: #1b2733;
        box-shadow: 0 0 0 1px #000, 0 8px 16px rgba(27,39,51,0.16);
        border-radius: 5px;
        position: absolute;
        button {
            margin: 5px;
            padding: 5px;
            font-size: 16px;
            font-weight: normal;
            border: 0;
            background-color: transparent;
            color: #c1c7cd;
            cursor: pointer;
            &:hover {
                color: #ffffff;
            }
        }
    }
</style>
