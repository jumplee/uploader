import Ctrl from './ctrl'
const UPLOAD_STATUS = {
    WAIT: 0,
    UPLOAD_ING: 1,
    SUCESS: 2,
    FAILED: 3
}

function query(key, value, list) {
    for (var i = 0; i < list.length; i++) {
        if (typeof value === 'function') {
            if (value(list[i])) {
                return list[i]
            }
        } else {
            if (list[i][key] === value) {
                return list[i]
            }
        }

    }
}

function where(key, value, list) {
    var arr = []
    for (var i = 0; i < list.length; i++) {
        if (typeof value === 'function') {
            if (value(list[i])) {
                arr.push(list[i])
            }
        } else {
            if (list[i][key] === value) {
                arr.push(list[i])
            }
        }

    }
    return arr
}
function createObjectURL(){
    return window.URL.createObjectURL.apply(this,arguments)
}
class Uploader extends Ctrl {

    constructor(options) {
        super()
        var self = this
        self.xhr = new XMLHttpRequest()
        self.counter = 0
        self.uploadingCounter = 0
        self._beforeLen = 0
        self._files = []
        self._queue = []
        var defaultOptions = {
            uploadUrl: '',
            uuidPrefix: 'file-',
            //最多选择数量
            maxSize: 0,
            //同时上传的最多数量
            uploadFileMax: 5,
            param: {},
            fileParamName: 'file',
            //简单thumb模式，只是将图片文件通过而不压缩
            simpleThumb:true,
            thumb: {
                width: 110,
                height: 110,
                quality: 70,
                allowMagnify: true,
                crop: true,
                preserveHeaders: false,
                // 为空的话则保留原有图片格式。
                // 否则强制转换成指定的类型。
                // IE 8下面 base64 大小不能超过 32K 否则预览失败，而非 jpeg 编码的图片很可
                // 能会超过 32k, 所以这里设置成预览的时候都是 image/jpeg
                type: 'image/jpeg',
                defaultUrl: 'defaultThumb.jpg'
            },
        }
        if (!options.uploadUrl) {
            throw Error('上传地址不能为空')
        }
        //浅拷贝，对象属性会覆盖而不是合并
        self.options = Object.assign({}, defaultOptions, options)
    }

    /**
     * 上传
     */
    upload() {
        var self = this
        var options = self.options
        self._files.forEach((item) => {
            if (item.status === UPLOAD_STATUS.UPLOAD_ING ||
                item.status === UPLOAD_STATUS.FAILED) {
                item.status = UPLOAD_STATUS.WAIT
            }
        })
        self._queue = where('status', (file) => {
            return file.status === UPLOAD_STATUS.WAIT
        }, self._files)
        self._timer = setInterval(function () {
            var queue = self._queue
            var len = Math.min(self.uploadingCounter + options.uploadFileMax, queue.length)
            for (var i = self._beforeLen; i < len; i++) {
                self._upload(queue[i])
            }
            self._beforeLen = len
            if (self.uploadingCounter + options.uploadFileMax > queue.length) {
                clearInterval(self._timer)
            }
            console.log(new Date())
        }, 300)
    }
    _upload(file) {
        var self = this
        var options = self.options
        //不是等待状态的就不上传
        if (file.status !== UPLOAD_STATUS.WAIT) {
            self.uploadingCounter++
                return false
        }
        let xhr = new XMLHttpRequest()
        let formData = new FormData()
        formData.append(options.fileParamName, file.source)
        for (key in options.param) {
            formData.append(key, options.param[key])
        }
        xhr.open('post', options.uploadUrl)
        xhr.send(formData)
        file.status = UPLOAD_STATUS.UPLOAD_ING
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {　　　
                if (xhr.status == 200) {
                    try {
                        let json = JSON.parse(xhr.responseText)
                        if (json.success) {
                            self.onSuccess(file)
                        } else {
                            self.onFail(file)
                        }
                    } catch (e) {
                        self.onFail(file)
                    }
                } else {
                    console.log(xhr.status)
                    self.onFail(file)
                }

            }
        }
    }
    onEnd(file) {
        var self = this
        self.uploadingCounter++
            // console.log(this.uploadingCounter)
            if (self.uploadingCounter === self._queue.length) {
                // console.log(this.uploadingCounter)
                self.uploadingCounter = 0
                self._beforeLen = 0
                self.trigger('finish')
            }

    }
    onSuccess(file) {
        var self = this
        file.status = UPLOAD_STATUS.SUCESS
        self.trigger('uploadSuccess', file)
        self.onEnd(file)
    }
    onFail(file) {
        var self = this
        file.status = UPLOAD_STATUS.FAILED
        self.trigger('uploadFail', file)
        self.onEnd(file)
    }
    addFile(sourceFile) {
        var self = this
        var options = self.options
        var file = {
            source: sourceFile,
            id: self.uuid(),
            status: UPLOAD_STATUS.WAIT,
            thumb: options.thumb.defaultUrl
        }
        self._files.push(file)
        if (options.simpleThumb) {
            file.thumb=createObjectURL(sourceFile)
        }else{
            if(options.thumb){
                self._makeThumb(file)
            }
        }
    }
    removeFile(file){
        var targetIndex=-1
        this._files.forEach((item,index)=>{
            if(item.id===file.id){
                targetIndex=index
            }
        })
        this._files.splice(targetIndex,1)
    }
    _makeThumb(file) {
        this.makeThumb(file.source).then((thumbUrl)=>{
            file.thumb = thumbUrl
        })
    }
    makeThumb(sourceFile) {
        return new Promise(function (resolve, reject) {
            var thumbOptions = this.options.thumb
            var blob_url = createObjectURL(sourceFile)
            var temp_image = new Image()
            var canvas = document.createElement('canvas')
            var preview_width = thumbOptions.width
            var preview_height = thumbOptions.height
            temp_image.src = blob_url
            canvas.width = preview_width
            canvas.height = preview_height
            var ctx = canvas.getContext('2d')
            temp_image.onload = function () {
                ctx.drawImage(temp_image, 0, 0, preview_width, preview_height)
                //清空原来的BLOB对象，释放内存。
                window.URL.revokeObjectURL(this.src)
                //耗时操作
                var blob_image_url = canvas.toDataURL("image/jpeg");
                resolve(blob_image_url)
                //切除引用关系
                //delete temp_image;
                //delete canvas;
                //delete ctx;
                this.src = null
                canvas = null
                ctx = null
                temp_image.onload = null
                temp_image = null
            };
        })
    }
    stop() {

    }
    uuid() {
        var uuid = this.options.uuidPrefix + this.counter
        this.counter++
            return uuid
    }
    getFiles() {
        return this._files
    }
}
module.exports = Uploader