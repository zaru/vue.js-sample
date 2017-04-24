import Vue from 'vue'
import editor from './Editor.vue'

import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
export const SocketInstance = socketio('http://localhost:3000');
Vue.use(VueSocketIO, SocketInstance)

new Vue({
  el: '#editor',
  render: h => h(editor)
})
