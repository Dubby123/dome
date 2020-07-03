<template>
    <div id="global-uploader">
        <!-- 上传 -->
        <uploader
            ref="uploader"
            :options="options"
            :autoStart="false"
            @file-added="onFileAdded"
            @file-success="onFileSuccess"
            @file-progress="onFileProgress"
            @file-error="onFileError"
            class="uploader-app"
        >
            <uploader-unsupport></uploader-unsupport>

            <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>

            <uploader-list v-show="panelShow">
                <div class="file-panel" slot-scope="props" :class="{ collapse: collapse }">
                    <ul class="file-list" ref="uploader-file-list">
                        <li v-for="file in props.fileList" :key="file.id">
                            <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
                        </li>
                        <div class="no-file" v-if="!props.fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
                    </ul>
                </div>
            </uploader-list>
        </uploader>
    </div>
</template>

<script>
import SparkMD5 from 'spark-md5'
import api from '@/common/api'
var loadingFileMap = {}
const statusMap = {
    md5: {
        text: '校验MD5',
        bgc: '#fff'
    },
    merging: {
        text: '合并中',
        bgc: '#e2eeff'
    },
    success: {
        text: '上传成功',
        bgc: '#e2eeff'
    },
    transcoding: {
        text: '转码中',
        bgc: '#e2eeff'
    },
    paused: {
        text: '暂停上传',
        bgc: '#e2eeff'
    },
    failed: {
        text: '上传失败',
        bgc: '#e2eeff'
    },
    upload: {
        text: '上传中...',
        bgc: '#e2eeff'
    }
}
import Const from '@/common/const'
import { Message } from 'element-ui'
export default {
    name: 'upload',
    props: {
        fileExt: Array,
        folderId: String
    },
    data() {
        return {
            options: {
                target: api.getUrl('userFileUpload'),
                chunkSize: '5120000',
                fileParameterName: 'file',
                maxChunkRetries: 3,
                withCredentials: true, //带session
                testChunks: true, //是否开启服务器分片校验
                // 服务器分片校验函数，秒传及断点续传基础
                checkChunkUploadedByResponse: function(chunk, message) {
                    let res = JSON.parse(message)
                    if (!res.status || loadingFileMap[chunk.file.fid]) {
                        return true
                    }
                    return (res.uploaded || []).indexOf(chunk.offset + 1) >= 0
                },
                query() {}
            },
            attrs: {
                accept: this.fileExt
            },
            panelShow: false, //选择文件后，展示上传panel
            collapse: false,
            maxFileSize: 0
        }
    },
    computed: {
        //Uploader实例
        uploader() {
            return this.$refs.uploader.uploader
        }
    },
    mounted() {
        this.$store.dispatch('fileManagement/getUploadFileSize').then(res => {
            if (res.status === Const.STATUS.SUCCESS) {
                this.maxFileSize = res.data.maxFileSize
            } else {
                Message.error({
                    showClose: true,
                    message: res.message
                })
            }
        })
    },
    methods: {
        openUploader() {
            if (this.$refs.uploadBtn) {
                this.$refs.uploadBtn.$el.click()
            }
        },
        onFileAdded(file) {
            this.panelShow = true
            this.statusSet(file.id, 'upload')
            if (file.size < this.maxFileSize) {
                //小于50兆的文件普通上传
                if ((file.size / Math.pow(1024, 2)).toFixed(3) < 50) {
                    this.$emit('smallfileupload', file)
                } else {
                    this.$emit('fileAdded', file)
                    this.computeMD5(file)
                }
            } else {
                Message.error({
                    showClose: true,
                    message: `文件大小不能超过${(this.maxFileSize / Math.pow(1024, 2)).toFixed(0)}MB`
                })
                this.statusSet(file.id, 'failed')
            }
        },
        // eslint-disable-next-line
        onFileProgress(rootFile, file, chunk) {
            //   console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
        },
        // eslint-disable-next-line
        onFileSuccess(rootFile, file, response, chunk) {
            // 分片服务端返回需要合并
            // 如果文件存在 秒传
            if (loadingFileMap[chunk.file.fid]) {
                this.statusSet(file.id, 'success')
                return this.$emit('fileSuccess', file)
            }
            this.statusSet(file.id, 'merging')
            let param = {
                ext: file.fileType,
                fid: file.fid,
                categoryId: this.folderId,
                md5: file.md5,
                identifier: file.uniqueIdentifier,
                fileName: file.name
            }
            this.$store
                .dispatch('fileUploadUser/mergeFile', param)
                .then(res => {
                    if (res.status) {
                        this.$emit('fileSuccess', file)
                        this.statusSet(file.id, 'success')
                    } else {
                        this.$emit('fileSuccess', file)
                        this.statusSet(file.id, 'failed')
                        this.$message({
                            message: res.message,
                            type: 'error'
                        })
                    }
                })
                .catch(() => {
                    this.statusSet(file.id, 'failed')
                })
        },
        // eslint-disable-next-line
        onFileError(rootFile, file, response, chunk) {
            this.statusSet(file.id, 'failed')
            this.$message({
                message: response,
                type: 'error'
            })
        },

        /**
         * 计算md5，实现断点续传及秒传
         * @param file
         */
        computeMD5(file) {
            let fileReader = new FileReader()
            //   let time = new Date().getTime()
            let md5 = ''

            file.pause()
            //开始计算md5
            this.statusSet(file.id, 'md5')
            //保护
            this.protectComputeMd5(file.id, true)
            let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                chunkSize = 102400000, // 以每片100MB大小来逐次读取
                chunks = Math.ceil(file.size / chunkSize),
                currentChunk = 0,
                spark = new SparkMD5() //创建SparkMD5的实例

            loadNext()
            fileReader.onload = e => {
                spark.appendBinary(e.target.result)
                currentChunk += 1
                if (currentChunk < chunks) {
                    loadNext()
                } else {
                    md5 = spark.end()
                    let param = {
                        fileName: file.name,
                        md5: md5,
                        totalSize: file.size,
                        fileType: file.fileType,
                        categoryId: this.folderId
                    }
                    this.$store.dispatch('fileUploadUser/checkFile', param).then(res => {
                        // alert(1)
                        // this.statusSet(file.id, 'paused')
                        // //取消保护md5
                        // this.protectComputeMd5(file.id, false)
                        file.md5 = md5
                        // // 添加额外的参数
                        this.uploader.opts.query = {
                            md5: md5
                        }
                        if (!res.status) {
                            //秒传
                            loadingFileMap[res.data] = true
                            this.statusSet(file.id, 'success')
                        } else {
                            file.fid = res.data
                            file.resume()
                        }
                        // alert(5)
                    })
                }
            }
            function loadNext() {
                let start = currentChunk * chunkSize,
                    end = start + chunkSize >= file.size ? file.size : start + chunkSize
                //   debugger
                fileReader.readAsBinaryString(blobSlice.call(file.file, start, end))
            }

            fileReader.onerror = function() {
                this.error('FileReader onerror was triggered, maybe the browser aborted due to high memory usage.')
            }
        },

        /**
         * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
         * @param id
         * @param status
         */
        statusSet(id, status) {
            this.$nextTick(() => {
                let _tag = this.$refs['uploader-file-list']
                    .getElementsByClassName('file_' + id)[0]
                    .getElementsByClassName('uploader-file-status')[0]
                    .getElementsByTagName('span')[0]
                _tag.innerText = statusMap[status].text
            })
        },
        // 保护md5计算
        protectComputeMd5(id, status) {
            this.$nextTick(() => {
                let _tag = this.$refs['uploader-file-list'].getElementsByClassName('file_' + id)[0]
                if (status) {
                    _tag.setAttribute('status', 'protect')
                } else {
                    _tag.setAttribute('status', 'paused')
                }
            })
        }
    },
    watch: {},
    destroyed() {
        this.$off('openUploader')
    }
}
</script>
<style>
.uploader-list {
    margin-top: 10px;
}
ul li {
    list-style: none;
}
.uploader-file-actions {
    display: none;
}
.uploader-file-icon:before {
    content: '' !important;
}
.uploader-file-icon[icon='document']:before {
    content: '' !important;
}
.uploader-file-icon {
    background: url('../assets/img/file.png') no-repeat center center;
    background-size: 100%;
}
.uploader-file-icon[icon='document'] {
    background: url('../assets/img/doc.png') no-repeat center center;
    background-size: 100%;
}
.uploader-file-icon[icon='video'] {
    background: url('../assets/img/video.png') no-repeat center center;
    background-size: 100%;
}
.uploader-file-icon[icon='audio'] {
    background: url('../assets/img/audio.png') no-repeat center center;
    background-size: 100%;
}
.uploader-file-icon[icon='image'] {
    background: url('../assets/img/image.png') no-repeat center center;
    background-size: 100%;
}
</style>
