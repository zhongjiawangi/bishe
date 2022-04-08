<template>
    <el-dialog
        title="修改地址"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="reset"
    >
        <el-input v-model="address" placeholder="请输入家庭地址"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="reset">取 消</el-button>
            <el-button type="primary" @click="changeAddress">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { Message } from 'element-ui'

export default {
    name: 'FamileDialog',
    data() {
        return {
            dialogVisible: false,
            address: '',
        }
    },
    methods: {
        /**
         * 修改地址
         */
        async changeAddress() {
            const houseid = this.$store.state.userinfo.houseid
            const params = {
                houseid,
                address: this.address,
            }
            const { data: res } = await this.$api.familyAPI.changeAddress(
                params
            )
            if (res.status === 200) {
                Message({
                    type: 'success',
                    message: '修改成功!',
                })
                this.$emit('changeAddress')
            }
            this.reset()
        },
        reset() {
            this.dialogVisible = false
            this.address = ''
        },
    },
}
</script>

<style></style>
