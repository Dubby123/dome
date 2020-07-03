<template>
    <div>hello world {{ path }}</div>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {
            path: ''
        }
    },
    mounted() {
        this.path = this.$route.query
        // console.log(this.$route)
    }
}
</script>

<style></style>
