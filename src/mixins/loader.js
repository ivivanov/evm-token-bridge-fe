import { errorToast } from '../helpers/toast'

export default {
  methods: {
    async execWithLoader (cbFunc, errorMsg) {
      try {
        this.$store.commit('updateFetching', true)
        return await cbFunc()
      } catch (err) {
        console.log(err.message)
        errorToast(errorMsg)
      } finally {
        setTimeout(() => {
          this.$store.commit('updateFetching', false)
        }, 500)
      }
    }
  }
}
