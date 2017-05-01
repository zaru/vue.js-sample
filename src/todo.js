import Vue from 'vue'
import todo from './Todo.vue'

Vue.directive('focus', {
  inserted: function (el) {
    console.log(el)
    el.focus()
  }
})

new Vue({
  el: '#todo',
  render: h => h(todo)
})
