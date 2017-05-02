<template lang="pug">
    div#draggable_sample
        div
            |myArray is
            |{{ myArray }}

        div
            |order_ids is
            |{{ order_ids }}

        draggable( v-model="myArray" :options="{group:'people'}" @start="drag=true" @end="drag=false" @update="update" )
            div( v-for="element in myArray" )
                |{{element.id}} | {{element.name}}
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'draggable_sample',
    data () {
      return {
        myArray: [
          {
            id: 1,
            name: "hoge"
          },
          {
            id: 2,
            name: "piyo"
          },
          {
            id: 3,
            name: "fuga"
          }
        ],
        order_ids: []
      }
    },
    methods: {
      update (e) {
        console.log("newIndex = " + e.newIndex + " / " + "oldIndex = " + e.oldIndex);
        this.order_ids = this.myArray.map( v => { return {id: v.id} });
      }
    },
    components: {
      draggable,
    }
  }
</script>

<style lang="scss">
</style>
