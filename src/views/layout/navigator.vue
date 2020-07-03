<template>
    <div class="navigator-container" ref="navigator">
        <el-menu
            ref="menu"
            class="el-menu-vertical"
            :default-active="this.$route.path"
            :collapse="isCollapse"
            background-color="#344f85"
            text-color="rgba(255,255,255,0.85)"
            active-text-color="#fff"
            router
        >
            <el-menu-item-group class="navigator_header">
                <template v-if="isCollapse" slot="title">
                    <img src="../../assets/img/logo-s.png" alt="logo" />
                </template>
                <template v-else slot="title">
                    <img src="../../assets/img/logo.png" alt="logo" />
                </template>
            </el-menu-item-group>
            <template v-for="(item, index) in navList">
                <el-menu-item v-if="!item.childList || item.childList.length <= 0" :index="item.context" :key="index">
                    <i :class="'icon icon-' + item.icon"></i>
                    <span slot="title">{{ item.name }}</span>
                </el-menu-item>
                <el-submenu :index="item.context" :key="index" v-else>
                    <template slot="title">
                        <i :class="'icon icon-' + item.icon"></i><span slot="title">{{ item.name }}</span>
                    </template>
                    <template v-for="(item, index) in item.childList">
                        <el-menu-item v-if="!item.childList || item.childList.length <= 0" :index="item.context" :key="index" v-html="item.name"> </el-menu-item>
                        <el-submenu :index="item.context" :key="index" v-else>
                            <template slot="title">{{ item.name }}</template>
                            <template v-for="(item, index) in item.childList">
                                <el-menu-item :index="item.context" :key="index" v-html="item.name"></el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                </el-submenu>
            </template>
        </el-menu>
        <el-button class="collapse" @click="collapseHandler" round plain> <i class="icon" :class="{ icon_collapse: isCollapse, icon_expand: !isCollapse }"></i> </el-button>
    </div>
</template>

<script>
import { mapState } from 'vuex'
//import Data from '@/common/const'
export default {
    name: 'Navigator',
    props: {
        navList: Array
    },
    created() {},
    mounted() {
        if (this.isCollapse) {
            this.__toggleClass(document.getElementById('body'), 'collapseMenu')
        }
    },
    data() {
        return {
            // navList: Data.NAV_LIST_SOFTWARE,
            collapseClass: this.isCollapse ? 'icon-collapse' : 'icon-expand'
        }
    },
    computed: {
        ...mapState('navigator', ['isCollapse'])
    },
    methods: {
        /**
         * 导航栏收缩按钮事件
         */
        collapseHandler() {
            let className = !this.isCollapse ? 'collapseMenu' : ''
            this.__toggleClass(document.getElementById('body'), className)
            this.$store.commit('navigator/setIsCollapse', !this.isCollapse)
        },
        /**
         * 私有方法：切换导航栏是否收缩的样式
         * @param {document} ele  样式绑定的dom元素
         * @param {String} className  样式class名称
         */
        __toggleClass(ele, className) {
            ele && (ele.className = className)
        }
    }
}
</script>
<style lang="scss" scopedSlots>
.navigator-container {
    min-width: 208px;
    height: 100%;
    background-color: #344f85;
    float: left;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 8000;
}
.navigator_header {
    background-color: #293e69;
    height: 56px;
}
.el-menu-vertical {
    float: left;
    border-right: none;
    &.el-menu--collapse {
        width: 50px;
        .el-menu-item-group__title {
            padding: 17px 12px 13px 12px !important;
            img {
                width: 28px;
            }
        }
        .el-menu-item {
            .el-tooltip {
                padding: 0 15px 0 10px !important;
            }
        }
        .el-submenu .el-submenu__title {
            padding: 0 15px 0 10px !important;
        }
        .icon {
            margin-right: 0;
        }
    }
    .el-menu-item-group__title {
        padding: 18px 34px 13px 24px !important;
        img {
            width: 150px;
        }
    }
    .el-menu-item {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        padding: 0 20px 0 15px !important;
        border-left: 5px solid transparent;
        &.is-active {
            font-weight: bold;
            background-color: rgba(2255, 255, 255, 0.2) !important;
            border-left: 5px solid #fff;
        }
    }
    .el-submenu {
        .el-submenu__title {
            height: 40px;
            line-height: 40px;
            font-size: 12px;
            padding: 0 20px 0 15px !important;
            border-left: 5px solid transparent;
            &.is-active {
                font-weight: bold;
            }
            i {
                color: #fff;
            }
        }
        &.is-active .el-submenu__title {
            font-weight: bold;
            color: #fff;
        }
        .el-menu-item {
            padding-left: 40px !important;
        }
        .el-submenu {
            .el-submenu__title {
                padding-left: 40px !important;
            }
            .el-menu-item {
                padding-left: 65px !important;
            }
        }
    }
}

.el-menu--vertical {
    .el-menu--popup {
        .el-menu-item {
            height: 40px;
            line-height: 40px;
            font-size: 12px;
        }
    }
}

.el-button.collapse {
    width: 36px;
    height: 36px;
    padding: 0;
    position: absolute;
    left: 228px;
    top: 10px;
}
.collapseMenu {
    .el-button.collapse {
        left: 70px;
    }
    .navigator-container {
        min-width: 44px;
    }
}
.icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url('../../assets/img/icon-navigator.png') no-repeat center center;
    vertical-align: middle;
    margin-right: 10px;
    &.icon-home {
        background-position: 0px 0px;
    }
    &.icon-user {
        background-position: 0px -40px;
    }
    &.icon-auth {
        background-position: 0px -82px;
    }
    &.icon-message {
        background-position: 0px -122px;
    }
    &.icon-file {
        background-position: 0px -164px;
    }
    &.icon-process {
        background-position: 0px -202px;
    }
    &.icon-watermark {
        background-position: 0px -244px;
    }
    &.icon-log {
        background-position: 0px -290px;
    }
    &.icon-store {
        background-position: 0px -332px;
    }
    &.icon-gateway {
        background-position: 0px -374px;
    }
    &.icon-port {
        background-position: 0px -415px;
    }
    &.icon-software {
        // background-position: 0px -415px;
        background: url('../../assets/img/icon-software.png') no-repeat center center;
    }
    &.icon_collapse {
        background-position: -42px -0px;
        margin-right: 0px;
    }
    &.icon_expand {
        background-position: -78px -0px;
        margin-right: 0px;
    }
}
</style>
