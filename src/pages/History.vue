<template>
  <h1 class="subtitle is-4 has-text-centered">
    Bridge Transaction History
  </h1>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>Action</th>
        <th>From</th>
        <th>To</th>
        <th>Token Address</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(t, key) in transactions"
        :key="key"
      >
        <td>{{ t.name }}</td>
        <td>{{ t.from }}</td>
        <td>{{ t.to }}</td>
        <td>{{ t.token }}</td>
        <td>{{ t.amount }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState } from 'vuex'
import loader from '@/mixins/loader'
import utilities from '@/mixins/utilities'
import { ethers } from 'ethers'
import Bridge from '@/constants/abis/Bridge'

export default {
  mixins: [
    loader,
    utilities
  ],
  data () {
    return {
      transactions: []
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
        this.transactions = []
        const provider = new ethers.providers.EtherscanProvider(this.chainId, 'X1JCI4XW7NJKENK7CA3E7TV6ZF7DVZTYQ5')
        const history = await provider.getHistory(this.$store.state.account)
        const iface = new ethers.utils.Interface(Bridge.abi)

        for (let i = 0; i < history.length; i++) {
          const tx = history[i]
          try {
            const decodedInput = iface.parseTransaction({ data: tx.data, value: tx.value })
            switch (decodedInput.name) {
              case 'release':
              case 'mint':
                this.transactions.push(this.parseClaim(decodedInput))
                break
              case 'lock':
              case 'burn':
                this.transactions.push(this.parseBridge(decodedInput))
                break
              default:
                console.log('Unsupported tx: ', decodedInput.name)
            }
          } catch {}
        }
      }, 'Error fetching wrapped tokens')
    },
    parseBridge (tx) {
      return {
        name: 'Bridge',
        from: this.chainId,
        to: tx.args[0],
        token: tx.args[1],
        amount: ethers.utils.formatEther(tx.args[2])
      }
    },
    parseClaim (tx) {
      const args = tx.args[0]
      return {
        name: 'Claim',
        from: args[0],
        to: this.chainId,
        token: args[1],
        amount: ethers.utils.formatEther(args[2])
      }
    }
  }
}
</script>
