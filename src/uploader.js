import Ctrl from './ctrl'
/**
 * @version 0.1.1 上传组件
 */
const isDebug = false

//文件上传状态
const UPLOAD_STATUS = {
    WAIT: 0,
    UPLOAD_ING: 1,
    SUCESS: 2,
    FAILED: 3
}

function log(info) {
    if (isDebug) {
        console.log(info)
    }
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

function createObjectURL() {
    return window.URL.createObjectURL.apply(this, arguments)
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
            //最多选择数量，默认为0不限制
            maxSize: 0,
            //同时上传的最多数量
            uploadFileMax: 5,
            //向后台传递的参数
            param: {},
            fileParamName: 'file',
            //只接受类型或者正则
            /**
             * @example
             * accept:'jpg,png,bmp,gif,jpeg'
             * accept:'xls,doc,docx,ppt,pptx'
             */
            accept: '',
            thumb: {
                defaultUrl: 'defaultThumb.jpg'
            },
        }
        if (!options.uploadUrl) {
            throw Error('上传地址不能为空')
        }
        //浅拷贝，对象属性会覆盖而不是合并
        self.options = Object.assign({}, defaultOptions, options)
        if (typeof self.options.accept === 'string') {
            let typeStr = self.options.accept.split(',').join('|')
            // 黑人❓ 的全局模式g lastIndex会记录上次执行的位置，下次执行的时候从lastIndex开始查询
            // self.options.acceptReg=new RegExp(`.*\\.(${typeStr})$`,'ig')
            self.options.acceptReg = new RegExp(`.*\\.(${typeStr})$`, 'i')
        } else if (typeof self.options.accept === 'object') {
            self.options.acceptReg = self.options.accept
        }
    }

    /**
     * 上传
     */
    upload() {
        var self = this
        var options = self.options
        if (self._uploading) {
            log('上传中...')
            return false;
        }
        self._uploading = true
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
            log(new Date())
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
                    let json = {}
                    //不要将onSuccess或者onError包括道try中
                    //避免回调函数中报错触发catch
                    try {
                        json = JSON.parse(xhr.responseText)
                    } catch (e) {
                        self.onFail(file)
                        json.success = false
                    }
                    if (json.success) {
                        self.onSuccess(file, json)
                    } else {
                        self.onFail(file)
                    }
                } else {
                    log(xhr.status)
                    self.onFail(file)
                }

            }
        }
    }
    onEnd(file) {
        var self = this

        self.uploadingCounter++
            //所有的文件都执行完毕，未必都成功
            if (self.uploadingCounter === self._queue.length) {
                self._uploading = false
                self.uploadingCounter = 0
                self._beforeLen = 0
                let _flag = true
                self._files.forEach((item) => {
                    if (item.status === UPLOAD_STATUS.FAILED) {
                        _flag = false
                        return false
                    }
                })
                self.trigger('finish', _flag)
            }

    }
    onSuccess(file, json) {
        var self = this
        file.status = UPLOAD_STATUS.SUCESS
        file.returnJson = json
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

        if (options.acceptReg && !options.acceptReg.test(sourceFile.name)) {
            log(sourceFile.name + '不在accept设置范围内')
            return false
        }
        var file = {
            source: sourceFile,
            id: self.uuid(),
            status: UPLOAD_STATUS.WAIT,
            thumb: options.thumb.defaultUrl
        }

        self._files.push(file)
        if (options.thumb) {
            if (options.compress) {
                self._makeThumb(file)
            } else {
                file.thumb = createObjectURL(sourceFile)
            }

        }
    }
    removeFile(file) {
        var targetIndex = -1
        this._files.forEach((item, index) => {
            if (item.id === file.id) {
                targetIndex = index
            }
        })
        this._files.splice(targetIndex, 1)
    }
    _makeThumb(file) {
        this.makeThumb(file.source).then((thumbUrl) => {
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
    clear() {
        this._files = []
    }
}
module.exports = Uploader