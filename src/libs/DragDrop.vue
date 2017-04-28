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
        this.file_upload(files[0]);

        this.status_class = "dragleave";
      },
      file_upload (file) {
        console.log(file);
        let fileReader = new FileReader();

        fileReader.readAsBinaryString(file);
        fileReader.onload = (event) => {
          this.$socket.emit('file_upload', {
            file: event.target.result,
            type: file.type
          });
        };
      }
    }
  }
</script>