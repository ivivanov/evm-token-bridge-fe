import { createStore } from 'vuex'

const initialState = {
  account: '',
  fetching: false,
  connected: false,
  chainId: 1
}

const Store = createStore({
  state: initialState,
  mutations: {
    resetStore (state) {
      state = initialState
    },
    updateAccount (state, value) {
      state.account = value
    },
    updateFetching (state, value) {
      state.fetching = value
    },
    updateConnected (state, value) {
      state.connected = value
    },
    updateChainId (state, value) {
      state.chainId = value
    }
  }
})

export default Store
