import Ctrl from './ctrl'
const UPLOAD_STATUS = {
    WAIT: 0,
    UPLOAD_ING: 1,
    SUCESS: 2,
    FAILED: 3
}
class Uploader extends Ctrl {

    constructor(options) {
        super()
        var self = this
        self.xhr = new XMLHttpRequest()
        self.counter = 0
        self.uploadingCounter = 0
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
            fileParamName: 'file'
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
            for (var item of self._files) {
                if(item.status === UPLOAD_STATUS.SUCESS || item.status === UPLOAD_STATUS.FAILED){
                    continue
                }
                if (item.status === UPLOAD_STATUS.WAIT && self.uploadingCounter < options.uploadFileMax) {
                    self.uploadingCounter++
                        let xhr = new XMLHttpRequest()
                    let formData = new FormData()
                    formData.append(options.fileParamName, item.source)
                    for (key in options.param) {
                        formData.append(key, options.param[key])
                    }
                    xhr.open('post', options.uploadUrl)
                    xhr.send(formData)
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 && xhr.status == 200) {　　　　　　
                            try {
                                let json = JSON.parse(xhr.responseText)
                                if (json.success) {
                                    self.onSuccess(item)
                                    self.upload()
                                } else {
                                    self.onFail(item)
                                }
                            } catch (e) {
                                self.onFail(item)
                            }
                        }
                    }
                }else{
                    break
                }
            }

        }

    }
    onSuccess(file) {
        var self = this
        file.status = UPLOAD_STATUS.SUCESS
        self.uploadingCounter--
            self.trigger('uploadSuccess', file)
    }
    onFail(file) {
        var self = this
        file.status = UPLOAD_STATUS.FAILED
        self.uploadingCounter--
            self.trigger('uploadFail', file)
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
}
module.exports=Uploader