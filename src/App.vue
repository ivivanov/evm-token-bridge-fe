<template>
  <div class="section">
    <Header
      :connected="connected"
      :address="address"
      :networkName="networkName"
      :chainId="chainId"
      @connect="onConnect"
      @disconnect="resetApp"
    />
  </div>
  <div class="box">
    <p v-if="!connected">Please use Metamask to connect</p>
  </div>
  <div class="section">
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import utilities from "@/mixins/utilities.js";

import Web3Modal from "web3modal"
import { Web3Provider } from "@ethersproject/providers"
import WalletConnectProvider from "@walletconnect/web3-provider"

export default {
  mixins: [utilities],
  components: {
    Header,
    Footer,
  },
  data() {
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
    }
  },
  mounted() {
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions(),
    })
  },
  methods: {
    async onConnect() {
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
    async subscribeToProviderEvents(provider) {
      if (!provider.on) {
        return
      }

      provider.on("accountsChanged", this.changedAccount)
      provider.on("networkChanged", this.networkChanged)
      provider.on("close", this.close)

      await this.web3Modal.off("accountsChanged")
    },
    async unSubscribe(provider) {
      // Workaround for metamask widget > 9.0.3 (provider.off is undefined)
      window.location.reload(false)
      if (!provider.off) {
        return
      }

      provider.off("accountsChanged", this.changedAccount)
      provider.off("networkChanged", this.networkChanged)
      provider.off("close", this.close)
    },
    async changedAccount(accounts) {
      if (!accounts.length) {
        // Metamask Lock fire an empty accounts array
        await this.resetApp()
      } else {
        this.address = accounts[0]
      }
    },
    async networkChanged() {
      const library = new Web3Provider(this.provider)
      const network = await library.getNetwork()

      this.library = library
      this.chainId = network.chainId
    },
    async close() {
      this.resetApp()
    },
    getNetwork() {
      this.getChainData(this.chainId).network
    },
    getProviderOptions() {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.REACT_APP_INFURA_ID,
          },
        },
      }
      return providerOptions
    },
    async resetApp() {
      await this.web3Modal.clearCachedProvider()
      localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER")
      localStorage.removeItem("walletconnect")
      await this.unSubscribe(this.provider)
      this.fetching = false
      this.address = ""
      this.library = null
      this.connected = false
      this.chainId = 1
      this.pendingRequest = false
      this.result = null
      this.electionContract = null
      this.info = null
    },
  },
}
</script>
