<template>
    <el-container class="main_body document_center">
        <documentCenterAsideTree
            ref="fileTree"
            :tree="directoryTree"
            :tree2="myspaceTree"
            :filter="true"
            :button="true"
            v-on:chooseNode="chooseNode"
            v-on:chooseNode2="chooseNode2"
            v-on:buttonEvent="buttonEvent"
            v-on:searchEvent="searchEvent"
            otherTitleName="我的分享"
            :expandedKeys="expandedKeys"
            :expandedKeysTree2="expandedKeysTree2"
            v-on:onBlur="onEditBlur"
        />
        <MyShare v-if="directoryType === 'myshare'" />
        <Myspace v-if="directoryType === 'myspace'" ref="MyDoc" :folderId="folderId" :expandedKeysTree2="expandedKeysTree2" />
        <Directory v-if="directoryType === 'directory'" ref="directory" :currentDirectory="currentDirectory" />
    </el-container>
</template>
<script>
import documentCenterAsideTree from '../layout/documentCenterAside.vue'
import MyShare from './fileMange/myShare.vue'
import Myspace from './fileMange/myDoc.vue'
import Directory from './fileMange/directory.vue'
import { mapGetters } from 'vuex'
import Utils from '@/common/utils'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import { Message, MessageBox } from 'element-ui'
export default {
    name: 'documentCenter',
    components: {
        documentCenterAsideTree,
        MyShare,
        Myspace,
        Directory
    },
    data() {
        return {
            //directoryType: 'myspace', //字段不同右侧显示的内容不同，myspace：我的空间，directory:公共目录，myshare：我的分享。
            currentFloderNode: '',
            folderId: '',
            expandedKeysTree2: [],
            myspaceTree: [],
            expandedKeys: []
        }
    },
    computed: {
        ...mapGetters('fileManagement', {
            fileListTree: 'getFileTree',
            directoryType: 'getTreeType',
            currentDirectory: 'getCurrentDirectory'
        }),
        ...mapGetters('directory', {
            directoryFileList: 'getDirectoryFileList',
            directoryAuthList: 'getDirectoryAuthList',
            directoryTree: 'getDirectoryTree'
        })
    },
    mounted() {
        this.getFileTree()
        this.getDirectoryTree()
    },
    watch: {},
    methods: {
        //获取文档结构树
        getFileTree() {
            this.$store.dispatch('fileManagement/getFileTree').then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    this.myspaceTree = BusinessUtil.ObjectClone(this.fileListTree)
                    if (res.status === Const.STATUS.SUCCESS) {
                        if (this.directoryType !== 'directory') {
                            this.$nextTick(() => {
                                this.$refs.fileTree.$refs.tree2.setCurrentKey('0')
                                this.expandedKeysTree2 = ['0']
                                this.currentFloderNode = this.$refs.fileTree.$refs.tree2.getCurrentNode()
                            })
                        }
                    }
                })
            })
        },
        //获取公共空间结构树
        async getDirectoryTree() {
            await this.$store.dispatch('directory/getDirectoryTree').then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        if (this.directoryType === 'directory') {
                            this.$nextTick(() => {
                                this.$refs.fileTree.$refs.tree.setCurrentKey(this.currentDirectory.id)
                                this.expandedKeys = [this.currentDirectory.id]
                                this.$refs.directory.searchHandler()
                            })
                        }
                    }
                })
            })
        },
        //左侧树点击事件公共空间
        chooseNode(data) {
            this.$store.commit('fileManagement/changeTreeType', 'directory')
            this.$refs.fileTree.$refs.tree2.setCurrentKey(null)
            this.$store.commit('fileManagement/setCurrentDirectory', JSON.parse(JSON.stringify(data)))
            this.$store.dispatch('directory/getDirectoryAuth', { categoryId: encodeURI(this.currentDirectory.id) })
            this.$nextTick(() => {
                this.$refs.directory.searchHandler()
            })
            document.getElementById('myshare').style.background = 'transparent'
            document.getElementById('myshare').style.color = 'inherit'
        },
        //左侧树点击事件我的空间
        chooseNode2(data) {
            this.$refs.fileTree.$refs.tree.setCurrentKey(null)
            this.$store.commit('fileManagement/changeTreeType', 'myspace')
            if (data.id) {
                this.currentFloderNode = JSON.parse(JSON.stringify(data))
                this.folderId = data.id
                this.folderName = data.name
                this.$nextTick(() => {
                    this.$store.commit('fileManagement/changeCurrent', 1)
                    this.$refs.MyDoc.searchHandler()
                })
                document.getElementById('myshare').style.background = 'transparent'
                document.getElementById('myshare').style.color = 'inherit'
            }
        },
        //新增文件夹
        createHandler() {
            if (this.hasEditNode(this.myspaceTree)) {
                return Message.warning({
                    message: '请先保存当前编辑的目录',
                    showClose: true
                })
            }
            if (this.directoryType !== 'myspace') {
                return Message.warning({
                    message: '此处仅支持对[我的空间]下目录进行新增，操作公共目录，请到公共目录',
                    showClose: true
                })
            }
            this.treeEditType = 'add'
            let newChild = { pid: this.currentFloderNode.id, name: '', children: [], isEdit: true }
            this.currentFloderNode.children.push(newChild)
            this.$set(this.$refs.fileTree.$refs.tree2.getCurrentNode(), 'children', this.currentFloderNode.children)
            this.expandedKeysTree2.push(this.currentFloderNode.id)
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
        //修改文件夹
        modifyHandler() {
            if (this.hasEditNode(this.myspaceTree)) {
                return Message.warning({
                    message: '请先保存当前编辑的目录',
                    showClose: true
                })
            }
            if (this.directoryType !== 'myspace') {
                return Message.warning({
                    message: '此处仅支持对[我的空间]下目录进行操作，操作公共目录，请到公共目录',
                    showClose: true
                })
            }
            if (this.currentFloderNode.name === '我的空间') {
                return Message.warning({
                    message: '根目录[我的空间]不可修改',
                    showClose: true
                })
            }
            if (!Utils.isString(this.folderId)) {
                return Message.warning({
                    message: '请选择一个需要修改的目录',
                    showClose: true
                })
            }
            this.$set(this.$refs.fileTree.$refs.tree2.getCurrentNode(), 'isEdit', true)
            this.treeEditType = 'edit'
            this.$nextTick(() => {
                setTimeout(function() {
                    document.getElementById('edit_input').focus()
                }, 500)
            })
        },
        //删除文件夹
        deleteHandler() {
            if (this.directoryType !== 'myspace') {
                return Message.warning({
                    message: '仅支持对[我的空间]下目录进行删除',
                    showClose: true
                })
            }
            if (this.currentFloderNode.name === '我的空间') {
                return Message.warning({
                    message: '根目录[我的空间]不可删除',
                    showClose: true
                })
            }
            !Utils.isString(this.currentFloderNode.id)
                ? Message.warning({
                      message: '请选择一个需要删除的文件夹',
                      showClose: true
                  })
                : MessageBox.confirm('确定要删除文件夹:' + this.currentFloderNode.name + '吗？', '确认提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  })
                      .then(() => {
                          this.$store.dispatch('fileManagement/deleteFolderUser', { id: this.folderId }).then(res =>
                              BusinessUtil.CallbackHandler(res, true).then(() => {
                                  this.getFileTree()
                                  this.folderId = ''
                                  this.$nextTick(() => {
                                      this.$refs.MyDoc.searchHandler()
                                  })
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
                    this.deleteHandler()
                    break
            }
        },
        //新增或修改节点失去焦点时触发
        onEditBlur(data) {
            if (data.name) {
                if (this.treeEditType === 'add') {
                    let params = {
                        pid: this.currentFloderNode.id,
                        name: data.name
                    }
                    if (params.pid === '0') {
                        params.pid = ''
                    }
                    this.$store.dispatch('fileManagement/newFolderUser', params).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.getFileTree()
                                this.treeEditType = ''
                                this.folderId = ''
                                this.$nextTick(() => {
                                    this.$refs.MyDoc.searchHandler()
                                })
                            }
                        })
                    )
                } else if (this.treeEditType === 'edit') {
                    let params = {
                        id: encodeURI(this.currentFloderNode.id || ''),
                        name: data.name
                    }
                    this.$store.dispatch('fileManagement/editFolderUser', params).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.treeEditType = ''
                            }
                        })
                    )
                }
            } else {
                this.getFileTree()
            }
        },
        //左侧点击我的文档或者我的分享
        searchEvent(param) {
            switch (param) {
                case 'searchShareHandler':
                    this.$store.commit('fileManagement/changeTreeType', 'myshare')
                    this.$refs.fileTree.$refs.tree.setCurrentKey(null)
                    this.$refs.fileTree.$refs.tree2.setCurrentKey(null)
                    break
            }
        }
    }
}
</script>
<style>
#myshare:hover {
    background: #2483ff;
    color: #fff;
}
.document_center .el-tree > .el-tree-node > .el-tree-node__content {
    font-weight: 700;
}
</style>
