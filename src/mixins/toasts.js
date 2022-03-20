import * as bulmaToast from 'bulma-toast'

export default {
  methods: {
    errorToast (msg) {
      bulmaToast.toast({
        duration: 2000,
        position: 'top-center',
        closeOnClick: true,
        opacity: 0.9,
        type: 'is-danger',
        message: msg
      })
    }
  }
}
