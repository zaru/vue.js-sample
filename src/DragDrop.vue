<template lang="pug">
    div#drag_drop
        div#drop_zone(
            v-bind:class="status_class"
            v-on:dragover.stop.prevent="dragover"
            v-on:dragleave.stop.prevent="dragleave"
            v-on:drop.stop.prevent="drop"
            )
</template>

<script>
  export default {
    name: 'drag_drop',
    data () {
      return {
        status_class: ''
      }
    },
    methods: {
      dragover () {
        this.status_class = "dragover";
      },
      dragleave () {
        this.status_class = "dragleave";
      },
      drop (e) {
        let files = e.dataTransfer.files;
        console.log(files);

        this.status_class = "dragleave";
      }
    }
  }
</script>

<style lang="scss">
    #drop_zone {
        width: 100%;
        height: 300px;
        border: 1px dashed #dddddd;
        background-color: #fafafa;
        &.dragover {
            background-color: #ffccdd;
        }
    }
</style>
