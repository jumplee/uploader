var uploader=new Uploader({
            uploadUrl:'/file/uploading'
        })
        var app = new Vue({
            el: '#app',
            data: {
                message: 'Hello Vue!',
                files:[]
            },
            methods:{
                selectFile:function(e){
                    var files=e.target.files;
                    var self=this;
                    for(var i=0;i<files.length;i++){
                        var file=files[i]
                        self.files.push({
                            fileName:file.name
                        })
                        uploader.addFile(file)
                    }
                },
                up:function(){
                    uploader.upload()
                }
            }
        })