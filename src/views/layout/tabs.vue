<template>
    <div class="tabs_container">
        <el-tabs v-model="tabsValue" type="border-card" closable @tab-remove="handleTabsRemove" @tab-click="handleTabsClick">
            <el-tab-pane :key="item.name" v-for="item in tabsList" :label="item.showValue" :name="item.name"> </el-tab-pane>
        </el-tabs>
        <el-dropdown @command="handleCommand">
            <el-button size="large" icon="el-icon-caret-bottom" plain></el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="refresh">刷新</el-dropdown-item>
                <el-dropdown-item command="closeOthers">关闭其他</el-dropdown-item>
                <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import Utils from '@/common/utils'
const HOME_NAME = 'directory'
export default {
    name: 'tabs',
    props: {
        activeName: String
    },
    data() {
        return {
            tabsValue: ''
        }
    },
    computed: {
        ...mapGetters('authConfig', {
            tabsList: 'getTabsList'
        })
    },
    mounted() {
        this.tabsValue = this.$route.name
        this.$store.commit('authConfig/addTabsList', this.$route)
    },
    watch: {
        activeName: {
            handler: function(val) {
                this.tabsValue = val
            }
        }
    },
    methods: {
        //点击tab页响应事件
        handleTabsClick(val) {
            if (this.$route.name === val.name) {
                return
            }
            if (val.name === 'applyDownload') {
                let pushRouter = this.tabsList.filter(ele => {
                    return ele.name === 'applyDownload'
                })
                this.$router.push({ name: val.name, query: pushRouter[0].query })
            } else if (val.name === 'fileShare') {
                let pushRouter = this.tabsList.filter(ele => {
                    return ele.name === 'fileShare'
                })
                this.$router.push({ name: val.name, query: pushRouter[0].query })
            } else {
                this.$router.push({ name: val.name })
            }
        },
        //删除tab标签页，最后首页不允许删除
        handleTabsRemove(val) {
            if (this.tabsList.length <= 1) {
                return Message.warning({
                    showClose: true,
                    message: '最后一项tab页暂时不可关闭'
                })
            }
            let removeIndex
            let newList = this.tabsList.filter((ele, index) => {
                ele.name === val && ele.name === this.tabsValue ? (removeIndex = index) : ''
                return ele.name !== val
            })
            this.$store.commit('authConfig/resetTabsList', newList)
            if (removeIndex) {
                this.tabsValue = this.tabsList[removeIndex - 1].name
                this.$router.push({ name: this.tabsValue })
            }
        },
        //下拉框按钮响应事件
        handleCommand(command) {
            if (!Utils.isString(command)) {
                return
            }
            switch (command) {
                case 'refresh': {
                    this.$router.go(0)
                    break
                }
                case 'closeOthers': {
                    this.handleCloseTabs(this.tabsValue)
                    break
                }
                case 'closeAll': {
                    this.handleCloseTabs(HOME_NAME)
                    this.$router.push({ name: HOME_NAME })
                    break
                }
            }
        },
        //批量关闭tabs页
        handleCloseTabs(name) {
            if (this.tabsList.length <= 1) {
                return
            }
            let newList = this.tabsList.filter(ele => {
                return ele.name === name
            })
            if (name !== HOME_NAME) {
                newList.unshift(this.tabsList[0])
            }
            this.$store.commit('authConfig/resetTabsList', newList)
        }
    }
}
</script>
