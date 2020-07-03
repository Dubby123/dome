<template
    ><el-container class="main_body directory_auth">
        <AsideTree
            ref="directoryTree"
            :tree="directoryTree"
            :filter="true"
            :button="true"
            v-on:chooseNode="chooseNode"
            v-on:buttonEvent="buttonEvent"
            v-on:onBlur="onEditBlur"
            :expandedKeys="expandedKeys"
            :directoryAuthList="directoryAuthList"
        />
        <el-container>
            <el-header class="search_form doc_file_box">
                <el-form :inline="true" size="small" label-width="80px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="权限类型">
                                <el-input v-model="authType" placeholder="输入关键字查找" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="权限关联">
                                <el-input v-model="authRelevance" placeholder="输入关键字查找" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" @click="searchHandler">查询</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-header>
            <el-main class="main_table">
                <el-container class="table_box">
                    <el-header class="table_header">
                        <span class="table_title">权限列表</span>
                        <div class="table_btns">
                            <el-button type="primary" @click="addOperate('role')" plain v-if="directoryAuthList.indexOf(0) !== -1">
                                <span class="iconfont icon-tianjiarenyuan"></span> 添加角色
                            </el-button>
                            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addOperate('department')" plain v-if="directoryAuthList.indexOf(0) !== -1">
                                添加部门
                            </el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="deleteHandler" plain v-if="directoryAuthList.indexOf(0) !== -1">
                                删除
                            </el-button>
                        </div>
                    </el-header>

                    <el-main class="table_content">
                        <el-table size="small" stripe height="100%" :data="editOprateObj" @selection-change="handleSelectionChange" ref="multipleTable">
                            <el-table-column type="selection" width="65" align="left"></el-table-column>
                            <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                            <el-table-column prop="authType" label="权限类型" min-width="15%" show-overflow-tooltip align="left"></el-table-column>
                            <el-table-column label="权限关联" min-width="15%" show-overflow-tooltip align="left">
                                <template slot-scope="scope">
                                    <div class="auth_table_td">
                                        <div class="auth_table_content">{{ editOprateObj[scope.$index].groupName }}</div>
                                        <el-button
                                            class="auth_table_button"
                                            type="text"
                                            icon="el-icon-edit"
                                            @click="editGroup(scope.$index)"
                                            v-if="editOprateObj[scope.$index].edit"
                                        ></el-button>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作权限" min-width="50%" show-overflow-tooltip align="left">
                                <template slot-scope="scope">
                                    <div class="auth_table_td">
                                        <div class="auth_table_content">
                                            <span v-for="(item, index) in editOprateObj[scope.$index].operateNameList" :key="index" class="oprate_auth">{{ item }}</span>
                                        </div>
                                        <el-button
                                            class="auth_table_button"
                                            type="text"
                                            icon="el-icon-edit"
                                            @click="editOperate(scope.$index)"
                                            v-if="editOprateObj[scope.$index].edit"
                                        ></el-button>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="10%" show-overflow-tooltip align="center">
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        icon="el-icon-edit"
                                        @click="editHandler(scope.$index)"
                                        v-if="editOprateObj[scope.$index].type === 'get' && editOprateObj[scope.$index].hasOperate"
                                    ></el-button>
                                    <el-button type="text" @click="saveOperate(scope.$index)" v-if="editOprateObj[scope.$index].type === 'edit'"
                                        ><span class="iconfont icon-baocun"></span
                                    ></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </el-main>
        </el-container>
        <el-dialog width="650px" :title="innerOperateTitle" :visible.sync="innerOperateVisible">
            <template>
                <el-main>
                    <el-checkbox-group v-model="currentOperateList" size="mini">
                        <el-checkbox border v-for="item in operateList" :key="item.id" :label="item.id" :value="item.id">{{ item.value }} </el-checkbox>
                    </el-checkbox-group></el-main
                >
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelOperateDialog">取消</el-button>
                <el-button type="primary" @click="chooseOperateDialog">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog width="650px" :title="innerDialogTitle" :visible.sync="innerDialogVisible">
            <template>
                <el-form :inline="true" class="search_form depart" size="small" label-width="100px">
                    <el-row>
                        <el-col :span="21">
                            <el-form-item :label="roleOrDepartmentTitle">
                                <el-input v-model="roleOrDepartmentName" placeholder="输入关键字查找"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="primary" @click="roleOrDepartmentSearch">查询</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <Tree
                    ref="innerTree"
                    style="height: 300px"
                    :tree="rolePositionListTree"
                    :filter="false"
                    :isCheckbox="true"
                    :strictly="true"
                    v-on:chooseCheck="chooseCheck"
                    :expanded="true"
                />
                <el-form :inline="true" class="search_form auth_name" size="small" label-width="100px">
                    <el-form-item label="权限关联名称">
                        <el-input v-model="authName" placeholder="请输入权限关联名称"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInnerDialog">取消</el-button>
                <el-button type="primary" @click="chooseInnerDialog">确认</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
