<template>
  <h1 class="subtitle is-4 has-text-centered">
    EVM Token Bridge
  </h1>

  <div class="field">
    <label class="label">From</label>
    <div class="control">
      <div class="control">
        <input
          class="input"
          type="text"
          :value="fromChainData.name"
          disabled
        >
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">To</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select v-model="toChainId">
          <option
            disabled
            value="-2"
          >
            Please select one
          </option>
          <option
            v-for="(chain, key) in supportedChains"
            :key="key"
            :value="chain.chain_id"
          >
            {{ chain.name }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Asset</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select
          v-model="selectedAsset"
          @change="getBalance"
        >
          <option
            disabled
            value=""
          >
            Please select one
          </option>
          <option value="">
            ETH
          </option>
          <option
            v-for="(token, key) in tokens"
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
    <label class="label">Amount
      <span class="tag is-info is-light is-pulled-right">Balance: {{ selectedBalance }}</span>
    </label>
    <div class="control">
      <input
        v-model="amount"
        class="input"
        type="number"
        placeholder="Amount"
      >
    </div>
  </div>

  <div class="field">
    <div class="control has-text-right">
      <button
        class="button is-link"
        @click="confirmLock"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import WalletService from '@/services/wallet'
import loader from '@/mixins/loader'
import utilities from '@/mixins/utilities'
import { getChainData, supportedChains } from '@/constants/chains'
import getChainContracts from '@/constants/contracts'

const dataInitialState = function () {
  return {
    fromChainData: {},
    supportedChains: supportedChains,
    toChainId: -2,
    selectedAsset: '',
    selectedBalance: '0.0',
    tokens: [],
    amount: ''
  }
}

export default {
  mixins: [
    loader,
    utilities
  ],
  data () {
    return dataInitialState()
  },
  computed: mapState([
    'chainId'
  ]),
  watch: {
    chainId () {
      this.resetData()
      this.fetchPageData()
    }
  },
  async mounted () {
    this.fetchPageData()
  },
  methods: {
    fetchPageData () {
      this.toggleLoader()
      this.fromChainData = getChainData(this.chainId)
      this.fromChainId = this.$store.state.chainId

      const contracts = getChainContracts(this.fromChainId)
      if (contracts && contracts.mainEscrow) {
        this.tokens = contracts.tokens
      } else {
        // todo fetch tokens from smart contract - 'getSupportedTokens'
        this.tokens = []
      }
      this.toggleLoader()
    },
    resetData: function () {
      Object.assign(this.$data, dataInitialState())
    },
    async getBalance () {
      this.toggleLoader()
      const address = this.selectedAsset.address ? this.selectedAsset.address : ''
      this.selectedBalance = await WalletService.getTokenBalance(address)
      this.toggleLoader()
    },
    async confirmLock () {
      await WalletService.lockAmount(this.library, this.address, this.amount)
    }
  }
}
</script>
