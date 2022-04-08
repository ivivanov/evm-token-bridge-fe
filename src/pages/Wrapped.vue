<template>
  <h1 class="subtitle is-4 has-text-centered">
    Wrapped tokens on {{ currentChain.name }}
  </h1>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>Name</th>
        <th>Symbol</th>
        <th>Address</th>
        <th>Source Chain ID</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(t, key) in wrappedTokens"
        :key="key"
      >
        <td>{{ t.name }}</td>
        <td>{{ t.symbol }}</td>
        <td>{{ t.wrappedToken }}</td>
        <td>{{ t.sourceChain }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState } from 'vuex'
import loader from '@/mixins/loader'
import utilities from '@/mixins/utilities'
import { getChainData } from '@/constants/chains'

export default {
  mixins: [
    loader,
    utilities
  ],
  data () {
    return {
      currentChain: {},
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
    async fetchPageData () {
      this.execWithLoader(async () => {
        this.currentChain = getChainData(this.chainId)
        this.wrappedTokens = this.$store.state.wrappedTokens
      }, 'Error fetching wrapped tokens')
    }
  }
}
</script>
