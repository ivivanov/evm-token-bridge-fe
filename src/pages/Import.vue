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
    <label class="label">Token Contract Address</label>
    <div class="control">
      <div class="control">
        <input
          v-model="address"
          class="input"
          type="text"
          @paste="parseAddress"
          @change="parseAddress"
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
    <label class="label">Chain ID</label>
    <div class="control">
      <div class="control">
        <input
          :value="chainId"
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
        @click="importToken"
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
        <th>Chain ID</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(t, key) in sourceTokens"
        :key="key"
      >
        <td>{{ t.name }}</td>
        <td>{{ t.symbol }}</td>
        <td>{{ t.chainId }}</td>
        <td>{{ ellipseAddress(t.address) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState } from 'vuex'
import loader from '@/mixins/loader'
import utilities from '@/mixins/utilities'
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
    async importToken () {
      const newToken = {
        address: this.address,
        name: this.name,
        symbol: this.symbol,
        chainId: this.chainId
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

        this.name = await WalletService.getTokenName(this.address)
        this.symbol = await WalletService.getTokenSymbol(this.address)
        // this.balance = await WalletService.getTokenBalance(this.address)
      }, 'Invalid address')
    }
  }
}
</script>
