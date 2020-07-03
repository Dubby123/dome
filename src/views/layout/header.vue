<template>
    <div class="header-container">
        <EditUser></EditUser>
        <!-- <EditTtheme></EditTtheme> -->
        <el-button type="text" @click.stop="toMessage" v-if="false">
            <el-badge v-if="messageNumber === 0">
                <i class="icon icon-email" :title="getUserName"></i>
            </el-badge>
            <el-badge v-else :value="messageNumber">
                <i class="icon icon-email" :title="getUserName"></i>
            </el-badge>
        </el-button>
        <el-link href="http://hcvip.supconit.com" target="_blank">
            了解Honeycomb
        </el-link>
        <el-link :href="softwareUrl" target="_blank" v-if="false">软件工厂</el-link>
    </div>
</template>
<script>
import api from '@/common/api'
import EditUser from './headerComp/editUser'
//import EditTtheme from './headerComp/editTtheme'
export default {
    name: 'Header',
    components: { EditUser },
    data() {
        return {
            softwareUrl: api.getGeneratorUrl(),
            getUserName: '',
            messageNumber: ''
        }
    },
    methods: {
        toMessage() {
            this.$router.push({ path: '/control/message', replace: true })
        }
    }
}
</script>
<style lang="scss" scopedSlots>
.header-container {
    .icon-theme {
        background: url('../../assets/img/icon-theme.png') no-repeat center center;
    }
    .icon-person {
        background: url('../../assets/img/icon-person.png') no-repeat center center;
    }
    .icon-email {
        background: url('../../assets/img/icon-email.png') no-repeat center center;
    }
}
</style>
