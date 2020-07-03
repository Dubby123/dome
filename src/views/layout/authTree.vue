<template>
    <el-aside class="tree-aside">
        <el-container class="filter-box" v-show="filter">
            <el-form :inline="true" class="search_form" size="small" label-width="100px">
                <el-form-item :label="labelName ? labelName : '名称'">
                    <el-input v-if="filter" placeholder="输入关键字查找" v-model="filterText" clearable></el-input>
                </el-form-item>
            </el-form>
        </el-container>
        <el-tree
            :data="tree"
            :props="prop ? prop : defaultProps"
            node-key="id"
            ref="tree"
            default-expand-all
            :expand-on-click-node="false"
            :show-checkbox="isCheckbox"
            @check="handleCheckChange"
            @check-change="change"
            :check-strictly="strictly"
            :filter-node-method="filterNode"
            :class="filter ? 'filter-tree' : ''"
        ></el-tree>
    </el-aside>
</template>
<script>
export default {
    name: 'AuthTree',
    props: {
        filter: Boolean,
        tree: Array,
        isCheckbox: Boolean,
        strictly: Boolean,
        prop: Object,
        labelName: String
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
        handleCheckChange(data, currentChecked) {
            this.$emit('chooseCheck', data, currentChecked)
        },
        change(data, checked) {
            this.$emit('change', data, checked)
        },
        setCheckedKeys(auth) {
            this.$refs.tree.setCheckedKeys(auth)
        },
        filterTree(text) {
            this.$refs.tree.filter(text)
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        setChecked(id, checked, deep) {
            this.$refs.tree.setChecked(id, checked, deep)
        },
        getNode(id) {
            return this.$refs.tree.getNode(id)
        }
    }
}
</script>
<style scopedSlots>
.tree-aside {
    /* min-height: 800px; */
    /* flex: 0 0 20%; */
    /* flex: 1; */
    min-width: 350px;
    border-right: 1px solid #e6e6e6;
    background-color: #fff;
    overflow: auto;
}
.tree-aside .filter-box {
    margin-bottom: 14px;
    flex: none !important;
}
.tree-aside > .el-tree > .el-tree-node:first-child {
    border-top: 1px solid #e6e6e6;
    border-left: 1px solid #e6e6e6;
}
.tree-aside .el-tree-node__content:hover,
.tree-aside .el-tree-node.is-current > .el-tree-node__content,
.el-tree-node:focus > .el-tree-node__content {
    background-color: #2483ff;
    color: #fff;
}
.tree-aside .el-tree-node__content {
    height: 33px;
    border-bottom: 1px solid #e6e6e6;
}

@media screen and (max-width: 1600px) {
    .tree-aside {
        min-width: 295px;
    }
}
</style>
