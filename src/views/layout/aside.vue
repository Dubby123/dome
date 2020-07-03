<template>
    <el-aside class="tree_aside">
        <!-- 编辑、修改、删除按钮 -->
        <div class="table_btns" v-if="button ? button : false">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createHandler" plain title="新增"></el-button>
            <el-button type="primary" icon="el-icon-edit" @click="modifyHandler" plain title="修改"></el-button>
            <el-button type="primary" icon="el-icon-delete" @click="deleteHandler" plain title="删除"></el-button>
        </div>
        <el-container class="filter_box" v-show="filter">
            <el-input v-if="filter" placeholder="输入关键字进行过滤" suffix-icon="el-icon-search" v-model="filterText" size="small"></el-input>
        </el-container>
        <div class="tree_box">
            <div class="name-box" v-show="listName !== undefined">{{ listName }}</div>
            <div class="name-box title-box" v-show="titleName !== undefined" @click="searchDocHandler" id="myfilelist">{{ titleName }}</div>

            <el-tree
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
                :default-expand-all="expanded"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <i v-if="sign && !data.flag" class="icon-warn"></i>
                    <span :title="data.name" :class="{ signed: sign && !data.flag }">{{ node.label }}</span>
                </span>
            </el-tree>
            <div class="name-box title-box" v-show="otherTitleName !== undefined" @click="searchShareHandler" id="myshare">{{ otherTitleName }}</div>
        </div>
    </el-aside>
</template>
<script>
export default {
    name: 'Aside',
    props: {
        tree: Array,
        filter: Boolean,
        listName: String,
        isCheckbox: Boolean,
        strictly: Boolean,
        defaultCheckedKeys: Array,
        expandedKeys: Array,
        references: String,
        currentKey: String,
        prop: Object,
        nodeKey: String,
        sign: Boolean,
        loadTree: Function,
        isLazy: Boolean,
        button: Boolean,
        otherTitleName: String,
        titleName: String,
        expanded: Boolean
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
        }
    },
    methods: {
        handleNodeClick(data, node) {
            this.$emit('chooseNode', data, node)
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
<style lang="scss"></style>
