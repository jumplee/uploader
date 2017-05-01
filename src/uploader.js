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
        var defaultOptions = {
            uploadUrl: '',
            uuidPrefix: 'file-',
            //一次性传输完还是多个文件同时传输
            mutiUpload: false,
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
        if (self.options.mutiUpload) {

        } else {
            // for (var item of self._files) {
            //     if (item.status !== UPLOAD_STATUS.WAIT) {
            //         continue
            //     }
            //     if (item.status === UPLOAD_STATUS.WAIT && self.uploadingCounter < options.uploadFileMax) {
            //         self.uploadingCounter++

            //     } else {
            //         break
            //     }
            // }
            var len = Math.min(self.uploadingCounter + options.uploadFileMax, self._files.length)
           
            for (var i = self._beforeLen; i < len; i++) {
                self._upload(self._files[i])
            }
            self._beforeLen=len
        }
    }
    _upload(file) {
        var self = this
        var options = self.options
        //不是等待状态的就不上传
        if (file.status !== UPLOAD_STATUS.WAIT) {
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
            if (xhr.readyState == 4 && xhr.status == 200) {　　　　　　
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
            }
        }
    }
    onEnd(file) {
        this.uploadingCounter++
        
        if (this.uploadingCounter <= this._files.length) {
            this.upload()
        } else {
            this.uploadingCounter = 0
            this._beforeLen=0
            this.trigger('finish')
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
        return self._files
    }
}
module.exports = Uploader