<script>
  export default {
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