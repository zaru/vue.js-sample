<template lang="pug">
div#paper

    div.other-users
        div.user(v-for="user in users" v-bind:style="{ backgroundColor: user.color }")
            | {{ user.id[0].toUpperCase() }}
    div#editor-content
        transition(name="fade")
            div#embedbox(v-show="showEmbedbox")
                icon(name="plus-circle" scale="2")
        transition(name="fade")
            div#toolbox(v-show="showToolbox")
                button.btn-bold(v-on:click="bold")
                    icon(name="bold")
                button.btn-bold(v-on:click="strike")
                    icon(name="strikethrough")
                button.btn-bold(v-on:click="underline")
                    icon(name="underline")
                button.btn-bold(v-on:click="italic")
                    icon(name="italic")
                button.btn-bold(v-on:click="header")
                    icon(name="header")
                button.btn-bold(v-on:click="hr")
                    icon(name="minus")
        div#editor-main(contenteditable="true"
            data-placeholder="本文を入力してください"
            v-on:mouseup="caret_update"
            v-on:keyup="caret_update"
            v-on:keyup.enter="convert_paragraph"
            v-on:selectstart="start_selection"

            v-bind:class="status_class"
            v-on:dragover.stop.prevent="dragover"
            v-on:dragleave.stop.prevent="dragleave"
            v-on:drop.stop.prevent="drop"

            v-on:mouseover="overlay_embedbox"
            )
</template>

<script>
export default {
  name: 'editor',
  data () {
    return {
      showToolbox: false,
      showEmbedbox: false,
      isConnected: false,
      socketMessage: '',
      user_color: this.get_color(),
      users: []
    }
  },
  mounted() {
//    document.getElementById('editor-main').focus();
  },
  sockets: {
    connect() {
      this.isConnected = true;

      this.$socket.emit("sync_user_to_server", {
        color: this.user_color
      });
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
    },

    sync_user_to_client (data) {
      this.users.push({ id: data.user_id, color: data.color});
    },

    file_path_to_client(path) {
      let img = document.createElement('img');
      img.setAttribute('src', path);
      this.current_caret_insert_node(img);
    }
  },
  methods: {
    start_selection () {
      document.addEventListener('mouseup', this.show_toolbar, {
        once: true
      });
    },
    show_toolbar () {
      let sel = window.getSelection();
      if (sel.isCollapsed) {
        return;
      }

      this.showToolbox = true;

      let position = this.caret_position();

      let toolbox = document.getElementById('toolbox').style;
      toolbox.top = position.top - 50 + 'px';
      toolbox.left = position.left - 30 + 'px';

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
    header () {
      document.execCommand('formatBlock', false, 'h2');
    },
    hr () {
      document.execCommand('insertHorizontalRule', false, null);
    },
    convert_paragraph() {
      document.execCommand('formatBlock', false, 'p');
    },
    caret_update () {
      let position = this.caret_position();

      this.$socket.emit("sync_caret_and_content_to_server", {
        top: position.top,
        left: position.left,
        content: document.getElementById('editor-main').innerHTML,
        color: this.user_color
      });
    },
    current_caret_insert_node(dom) {
      let sel = window.getSelection();
      let range = sel.getRangeAt(0);
      range.insertNode(dom);
    },
    caret_position () {
      // 座標を計測するためのダミー用のspanを入れる
      let anchor = document.createElement('span');
      this.current_caret_insert_node(anchor);

      let parent_position = document.getElementById('editor-main').getBoundingClientRect();
      let caret_position = anchor.getBoundingClientRect();
      anchor.parentElement.removeChild(anchor);
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
    },
    overlay_embedbox (e) {
      let current_dom = e.srcElement;
      if (current_dom.tagName == 'P') {
        let position = current_dom.getBoundingClientRect();
        let parent_position = document.getElementById('editor-main').getBoundingClientRect();

        let toolbox = document.getElementById('embedbox').style;
        toolbox.top = position.top - parent_position.top - 3 + 'px';
        toolbox.left = '-30px';
        this.showEmbedbox = true;
      } else {
        this.showEmbedbox = false;
      }
    }
  },
  mixins: [
    require('./libs/DragDrop.vue'),
  ]
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
        padding: 10px;
        line-height: 1.6;
        outline: 0;
        color: #1b2733;
        h2 {
            font-size: 24px;
            margin: 15px 0;
            padding: 0;
            letter-spacing: 2px;
        }
        p {
            font-size: 16px;
            margin: 0px 0px 15px 0px;
            letter-spacing: 1px;
        }
        hr {
            border: 0;
            margin: 2em auto;
            width: 90%;
            max-width: 100%;
            background-position: 50%;
            box-sizing: border-box;

            height: 8px;
            background-image: radial-gradient(
                            farthest-side at 50% -50%,
                            hsla(0, 0%, 20%, 0.1),
                            hsla(0, 0%, 0%, 0));
            position: relative;
            &:before {
                content: "";
                height: 1px;
                position: absolute;
                top: -1px;
                left: 0;
                right: 0;
                background-image: linear-gradient(
                                90deg,
                                hsla(0, 0%, 70%, 0.1),
                                hsla(0, 0%, 20%, 0.15) 80%,
                                hsla(0, 0%, 70%, 0.1));
            }
        }
        img {
            width: 70%;
            margin: 10px auto;
            display: block;
        }
        &:empty:before {
            position: absolute;
            top: 10px;
            left: 10px;
            color: #aaa;
            content: attr(data-placeholder);
        }
        &.dragover {
            background-color: #f9f3f6;
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
    #toolbox {
        background-color: #1b2733;
        box-shadow: 0 0 0 1px #000, 0 8px 16px rgba(27,39,51,0.16);
        border-radius: 5px;
        padding: 0 5px;
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
    .other-users {
        text-align: right;
        .user {
            display: inline-block;
            color: #ffffff;
            padding: 5px;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            width: 20px;
            height: 20px;
            border-radius: 5px;
            margin: 3px;
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to {
        opacity: 0
    }

    #embedbox {
        color: #bbbbbb;
        position: absolute;
    }
    .spin-enter-active, .spin-leave-active {
        /*transition: opacity .5s*/
    }
    .spin-enter, .spin-leave-to {
        /*opacity: 0*/
    }
</style>
