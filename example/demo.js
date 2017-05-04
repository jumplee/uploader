var uploader=new Uploader({
            uploadUrl:'/file/uploading',
            accept:'jpg'
        })
        uploader.on('finish',function(){
            console.log(this.getFiles())
        })
        var app = new Vue({
            el: '#app',
            data: {
                message: 'Hello Vue!',
                files:[]
            },
            created:function(){
                this.files=uploader.getFiles()
                console.log(this.files)
            },
            methods:{
                selectFile:function(e){
                    var files=e.target.files;
                    var self=this;
                    for(var i=0;i<files.length;i++){
                        var file=files[i]
                        uploader.addFile(file)
                    }
                },
                up:function(){
                    uploader.upload()
                },
                del:function(file){
                    uploader.removeFile(file)
                }
            }
        })