import { mapGetters } from 'vuex'
import Utils from '@/common/utils'
import Tree from '../layout/aside.vue'
import AsideTree from '../layout/editAsideTree.vue'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
// import api from '@/common/api'
import { Message, MessageBox } from 'element-ui'
export default {
    name: 'directory',
    components: { AsideTree, Tree },
    data() {
        return {
            roleOrDepartmentName: '',
            roleOrDepartmentTitle: '',
            expandedKeys: [],
            authType: '',
            authRelevance: '',
            multipleSelection: [],
            currentDirectory: '',
            directoryTree: [],
            treeEditType: '',
            editOprateObj: [],
            innerDialogTitle: '',
            innerOperateTitle: '',
            innerDialogVisible: false,
            innerOperateVisible: false,
            rolePositionListTree: [],
            authName: '',
            currentNodeIds: [],
            operateList: [],
            currentOperateList: [],
            index: ''
        }
    },
    computed: {
        ...mapGetters('directory', {
            currentNodeId: 'getCurrentNodeId',
            directoryAuthList: 'getDirectoryAuthList'
        }),
        ...mapGetters('auth', {
            authGroupsList: 'getAuthGroupsList',
            roleTree: 'getRoleTree',
            positionTree: 'getPositionTree'
        })
    },
    mounted() {
        this.getDirectoryTree()
        this.getRoleTree()
        this.getPositionTree()
    },
    //如果数据没有保存，在离开该页面时给与提示
    beforeRouteLeave(to, from, next) {
        var confirmFlag = false
        this.editOprateObj.forEach(item => {
            if (item.edit) {
                confirmFlag = true
            }
        })
        if (confirmFlag) {
            MessageBox.confirm('您的数据还未保存，确定要离开该页面吗？', '确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    next()
                })
                .catch(e => console.log(e))
        } else {
            next()
        }
    },
    watch: {},
    methods: {
        //获取公共目录结构树
        async getDirectoryTree() {
            await this.$store.dispatch('auth/getDirectoryTree').then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    this.directoryTree = BusinessUtil.ObjectClone(res.data)
                    if (Utils.isString(this.currentNodeId)) {
                        this.$nextTick(() => {
                            this.$refs.directoryTree.setCurrentKey(this.currentNodeId)
                            this.expandedKeys.push(this.currentNodeId)
                            this.currentDirectory = this.$refs.directoryTree.getCurrentNode()
                            this.getDirectoryAuth()
                            this.getAuthGroups()
                        })
                    } else {
                        this.$nextTick(() => {
                            this.$refs.directoryTree.setCurrentKey(res.data[0].id)
                            this.expandedKeys.push(res.data[0].id)
                            this.currentDirectory = this.$refs.directoryTree.getCurrentNode()
                            this.getDirectoryAuth()
                            this.getAuthGroups()
                        })
                    }
                })
            })
        },
        //获取当前用户给指定目录设置的部门角色权限
        getAuthGroups() {
            this.$store.dispatch('auth/getAuthGroups', { categoryId: encodeURI(this.currentDirectory.id) }).then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    this.editOprateObj = BusinessUtil.ObjectClone(this.authGroupsList)
                })
            })
        },
        //获取当前用户在指定目录被授予的全部操作权限
        getDirectoryAuth() {
            this.$store.dispatch('directory/getDirectoryAuth', { categoryId: encodeURI(this.currentDirectory.id) }).then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    this.operateList = []
                    this.directoryAuthList.forEach(item => {
                        this.operateList.push(Const.OPERATELIST[item])
                    })
                })
            })
        },
        //左侧树点击事件
        chooseNode(data) {
            if (data.id) {
                this.currentDirectory = JSON.parse(JSON.stringify(data))
            }
            this.currentDirectory = JSON.parse(JSON.stringify(data))
            if (this.treeEditType !== 'add') {
                this.$store.commit('directory/setCurrentNodeId', this.currentDirectory.id)
                this.getDirectoryAuth()
                this.getAuthGroups()
            }
        },
        //取消操作选取框
        cancelOperateDialog() {
            this.currentOperateList = []
            this.innerOperateVisible = false
        },
        //确认操作选取框
        chooseOperateDialog() {
            if (this.currentOperateList.length === 0) {
                return Message.warning({
                    message: '请至少选择一个操作权限',
                    showClose: true
                })
            }
            if (this.innerOperateTitle === '添加权限操作') {
                this.addOperateCommit()
            } else {
                this.editOprateObj[this.index].operateIdList = this.currentOperateList
                this.editOprateObj[this.index].operateList = []
                this.editOprateObj[this.index].operateNameList = []
                this.currentOperateList.forEach(item => {
                    this.editOprateObj[this.index].operateList.push(Const.OPERATELIST[item])
                    this.editOprateObj[this.index].operateNameList.push(Const.OPERATELIST[item].value)
                })
            }
            this.innerOperateVisible = false
        },
        //编辑操作权限
        editOperate(index) {
            this.currentOperateList = this.editOprateObj[index].operateIdList
            this.innerOperateTitle = '修改权限操作'
            this.innerOperateVisible = true
            this.index = index
        },
        //编辑部门或者角色权限
        editGroup(index) {
            this.index = index
            this.innerDialogVisible = true
            this.authName = this.editOprateObj[index].groupName
            if (this.editOprateObj[index].groupType === '2') {
                this.innerDialogTitle = '修改角色权限关联'
                this.roleOrDepartmentTitle = '角色名称'
                this.rolePositionListTree = this.roleTree
                this.$nextTick(() => {
                    this.$refs.innerTree.setCheckedKeys(this.editOprateObj[index].deptRoleIdList)
                })
            } else if (this.editOprateObj[index].groupType === '1') {
                this.innerDialogTitle = '修改部门权限关联'
                this.roleOrDepartmentTitle = '部门名称'
                this.$nextTick(() => {
                    this.rolePositionListTree = this.positionTree
                    this.$refs.innerTree.setCheckedKeys(this.editOprateObj[index].deptRoleIdList)
                })
            }
        },
        //修改操作权限保存，与后台交互
        saveOperate(index) {
            let params = {
                id: this.editOprateObj[index].id,
                deptRoleIdList: this.editOprateObj[index].deptRoleIdList,
                groupName: this.editOprateObj[index].groupName,
                groupType: this.editOprateObj[index].groupType,
                operateIdList: this.editOprateObj[index].operateIdList
            }
            if (this.editOprateObj[index].id) {
                this.$store.dispatch('auth/editOperate', params).then(res => {
                    BusinessUtil.CallbackHandler(res, true).then(() => {
                        this.editOprateObj[index].edit = false
                        this.editOprateObj[index].type = 'get'
                        this.index = ''
                    })
                })
            }
        },
        //新增角色部门操作权限，与后台交互
        addOperateCommit() {
            let params = {
                categoryId: this.currentDirectory.id,
                deptRoleIdList: this.currentNodeIds,
                groupName: this.authName,
                groupType: '',
                operateIdList: this.currentOperateList
            }
            if (this.innerDialogTitle === '添加角色权限关联') {
                params.groupType = '2'
            } else if (this.innerDialogTitle === '添加部门权限关联') {
                params.groupType = '1'
            }
            this.$store.dispatch('auth/addOperate', params).then(res => {
                BusinessUtil.CallbackHandler(res, true).then(() => {
                    this.getAuthGroups()
                    this.index = ''
                })
            })
        },
        //取消角色或部门tree选择框
        cancelInnerDialog() {
            this.innerDialogVisible = false
        },
        //确定角色或部门tree选择框
        chooseInnerDialog() {
            this.currentNodeIds = []
            this.$refs.innerTree.getCheckedNodes().forEach(item => {
                this.currentNodeIds.push(String(item.id))
            })
            if (this.innerDialogTitle.indexOf('修改') === -1) {
                this.innerOperateVisible = true
                this.innerOperateTitle = '添加权限操作'
                this.currentOperateList = []
            } else {
                this.editOprateObj[this.index].groupName = this.authName
                this.editOprateObj[this.index].deptRoleIdList = this.currentNodeIds
            }
            this.innerDialogVisible = false
        },
        //tree弹出框过滤查询
        roleOrDepartmentSearch() {
            this.$refs.innerTree.filterTree(this.roleOrDepartmentName)
        },
        //获取部门树
        getPositionTree() {
            this.$store.dispatch('auth/getPositionTree')
        },
        //获取角色树
        getRoleTree() {
            this.$store.dispatch('auth/getRoleTree')
        },
        //添加角色或部门的操作权限
        addOperate(event) {
            this.authName = ''
            if (event === 'role') {
                this.innerDialogTitle = '添加角色权限关联'
                this.roleOrDepartmentTitle = '角色名称'
                this.rolePositionListTree = this.roleTree
            } else if (event === 'department') {
                this.innerDialogTitle = '添加部门权限关联'
                this.roleOrDepartmentTitle = '部门名称'
                this.rolePositionListTree = this.positionTree
            }
            this.innerDialogVisible = true
            this.$nextTick(() => {
                this.$refs.innerTree.setCheckedKeys([])
            })
        },
        //点击表格最右侧的修改按钮执行
        editHandler(index) {
            this.editOprateObj[index].type = 'edit'
            this.editOprateObj[index].edit = true
            this.editOprateObj[index].operateList = []
            let newOprate = []
            this.directoryAuthList.forEach(item => {
                newOprate.push(Const.OPERATELIST[item])
            })
            this.editOprateObj[index].operateList = newOprate
        },
        //权限列表权限选择
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        //列表前端搜索过滤查询
        searchHandler() {
            this.editOprateObj = BusinessUtil.ObjectClone(this.authGroupsList)
            this.editOprateObj = this.editOprateObj.filter(ele => {
                return ele.authType.indexOf(this.authType) !== -1 && ele.groupName.indexOf(this.authRelevance) !== -1
            })
        },
        //删除权限
        deleteHandler() {
            if (this.multipleSelection.length < 1) {
                return Message.warning({
                    message: '请选择需要删除的权限',
                    showClose: true
                })
            }
            let params = {
                categoryId: this.currentDirectory.id,
                groupIdList: []
            }
            this.multipleSelection.forEach(item => {
                params.groupIdList.push(item.id)
            })
            let authName = this.multipleSelection[0].groupName
            if (this.multipleSelection.length > 1) {
                authName = authName + '等'
            }
            MessageBox.confirm('确定要删除权限:' + authName + '吗？', '确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$store.dispatch('auth/deleteOperate', params).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            this.getAuthGroups()
                        })
                    )
                })
                .catch(e => console.log(e))
        },
        chooseCheck() {
            if (this.$refs.innerTree.getCheckedNodes()[0]) {
                this.$refs.innerTree.getCheckedNodes().length > 1
                    ? (this.authName = this.$refs.innerTree.getCheckedNodes()[0].name + '[组]')
                    : (this.authName = this.$refs.innerTree.getCheckedNodes()[0].name)
            }
        },
        //新增公共目录
        createHandler() {
            if (this.hasEditNode(this.directoryTree)) {
                return Message.warning({
                    message: '请先保存当前新建的目录',
                    showClose: true
                })
            }
            this.treeEditType = 'add'
            let newChild = { pid: this.currentDirectory.id, name: '', children: [], isEdit: true }
            this.currentDirectory.children.push(newChild)
            this.$set(this.$refs.directoryTree.getCurrentNode(), 'children', this.currentDirectory.children)
            this.expandedKeys.push(this.currentDirectory.id)
            this.$nextTick(() => {
                setTimeout(function() {
                    document.getElementById('edit_input').focus()
                }, 500)
            })
        },
        //判断当前是否有处于编辑状态的节点
        hasEditNode(data) {
            let editFlag = false
            let getTree = list => {
                if (!Utils.isString(list)) {
                    return
                }
                list.forEach((el, index) => {
                    if (el.isEdit) {
                        editFlag = true
                    }
                    if (Utils.isString(el.children) && el.children.length > 0) {
                        getTree(list[index].children)
                    }
                })
                return editFlag
            }
            getTree(data)
            return editFlag
        },
        //给每一项tree都增加属性,判断是否可编辑
        setDirectoryTree(data) {
            let newData = [...data]
            let setTree = list => {
                if (!Utils.isString(list)) {
                    return
                }
                list.forEach((el, index) => {
                    el.isEdit = true
                    if (Utils.isString(el.children) && el.children.length > 0) {
                        setTree(list[index].children)
                    }
                })
            }
            setTree(newData)
            return newData
        },
        //新增或修改节点失去焦点时触发
        onEditBlur(data) {
            if (data.name) {
                // let params = {
                //     id: encodeURI(this.currentDirectory.id || ''),
                //     pid: this.currentDirectory.id,
                //     name: data.name
                // }
                // if (this.currentDirectory.id === '[comm]') {
                //     params.pid = this.currentDirectory.id || ''
                // }
                if (this.treeEditType === 'add') {
                    let params = {
                        pid: this.currentDirectory.id,
                        name: data.name
                    }
                    this.$store.dispatch('directory/addDirectory', params).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.getDirectoryTree()
                                this.treeEditType = ''
                            }
                        })
                    )
                } else if (this.treeEditType === 'edit') {
                    let params = {
                        id: encodeURI(this.currentDirectory.id || ''),
                        name: data.name
                    }
                    this.$store.dispatch('directory/editDirectory', params).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.treeEditType = ''
                            }
                        })
                    )
                }
            } else {
                this.getDirectoryTree()
            }
        },
        //修改节点
        modifyHandler() {
            if (this.hasEditNode(this.directoryTree)) {
                return Message.warning({
                    message: '请先保存当前编辑的目录',
                    showClose: true
                })
            }
            if (!Utils.isString(this.currentDirectory)) {
                return Message.warning({
                    message: '请选择一个需要修改的目录',
                    showClose: true
                })
            }
            this.$set(this.$refs.directoryTree.getCurrentNode(), 'isEdit', true)
            this.treeEditType = 'edit'
            this.$nextTick(() => {
                document.getElementById('edit_input').focus()
            })
        },
        //删除公共目录
        deleteDirectoryHandler() {
            !Utils.isString(this.currentDirectory)
                ? Message.warning({
                      message: '请选择一个需要删除的公共目录',
                      showClose: true
                  })
                : MessageBox.confirm('确定要删除公共目录:' + this.currentDirectory.name + '吗？', '确认提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  })
                      .then(() => {
                          this.$store.dispatch('directory/deleteDirectory', { id: this.currentDirectory.id }).then(res =>
                              BusinessUtil.CallbackHandler(res, true).then(() => {
                                  this.getDirectoryTree()
                                  this.$store.commit('directory/setCurrentNodeId', '')
                              })
                          )
                      })
                      .catch(e => console.log(e))
        },
        //左侧树按钮点击事件
        buttonEvent(param) {
            switch (param) {
                case 'createHandler':
                    this.createHandler()
                    break
                case 'modifyHandler':
                    this.modifyHandler()
                    break
                case 'deleteHandler':
                    this.deleteDirectoryHandler()
                    break
            }
        }
    }
}
</script>
<style scopedSlots>
.directory_auth .el-tree > .el-tree-node > .el-tree-node__content {
    font-weight: 700;
}
.oprate_auth {
    padding: 0px 8px;
    background-color: #f5f5f5;
    border: 1px solid #dcdcdc;
    display: inline-block;
    margin: 2px 5px 2px 0px;
}
tr:hover .oprate_auth {
    background-color: #3e8ef7;
}
.directory_auth .el-dialog .auth_name {
    margin: 16px 0 0 0;
}
.directory_auth .auth_name .el-form-item__content .el-input .el-input__inner {
    width: 504px;
}
.directory_auth .el-checkbox-group .el-checkbox {
    margin: 10px;
    width: 108px;
    box-sizing: border-box;
}
.auth_table_td .auth_table_content {
    width: auto;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
    padding: 0;
    margin: 0;
    vertical-align: middle;
}
.auth_table_td .auth_table_button {
    width: 10%;
    padding: 0px;
    padding-left: 15px;
}
.directory_auth .el-table .cell.el-tooltip {
    white-space: pre-wrap;
}
.el-table th > .cell {
    padding-left: auto !important;
}
</style>
