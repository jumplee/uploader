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
class Uploader extends Ctrl {

    constructor(options) {
        super()
        var self = this
        self.xhr = new XMLHttpRequest()
        self.counter = 0
        self.uploadingCounter = 0
        self._beforeLen=0
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
            thumb: false
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
        self._files.forEach((item)=>{
            if(item.status === UPLOAD_STATUS.UPLOAD_ING ||
            item.status === UPLOAD_STATUS.FAILED){
                item.status = UPLOAD_STATUS.WAIT
            }
        })
        self._queue=where('status',(file)=>{
            return file.status === UPLOAD_STATUS.WAIT
        },self._files)
        self._timer=setInterval(function(){
            var queue=self._queue
            var len = Math.min(self.uploadingCounter + options.uploadFileMax, queue.length)
            for (var i = self._beforeLen; i < len; i++) {
                self._upload(queue[i])
            }
            self._beforeLen=len
            if(self.uploadingCounter + options.uploadFileMax > queue.length){
                clearInterval(self._timer)
            }
            console.log(new Date())
        },300)
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
                if(xhr.status == 200){
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
                }else{
                    console.log(xhr.status)
                    self.onFail(file)
                }

            }
        }
    }
    onEnd(file) {
        var self=this
        self.uploadingCounter++
        // console.log(this.uploadingCounter)
        if (self.uploadingCounter === self._queue.length) {
            // console.log(this.uploadingCounter)
            self.uploadingCounter = 0
            self._beforeLen=0
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
    addFile(file) {
        var self = this
        self._files.push({
            source: file,
            id: self.uuid(),
            status: UPLOAD_STATUS.WAIT
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