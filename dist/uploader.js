(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Uploader"] = factory();
	else
		root["Uploader"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//https://github.com/jeromeetienne/microevent.js
var Ctrl = function () {
    function Ctrl() {
        _classCallCheck(this, Ctrl);

        this.counter = 0;
    }

    _createClass(Ctrl, [{
        key: "on",
        value: function on(event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        }
    }, {
        key: "off",
        value: function off(event, fct) {
            this._events = this._events || {};
            if (event in this._events === false) return;
            this._events[event].splice(this._events[event].indexOf(fct), 1);
        }
    }, {
        key: "trigger",
        value: function trigger(event /* , args... */) {
            this._events = this._events || {};
            if (event in this._events === false) return;
            for (var i = 0; i < this._events[event].length; i++) {
                this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }]);

    return Ctrl;
}();

exports.default = Ctrl;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ctrl = __webpack_require__(0);

var _ctrl2 = _interopRequireDefault(_ctrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
    version 0.1 上传组件
*/
var isDebug = false;

//文件上传状态
var UPLOAD_STATUS = {
    WAIT: 0,
    UPLOAD_ING: 1,
    SUCESS: 2,
    FAILED: 3
};

function log(info) {
    if (isDebug) {
        console.log(info);
    }
}

function query(key, value, list) {
    for (var i = 0; i < list.length; i++) {
        if (typeof value === 'function') {
            if (value(list[i])) {
                return list[i];
            }
        } else {
            if (list[i][key] === value) {
                return list[i];
            }
        }
    }
}

function where(key, value, list) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        if (typeof value === 'function') {
            if (value(list[i])) {
                arr.push(list[i]);
            }
        } else {
            if (list[i][key] === value) {
                arr.push(list[i]);
            }
        }
    }
    return arr;
}

function createObjectURL() {
    return window.URL.createObjectURL.apply(this, arguments);
}

var Uploader = function (_Ctrl) {
    _inherits(Uploader, _Ctrl);

    function Uploader(options) {
        _classCallCheck(this, Uploader);

        var _this = _possibleConstructorReturn(this, (Uploader.__proto__ || Object.getPrototypeOf(Uploader)).call(this));

        var self = _this;
        self.xhr = new XMLHttpRequest();
        self.counter = 0;
        self.uploadingCounter = 0;
        self._beforeLen = 0;
        self._files = [];
        self._queue = [];
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
            }
        };
        if (!options.uploadUrl) {
            throw Error('上传地址不能为空');
        }
        //浅拷贝，对象属性会覆盖而不是合并
        self.options = Object.assign({}, defaultOptions, options);
        if (typeof self.options.accept === 'string') {
            var typeStr = self.options.accept.split(',').join('|');
            // 黑人❓ 的全局模式g lastIndex会记录上次执行的位置，下次执行的时候从lastIndex开始查询
            // self.options.acceptReg=new RegExp(`.*\\.(${typeStr})$`,'ig')
            self.options.acceptReg = new RegExp('.*\\.(' + typeStr + ')$', 'i');
        } else if (_typeof(self.options.accept) === 'object') {
            self.options.acceptReg = self.options.accept;
        }
        return _this;
    }

    /**
     * 上传
     */


    _createClass(Uploader, [{
        key: 'upload',
        value: function upload() {
            var self = this;
            var options = self.options;
            if (self._uploading) {
                log('上传中...');
                return false;
            }
            self._uploading = true;
            self._files.forEach(function (item) {
                if (item.status === UPLOAD_STATUS.UPLOAD_ING || item.status === UPLOAD_STATUS.FAILED) {
                    item.status = UPLOAD_STATUS.WAIT;
                }
            });
            self._queue = where('status', function (file) {
                return file.status === UPLOAD_STATUS.WAIT;
            }, self._files);
            self._timer = setInterval(function () {
                var queue = self._queue;
                var len = Math.min(self.uploadingCounter + options.uploadFileMax, queue.length);
                for (var i = self._beforeLen; i < len; i++) {
                    self._upload(queue[i]);
                }
                self._beforeLen = len;
                if (self.uploadingCounter + options.uploadFileMax > queue.length) {
                    clearInterval(self._timer);
                }
                log(new Date());
            }, 300);
        }
    }, {
        key: '_upload',
        value: function _upload(file) {
            var self = this;
            var options = self.options;
            //不是等待状态的就不上传
            if (file.status !== UPLOAD_STATUS.WAIT) {
                self.uploadingCounter++;
                return false;
            }
            var xhr = new XMLHttpRequest();
            var formData = new FormData();
            formData.append(options.fileParamName, file.source);
            for (key in options.param) {
                formData.append(key, options.param[key]);
            }
            xhr.open('post', options.uploadUrl);
            xhr.send(formData);
            file.status = UPLOAD_STATUS.UPLOAD_ING;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var json = {};
                        //不要将onSuccess或者onError包括道try中
                        //避免回调函数中报错触发catch
                        try {
                            json = JSON.parse(xhr.responseText);
                        } catch (e) {
                            self.onFail(file);
                            json.success = false;
                        }
                        if (json.success) {
                            self.onSuccess(file, json);
                        } else {
                            self.onFail(file);
                        }
                    } else {
                        log(xhr.status);
                        self.onFail(file);
                    }
                }
            };
        }
    }, {
        key: 'onEnd',
        value: function onEnd(file) {
            var self = this;

            self.uploadingCounter++;
            //所有的文件都上传完或者上传失败了
            if (self.uploadingCounter === self._queue.length) {
                self._uploading = false;
                self.uploadingCounter = 0;
                self._beforeLen = 0;
                var _flag = true;
                self._files.forEach(function (item) {
                    if (item.status === UPLOAD_STATUS.FAILED) {
                        _flag = false;
                        return false;
                    }
                });
                self.trigger('finish', _flag);
            }
        }
    }, {
        key: 'onSuccess',
        value: function onSuccess(file, json) {
            var self = this;
            file.status = UPLOAD_STATUS.SUCESS;
            file.remoteUrl = json.fileUrl;
            self.trigger('uploadSuccess', file);
            self.onEnd(file);
        }
    }, {
        key: 'onFail',
        value: function onFail(file) {
            var self = this;
            file.status = UPLOAD_STATUS.FAILED;
            self.trigger('uploadFail', file);
            self.onEnd(file);
        }
    }, {
        key: 'addFile',
        value: function addFile(sourceFile) {
            var self = this;
            var options = self.options;

            if (options.acceptReg && !options.acceptReg.test(sourceFile.name)) {
                log(sourceFile.name + '不在accept设置范围内');
                return false;
            }
            var file = {
                source: sourceFile,
                id: self.uuid(),
                status: UPLOAD_STATUS.WAIT,
                thumb: options.thumb.defaultUrl
            };

            self._files.push(file);
            if (options.thumb) {
                if (options.compress) {
                    self._makeThumb(file);
                } else {
                    file.thumb = createObjectURL(sourceFile);
                }
            }
        }
    }, {
        key: 'removeFile',
        value: function removeFile(file) {
            var targetIndex = -1;
            this._files.forEach(function (item, index) {
                if (item.id === file.id) {
                    targetIndex = index;
                }
            });
            this._files.splice(targetIndex, 1);
        }
    }, {
        key: '_makeThumb',
        value: function _makeThumb(file) {
            this.makeThumb(file.source).then(function (thumbUrl) {
                file.thumb = thumbUrl;
            });
        }
    }, {
        key: 'makeThumb',
        value: function makeThumb(sourceFile) {
            return new Promise(function (resolve, reject) {
                var thumbOptions = this.options.thumb;
                var blob_url = createObjectURL(sourceFile);
                var temp_image = new Image();
                var canvas = document.createElement('canvas');
                var preview_width = thumbOptions.width;
                var preview_height = thumbOptions.height;
                temp_image.src = blob_url;
                canvas.width = preview_width;
                canvas.height = preview_height;
                var ctx = canvas.getContext('2d');
                temp_image.onload = function () {
                    ctx.drawImage(temp_image, 0, 0, preview_width, preview_height);
                    //清空原来的BLOB对象，释放内存。
                    window.URL.revokeObjectURL(this.src);
                    //耗时操作
                    var blob_image_url = canvas.toDataURL("image/jpeg");
                    resolve(blob_image_url);
                    //切除引用关系
                    //delete temp_image;
                    //delete canvas;
                    //delete ctx;
                    this.src = null;
                    canvas = null;
                    ctx = null;
                    temp_image.onload = null;
                    temp_image = null;
                };
            });
        }
    }, {
        key: 'stop',
        value: function stop() {}
    }, {
        key: 'uuid',
        value: function uuid() {
            var uuid = this.options.uuidPrefix + this.counter;
            this.counter++;
            return uuid;
        }
    }, {
        key: 'getFiles',
        value: function getFiles() {
            return this._files;
        }
    }, {
        key: 'clear',
        value: function clear() {
            this._files = [];
        }
    }]);

    return Uploader;
}(_ctrl2.default);

module.exports = Uploader;

/***/ })
/******/ ]);
});
//# sourceMappingURL=uploader.js.map