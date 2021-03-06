<template>
    <el-aside class="tree_aside">
        <!-- 编辑、修改、删除按钮 -->
        <div class="table_btns" v-if="button ? button : false">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createHandler" plain title="新增我的空间目录"></el-button>
            <el-button type="primary" icon="el-icon-edit" @click="modifyHandler" plain title="修改我的空间目录"></el-button>
            <el-button type="primary" icon="el-icon-delete" @click="deleteHandler" plain title="删除我的空间目录"></el-button>
        </div>
        <el-container class="filter_box" v-show="filter">
            <el-input v-if="filter" placeholder="输入关键字进行过滤" suffix-icon="el-icon-search" v-model="filterText" size="small"></el-input>
        </el-container>
        <div class="tree_box">
            <div class="name-box" v-show="listName !== undefined">{{ listName }}</div>
            <div class="name-box title-box" v-show="titleName !== undefined" @click="searchDocHandler" id="myfilelist">{{ titleName }}</div>

            <el-tree
                class="directory_tree"
                :data="tree"
                :props="prop ? prop : defaultProps"
                :node-key="nodeKey ? nodeKey : 'id'"
                @node-click="handleNodeClick"
                ref="tree"
                highlight-current
                :lazy="isLazy ? isLazy : false"
                :load="isLazy ? loadTree : null"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :class="filter ? 'filter-tree' : ''"
                :show-checkbox="isCheckbox"
                @check="handleCheck"
                @check-change="handleCheckChange"
                :check-strictly="strictly"
                :default-checked-keys="defaultCheckedKeys"
                :default-expanded-keys="expandedKeys"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <i v-if="sign && !data.flag" class="icon-warn"></i>
                    <span :title="data.name" :class="{ signed: sign && !data.flag }">{{ node.label }}</span>
                </span>
            </el-tree>
            <el-tree
                :data="tree2"
                :props="prop ? prop : defaultProps"
                :node-key="nodeKey ? nodeKey : 'id'"
                @node-click="handleNode2Click"
                ref="tree2"
                highlight-current
                :lazy="isLazy ? isLazy : false"
                :load="isLazy ? loadTree : null"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :class="filter ? 'filter-tree' : ''"
                :show-checkbox="isCheckbox"
                @check="handleCheck"
                @check-change="handleCheckChange"
                :check-strictly="strictly"
                :default-checked-keys="defaultCheckedKeys"
                :default-expanded-keys="expandedKeysTree2"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span :title="data.name" :class="{ signed: sign && !data.flag }" v-if="!data.isEdit">{{ node.label }}</span>
                    <el-input size="mini" autofocus v-model="data.name" v-else @blur="setNewChild(data)" maxlength="50" @input="inputChange(data.name)" id="edit_input"></el-input>
                </span>
            </el-tree>
            <div class="name-box title-box" v-show="otherTitleName !== undefined" @click="searchShareHandler" id="myshare">{{ otherTitleName }}</div>
        </div>
    </el-aside>
</template>
<script>
import { Message } from 'element-ui'
export default {
    name: 'Aside',
    props: {
        tree: Array,
        tree2: Array,
        filter: Boolean,
        listName: String,
        isCheckbox: Boolean,
        strictly: Boolean,
        defaultCheckedKeys: Array,
        expandedKeys: Array,
        expandedKeysTree2: Array,
        references: String,
        currentKey: String,
        prop: Object,
        nodeKey: String,
        sign: Boolean,
        loadTree: Function,
        isLazy: Boolean,
        button: Boolean,
        otherTitleName: String,
        titleName: String
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            filterText: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
            this.$refs.tree2.filter(val)
        }
    },
    methods: {
        handleNodeClick(data, node) {
            this.$emit('chooseNode', data, node)
        },
        handleNode2Click(data, node) {
            this.$emit('chooseNode2', data, node)
        },
        handleCheckChange(data, checked, indeterminate) {
            this.$emit('chooseCheck', data, checked, indeterminate)
        },
        handleCheck(data, checked) {
            this.$emit('check', data, checked)
        },
        filterNode(value, data) {
            if (!value) return true
            return data[this.$refs.tree.props.label].indexOf(value) !== -1
        },
        filterTree(text) {
            this.$refs.tree.filter(text)
        },
        setCurrentKey(id) {
            this.$refs.tree.setCurrentKey(id)
        },
        setCheckedKeys(ids) {
            this.$refs.tree.setCheckedKeys(ids)
        },
        setChecked(key, selected, isSetChild) {
            this.$refs.tree.setChecked(key, selected, isSetChild)
        },
        getCheckedNodes() {
            return this.$refs.tree.getCheckedNodes()
        },
        getNode(id) {
            return this.$refs.tree.getNode(id)
        },
        getCurrentNode() {
            this.$refs.tree.getCurrentNode()
        },
        getCurrentKey() {
            this.$refs.tree.getCurrentKey()
        },
        createHandler() {
            this.$emit('buttonEvent', 'createHandler')
        },
        modifyHandler() {
            this.$emit('buttonEvent', 'modifyHandler')
        },
        setNewChild(data) {
            data.isEdit = false
            this.$emit('onBlur', data)
        },
        inputChange(val) {
            if (val.length === 49) {
                Message.warning({
                    message: '目录长度最大不能超过50个字符',
                    showClose: true
                })
            }
        },
        deleteHandler() {
            this.$emit('buttonEvent', 'deleteHandler')
        },
        searchDocHandler() {
            this.$emit('searchEvent', 'searchDocHandler')
        },
        searchShareHandler() {
            this.$emit('searchEvent', 'searchShareHandler')
        }
    }
}
</script>
<style lang="scss">
.directory_tree .custom-tree-node {
    display: inline-block;
    width: auto !important;
    font-size: 14px;
    overflow: visible !important;
    text-overflow: clip !important;
}
.directory_tree .el-tree-node > .el-tree-node__children {
    overflow: visible !important;
}
.directory_tree .el-tree-node__content {
    display: inline-block !important;
    overflow: visible !important;
    min-width: 100% !important;
    line-height: 32px;
}
.directory_tree .el-tree-node__children {
    overflow: visible !important;
}
</style>
