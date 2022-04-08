<template>
  <el-pagination
  background
  :page-size="pageSize"
  layout="prev, pager, next, total, jumper"
  :total="total"
  :current-page.sync="currentPage"
  @current-change="handleCurrentChange"
  >
</el-pagination>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage:1
    }
  },
  methods: {
    handleCurrentChange(page) {
        this.$emit('pageChange', page)
      }
  }
}
</script>

<style>

</style>