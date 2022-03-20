import { createStore } from 'vuex'

const initialState = {
  provider: {},
  library: {},
  network: {},
  walletAddress: '',
  fetching: false,
  connected: false,
  chainId: 1,
  networkName: ''
}

const Store = createStore({
  state: initialState,
  mutations: {
    resetStore (state) {
      state = initialState
    },
    updateProvider (state, value) {
      state.provider = value
    },
    updateLibrary (state, value) {
      state.library = value
    },
    updateNetwork (state, value) {
      state.network = value
    },
    updateWalletAddress (state, value) {
      state.walletAddress = value
    },
    updateFetching (state, value) {
      state.fetching = value
    },
    updateConnected (state, value) {
      state.connected = value
    },
    updateChainId (state, value) {
      state.chainId = value
    },
    updateNetworkName (state, value) {
      state.networkName = value
    }
  }
})

export default Store
