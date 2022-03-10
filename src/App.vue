<template>
  <div class="container is-max-desktop">
    <Header
      :connected="connected"
      :address="address"
      :network-name="networkName"
      :chain-id="chainId"
      @connect="onConnect"
      @disconnect="resetApp"
    />
    <div
      id="main"
      class="columns is-centered"
    >
      <div class="column is-8">
        <div class="box">
          <div v-if="connected">
            <h1 class="subtitle is-4 has-text-centered">
              EVM Token Bridge
            </h1>

            <div class="field">
              <label class="label">From</label>
              <div class="control">
                <div class="select">
                  <select>
                    <option>Select dropdown</option>
                    <option>With options</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">To</label>
              <div class="control">
                <div class="select">
                  <select>
                    <option>Select dropdown</option>
                    <option>With options</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">Asset</label>
              <div class="control">
                <div class="select">
                  <select>
                    <option>Select dropdown</option>
                    <option>With options</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">Amount
                <span class="tag is-info is-light is-pulled-right">Available: {{ balance }}</span>
              </label>
              <div class="control">
                <input
                  class="input"
                  type="number"
                  placeholder="Amount"
                >
              </div>
            </div>

            <div class="field">
              <label class="label">Destination Address</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Address"
                >
              </div>
            </div>

            <div class="field">
              <div class="control has-text-right">
                <button class="button is-link">
                  Next
                </button>
              </div>
            </div>
          </div>
          <p v-else>
            Please use Metamask to connect
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import utilities from '@/mixins/utilities.js'

import Web3Modal from 'web3modal'
import { Web3Provider } from '@ethersproject/providers'
import WalletConnectProvider from '@walletconnect/web3-provider'

export default {
  components: {
    Header,
    Footer
  },
  mixins: [utilities],
  data () {
    return {
      fetching: false,
      address: '',
      library: null,
      connected: false,
      chainId: 1,
      networkName: '',
      pendingRequest: false,
      result: null,
      electionContract: null,
      info: null,
      web3Modal: null,
      balance: 0
    }
  },
  mounted () {
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    })
  },
  methods: {
    async onConnect () {
      this.provider = await this.web3Modal.connect()
      const library = new Web3Provider(this.provider)
      const network = await library.getNetwork()
      const address = this.provider.selectedAddress ? this.provider.selectedAddress : this.provider.accounts[0]

      this.library = library
      this.chainId = network.chainId
      this.networkName = network.name
      this.address = address
      this.connected = true

      await this.subscribeToProviderEvents(this.provider)
    },
    async subscribeToProviderEvents (provider) {
      if (!provider.on) {
        return
      }

      provider.on('accountsChanged', this.changedAccount)
      provider.on('networkChanged', this.networkChanged)
      provider.on('close', this.close)

      await this.web3Modal.off('accountsChanged')
    },
    async unSubscribe (provider) {
      // Workaround for metamask widget > 9.0.3 (provider.off is undefined)
      window.location.reload(false)
      if (!provider.off) {
        return
      }

      provider.off('accountsChanged', this.changedAccount)
      provider.off('networkChanged', this.networkChanged)
      provider.off('close', this.close)
    },
    async changedAccount (accounts) {
      if (!accounts.length) {
        // Metamask Lock fire an empty accounts array
        await this.resetApp()
      } else {
        this.address = accounts[0]
      }
    },
    async networkChanged () {
      const library = new Web3Provider(this.provider)
      const network = await library.getNetwork()

      this.library = library
      this.chainId = network.chainId
    },
    async close () {
      this.resetApp()
    },
    getNetwork () {
      return this.getChainData(this.chainId).network
    },
    getProviderOptions () {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.REACT_APP_INFURA_ID
          }
        }
      }
      return providerOptions
    },
    async resetApp () {
      await this.web3Modal.clearCachedProvider()
      localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
      localStorage.removeItem('walletconnect')
      await this.unSubscribe(this.provider)
      this.fetching = false
      this.address = ''
      this.library = null
      this.connected = false
      this.chainId = 1
      this.pendingRequest = false
      this.result = null
      this.electionContract = null
      this.info = null
    }
  }
}
</script>

<style scoped>
#main {
  margin: 50px 0 50px 0;
}
</style>
