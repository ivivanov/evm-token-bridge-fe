<template>
  <h1 class="subtitle is-4 has-text-centered">
    Import Token
  </h1>

  <article class="message">
    <div class="message-body">
      You can import tokens which exist on the currently selected network. To import tokens from other network switch the network from Metamask.
    </div>
  </article>

  <div class="field">
    <label class="label">Token Address</label>
    <div class="control">
      <div class="control">
        <input
          v-model="address"
          class="input"
          type="text"
          @paste.prevent="parseAddress"
          @change.prevent="parseAddress"
        >
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Symbol</label>
    <div class="control">
      <div class="control">
        <input
          :value="symbol"
          disabled
          class="input"
          type="text"
        >
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Name</label>
    <div class="control">
      <div class="control">
        <input
          :value="name"
          disabled
          class="input"
          type="text"
        >
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Native chain</label>
    <div class="control">
      <div class="control">
        <input
          :value="nativeChainId"
          disabled
          class="input"
          type="number"
        >
      </div>
    </div>
  </div>

  <div class="field">
    <div class="control has-text-right">
      <button
        class="button is-link"
        @click.prevent="importToken"
      >
        Import
      </button>
    </div>
  </div>

  <h1 class="subtitle is-4 has-text-centered">
    Tokens
  </h1>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>Name</th>
        <th>Symbol</th>
        <th>Address</th>
        <th>Native chain</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(t, key) in sourceTokens"
        :key="key"
      >
        <td>{{ t.name }}</td>
        <td>{{ t.symbol }}</td>
        <td>{{ t.address }}</td>
        <td>{{ t.nativeChainId }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState } from 'vuex'
import loader from '@/mixins/loader'
import utilities from '@/mixins/utilities'
import BridgeService from '@/services/bridge'
import WalletService from '@/services/wallet'

export default {
  mixins: [
    loader,
    utilities
  ],
  data () {
    return {
      address: '',
      name: '',
      symbol: '',
      nativeChainId: '',
      sourceTokens: []
    }
  },
  computed: mapState([
    'chainId'
  ]),
  watch: {
    chainId () {
      this.fetchPageData()
    }
  },
  async mounted () {
    await this.fetchPageData()
  },
  methods: {
    async fetchPageData () {
      this.execWithLoader(async () => {
        this.sourceTokens = JSON.parse(window.localStorage.getItem('tokens'))
      }, 'Error msg')
    },
    importToken () {
      const newToken = {
        address: this.address,
        name: this.name,
        symbol: this.symbol,
        nativeChainId: this.nativeChainId
      }

      let tokens = JSON.parse(window.localStorage.getItem('tokens'))
      if (!tokens) {
        tokens = []
      }

      tokens.push(newToken)
      window.localStorage.setItem('tokens', JSON.stringify(tokens))
      this.sourceTokens = tokens
    },
    async parseAddress (evt) {
      this.execWithLoader(async () => {
        if (this.address === '') {
          this.address = evt.clipboardData.getData('text')
        }

        const token = await BridgeService.getWrappedToken(this.address)
        if (token) {
          this.name = token.name
          this.symbol = token.symbol
          this.nativeChainId = token.nativeChain
        } else {
          this.name = await WalletService.getTokenName(this.address)
          this.symbol = await WalletService.getTokenSymbol(this.address)
          this.nativeChainId = this.chainId
        }
      }, 'Invalid address')
    }
  }
}
</script>
