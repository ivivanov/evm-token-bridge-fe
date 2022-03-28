import * as bulmaToast from 'bulma-toast'

export default {
  methods: {
    async execWithLoader (cbFunc, errorMsg) {
      try {
        this.$store.commit('updateFetching', true)
        return await cbFunc()
      } catch (err) {
        this.errorToast(errorMsg)
      } finally {
        this.$store.commit('updateFetching', false)
      }
    },
    errorToast (msg) {
      bulmaToast.toast({
        duration: 4000,
        position: 'top-center',
        closeOnClick: true,
        opacity: 0.9,
        type: 'is-danger',
        message: msg,
        dismissible: true
      })
    }
  }
}
