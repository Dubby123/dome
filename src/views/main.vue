<template>
    <el-container class="main-container">
        <Navigator :navList="nav" />
        <el-container>
            <el-header>
                <Header />
                <Tabs :activeName="activeName" ref="tab" />
            </el-header>
            <el-main>
                <router-view />
            </el-main>
            <Footer />
        </el-container>
    </el-container>
</template>
<script>
import Navigator from './layout/navigator.vue'
import Tabs from './layout/tabs.vue'
import Header from './layout/header.vue'
import Footer from './layout/footer.vue'
import { mapGetters } from 'vuex'
import BusinessUtil from '@/common/businessUtils'
import Watermark from '@/common/watermark'
// import Data from '@/common/const'
export default {
    name: 'Main',
    components: {
        Navigator,
        Tabs,
        Header,
        Footer
    },
    data() {
        return {
            activeName: 'home'
            // navList: Data.NAV_LIST_SOFTWARE
        }
    },
    computed: {
        ...mapGetters('authConfig', {
            nav: 'getNavList'
        })
    },
    mounted() {
        //Watermark.set('我是水印')
        this.$store.dispatch('authConfig/getAuthMenu').then(res => BusinessUtil.CallbackHandler(res))
        this.$store.dispatch('authConfig/getWatermark').then(res =>
            BusinessUtil.CallbackHandler(res).then(() => {
                Watermark.set(
                    res.data.content,
                    res.data.fontSize,
                    res.data.fontFamily,
                    res.data.color,
                    res.data.rotate,
                    res.data.transparent,
                    res.data.displaySpaceX,
                    res.data.displaySpaceY
                )
            })
        )
    },
    // 在当前路由改变，组件被复用时调用
    beforeRouteUpdate(to, from, next) {
        this.$store.commit('authConfig/addTabsList', to)
        this.activeName = to.name
        next()
    }
}
</script>
<style lang="scss">
@import '../assets/css/common.scss';
@import '../assets/css/tableComps.scss';
@import '../assets/css/button.scss';
@import '../assets/css/tree.scss';
@import '../assets/css/inputNumber.css';
@import '../assets/css/monitor.css';
@import '../assets/css/iconfont/iconfont.css';
.main-container > .el-container > .el-main {
    background: url('../assets/img/mask-bg.png') no-repeat bottom left;
}
// session过期时重叠在一起
.el-message {
    top: 20px !important;
    z-index: 1000000000 !important;
}
</style>
