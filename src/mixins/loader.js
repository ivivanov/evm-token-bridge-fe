export default {
  methods: {
    toggleLoader () {
      const toggle = this.$store.state.fetching
      this.$store.commit('updateFetching', !toggle)
    }
  }
}
