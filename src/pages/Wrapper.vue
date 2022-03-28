<template>
  <h1 class="subtitle is-4 has-text-centered">
    Wrap Token
  </h1>

  <article class="message">
    <div class="message-body">
      <div class="content">
        <ol>
          <li>To wrap tokens you must first import the source token</li>
          <li>Select on which network you want to wrap tokens from Metamask</li>
        </ol>
      </div>
    </div>
  </article>

  <div class="field">
    <label class="label">Source Token</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select
          v-model="selectedToken"
          @change="setSourceChianId"
        >
          <option
            disabled
            value="0"
          >
            Please select one
          </option>
          <option
            v-for="(token, key) in sourceTokens"
            :key="key"
            :value="token"
          >
            {{ token.symbol }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Source Chain Id</label>
    <div class="control">
      <div class="control">
        <input
          :value="selectedToken.chainId"
          class="input"
          type="text"
          disabled
        >
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Wrapped Token Name</label>
    <div class="control">
      <div class="control">
        <input
          v-model="name"
          class="input"
          type="text"
        >
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Wrapped Token Symbol</label>
    <div class="control">
      <div class="control">
        <input
          v-model="symbol"
          class="input"
          type="text"
        >
      </div>
    </div>
  </div>

  <div class="field">
    <div class="control has-text-right">
      <button
        class="button is-link"
        @click="wrap"
      >
        Wrap
      </button>
    </div>
  </div>

  <h1 class="subtitle is-4 has-text-centered">
    Wrapped Tokens
  </h1>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>Name</th>
        <th>Symbol</th>
        <th>Source Chain ID</th>
        <th>Source Token</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(t, key) in wrappedTokens"
        :key="key"
      >
        <td>{{ t.name }}</td>
        <td>{{ t.symbol }}</td>
        <td>{{ t.sourceChainId }}</td>
        <td>{{ ellipseAddress(t.sourceToken) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState } from 'vuex'
import loader from '@/mixins/loader'
import utilities from '@/mixins/utilities'
import BridgeService from '@/services/bridge'

export default {
  mixins: [
    loader,
    utilities
  ],
  data () {
    return {
      selectedToken: 0,
      name: '',
      symbol: '',
      sourceChainId: '',
      sourceTokens: [],
      wrappedTokens: []
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
    setSourceChianId () {

    },
    async fetchPageData () {
      this.execWithLoader(async () => {
        this.sourceTokens = JSON.parse(window.localStorage.getItem('tokens'))
        this.wrappedTokens = await BridgeService.wrappedTokens(this.chainId)
      }, 'Error msg')
    },
    async wrap () {
      this.execWithLoader(async () => {
        await BridgeService.wrapToken(this.name, this.symbol, this.selectedToken.address, this.selectedToken.chainId)
      }, 'Error wrapping new token')
    }
  }
}
</script>
