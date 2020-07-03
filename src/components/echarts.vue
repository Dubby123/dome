<template>
    <div :id="id" style="width: 100%;height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: ['options', 'id', 'zxc'],
    data() {
        return {
            chart: '',
            bol: true
        }
    },
    mounted() {
        this.init()
        window.addEventListener('resize', this.chart.resize)
    },
    watch: {
        options: {
            handler(newVal, oldVal) {
                this.chart.resize()
                if (this.chart) {
                    if (newVal) {
                        this.chart.setOption(newVal, true)
                    } else {
                        this.chart.setOption(oldVal, true)
                    }
                } else {
                    this.init()
                }
            },
            deep: true //对象内部属性的监听
        }
    },
    methods: {
        init() {
            window.addEventListener('resize', this.chart.resize)
            this.chart = echarts.init(document.getElementById(this.id))
            // this.chart.showLoading();
            this.chart.setOption(this.options, true)
        }
    }
}
</script>
