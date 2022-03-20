<template>
  <div class="container is-max-desktop">
    <Header
      @connect="onConnect"
      @disconnect="resetApp"
    />
    <div
      id="main"
      class="columns is-centered"
    >
      <div class="column is-8">
        <div class="box">
          <router-view v-if="connected" />
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
import Web3Modal from 'web3modal'
import { Web3Provider } from '@ethersproject/providers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { mapState } from 'vuex'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import utilities from '@/mixins/utilities.js'
import toasts from '@/mixins/toasts.js'

export default {
  components: {
    Header,
    Footer
  },
  mixins: [
    utilities,
    toasts
  ],
  data () {
    return {
      web3Modal: null
    }
  },
  computed: mapState([
    'connected'
  ]),
  mounted () {
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    })
  },
  methods: {
    async onConnect () {
      let provider
      try {
        provider = await this.web3Modal.connect()
      } catch (err) {
        console.log(err)
        this.errorToast('Check your Metamask extension')
        return
      }

      const library = new Web3Provider(provider)
      const network = await library.getNetwork()
      const walletAddress = provider.selectedAddress ? provider.selectedAddress : provider.accounts[0]

      this.$store.commit('updateProvider', provider)
      this.$store.commit('updateLibrary', library)
      this.$store.commit('updateNetwork', network)
      this.$store.commit('updateWalletAddress', walletAddress)
      this.$store.commit('updateChainId', network.chainId)
      this.$store.commit('updateNetworkName', network.name)
      this.$store.commit('updateConnected', true)

      await this.subscribeToProviderEvents()
      this.$router.push({ name: 'bridge' })
    },
    async subscribeToProviderEvents () {
      const provider = this.$store.state.provider
      if (!provider.on) {
        return
      }

      provider.on('accountsChanged', this.changedAccount)
      provider.on('networkChanged', this.networkChanged)
      provider.on('close', this.close)
    },
    async unsubscribeFromProviderEvents () {
      // Workaround for metamask widget > 9.0.3 (provider.off is undefined)
      const provider = this.$store.state.provider
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
        this.$store.commit('updateWalletAddress', accounts[0])
      }
    },
    async networkChanged () {
      const library = new Web3Provider(this.$store.state.provider)
      const network = await library.getNetwork()

      this.$store.commit('updateLibrary', library)
      this.$store.commit('updateChainId', network.chainId)
    },
    async close () {
      this.resetApp()
    },
    getNetwork () {
      return this.getChainData(this.$store.state.chainId).network
    },
    getProviderOptions () {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            // todo setup env var infura ID
            // infuraId: process.env.REACT_APP_INFURA_ID
          }
        }
      }

      return providerOptions
    },
    async resetApp () {
      await this.web3Modal.clearCachedProvider()
      localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
      localStorage.removeItem('walletconnect')
      await this.unsubscribeFromProviderEvents()
      this.$store.commit('resetStore')
    }
  }
}
</script>

<style>
#main {
  margin: 50px 0 50px 0;
}

.web3modal-modal-lightbox{
  z-index: 10000 !important;
}
</style>
