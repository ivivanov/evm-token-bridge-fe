import * as bulmaToast from 'bulma-toast'

export function errorToast (msg) {
  bulmaToast.toast({
    duration: 10000,
    offsetTop: '50px',
    position: 'top-right',
    closeOnClick: true,
    opacity: 0.9,
    type: 'is-danger',
    message: msg,
    dismissible: true
  })
}

export function successToast (msg) {
  bulmaToast.toast({
    duration: 10000,
    offsetTop: '50px',
    position: 'top-right',
    closeOnClick: true,
    opacity: 0.9,
    type: 'is-success',
    message: msg,
    dismissible: true
  })
}
