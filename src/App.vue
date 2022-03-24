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

  <!-- Loader modal -->
  <div
    v-if="fetching"
    class="modal is-active is-loader"
  >
    <div
      class="modal-background"
    />
    <div class="modal-content">
      <div class="section">
        <div class="container">
          <div class="columns">
            <div class="column is-6 is-offset-3">
              <div class="box">
                <div class="loader-wrapper is-active">
                  <div class="loader is-loading" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3Modal from 'web3modal'
import { Web3Provider } from '@ethersproject/providers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { markRaw } from '@vue/reactivity'
import { mapState } from 'vuex'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import utilities from '@/mixins/utilities'
import toasts from '@/mixins/toasts'
import { getChainData } from '@/constants/chains'

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
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.VUE_APP_INFURA_ID
          }
        }
      },
      web3Modal: null,
      provider: null,
      library: null,
      network: null
    }
  },
  computed: mapState([
    'connected',
    'fetching'
  ]),
  mounted () {
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.providerOptions
    })
  },
  methods: {
    async onConnect () {
      try {
        this.provider = await this.web3Modal.connect()
      } catch (err) {
        console.log(err)
        this.errorToast('Check your Metamask extension')
        return
      }

      this.library = markRaw(new Web3Provider(this.provider))
      this.network = markRaw(await this.library.getNetwork())
      const account = this.provider.selectedAddress ? this.provider.selectedAddress : this.provider.accounts[0]

      this.$store.commit('updateAccount', account)
      this.$store.commit('updateChainId', this.network.chainId)
      this.$store.commit('updateConnected', true)

      await this.subscribeToProviderEvents()
      this.$router.push({ name: 'bridge' })
    },
    async subscribeToProviderEvents () {
      const provider = this.provider
      if (!provider.on) {
        return
      }

      provider.on('accountsChanged', this.changedAccount)
      provider.on('networkChanged', this.networkChanged)
      provider.on('close', this.close)
    },
    async unsubscribeFromProviderEvents () {
      // Workaround for metamask widget > 9.0.3 (provider.off is undefined)
      const provider = this.provider
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
        this.$store.commit('updateAccount', accounts[0])
      }
    },
    async networkChanged () {
      this.library = markRaw(new Web3Provider(this.provider))
      this.network = markRaw(await this.library.getNetwork())
      this.$store.commit('updateChainId', this.network.chainId)
    },
    async close () {
      this.resetApp()
    },
    getNetwork () {
      return getChainData(this.$store.state.chainId).network
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
