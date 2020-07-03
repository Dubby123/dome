<template>
    <el-footer>Copyright © 2003-{{ currentYear }}浙江浙大中控信息技术有限公司</el-footer>
</template>
<script>
import api from '@/common/api'
import Utils from '@/common/utils'
import Vue from 'vue'
export default {
    name: 'Footer',
    data() {
        return {
            open: false,
            currentYear: new Date().getFullYear()
        }
    },
    mounted() {
        if (typeof WebSocket == 'undefined') {
            return new Error('不支持WebSocket')
        }
        let ws = api.getUrl('websocket')
        ws = ws.replace(/http/gi, 'ws')
        if (!Vue.prototype._socket || Vue.prototype._socket === '') {
            Vue.prototype._socket = new WebSocket(ws)
            Vue.prototype._socket.onopen = () => (this.open = true)
            Vue.prototype._socket.onmessage = e => {
                if (Utils.objectUtils.isNull(e.data)) {
                    return
                }
                this.sendMessage(event, e.data)
            }
        }
    },
    methods: {
        /**
         * websocket 长连接从后台发送的站内消息
         * @param e event
         * @param data 数据
         */
        sendMessage(e, data) {
            data = JSON.parse(data)
            this.$notify({
                title: data.title,
                message: data.content,
                position: 'bottom-right'
            })
        }
    }
}
</script>
<style>
.el-footer {
    width: 100%;
    height: 24px !important;
    line-height: 24px;
    font-family: '微软雅黑';
    text-align: center;
    font-size: 12px;
    background-color: transparent;
    color: #a3afb7;
}
</style>
