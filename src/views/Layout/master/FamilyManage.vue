<template>
<div class="family-manage">
      <!-- 有家庭 -->
      <Family v-if="hasFamily"/>
    <!-- 没有家庭 -->
      <NoFamily v-else/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Family from '@/views/Layout/master/Family.vue'
import NoFamily from '@/views/Layout/master/NoFamily.vue'
export default {
  name: 'FamilyManage',
   components: {
    Family,
    NoFamily
  },
  computed: {
    ...mapGetters(['hasFamily'])
  },
  created () {
    const rolename = localStorage.getItem('rolename')
    if (rolename === '系统管理员'){
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>