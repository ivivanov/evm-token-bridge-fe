<template>
  <h1 class="subtitle is-4 has-text-centered">
    Token Bridge
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
            :value="chain.chainId"
          >
            {{ chain.name }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Token</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select
          v-model="selectedToken"
          @change="getBalance"
        >
          <option
            disabled
            value=""
          >
            Please select one
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
        type="text"
        placeholder="Amount"
      >
    </div>
  </div>

  <div class="field">
    <div class="control has-text-right">
      <button
        class="button is-link"
        @click="lockOrBurn"
      >
        Next
      </button>
    </div>
  </div>

  <h1 class="subtitle is-4 has-text-centered">
    Claim Bridged Tokens
  </h1>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>From</th>
        <th>To</th>
        <th>Token</th>
        <th>Amount</th>
        <th>Receiver</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(t, key) in claims"
        :key="key"
      >
        <td>{{ t.sourceChain }}</td>
        <td>{{ t.targetChain }}</td>
        <td>{{ ellipseAddress(t.nativeToken) }}</td>
        <td>{{ t.amount }}</td>
        <td>{{ ellipseAddress(t.receiver) }}</td>
        <td>
          <button
            class="button is-link is-small"
            @click="mintOrRelease(key)"
          >
            Claim
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState } from 'vuex'
import loader from '@/mixins/loader'
import utilities from '@/mixins/utilities'
import { getChainData } from '@/constants/chains'
import WalletService from '@/services/wallet'
import BridgeService from '@/services/bridge'
import { ethers } from 'ethers'

const dataInitialState = function () {
  return {
    fromChainData: {},
    supportedChains: [
      { name: 'Ethereum Ropsten', chainId: 3 },
      { name: 'Ethereum Rinkeby', chainId: 4 }
    ],
    toChainId: -2,
    selectedToken: {},
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
    'chainId',
    'claims'
  ]),
  watch: {
    chainId () {
      this.resetData()
      this.fetchPageData()
    }
  },
  async mounted () {
    await this.fetchPageData()
  },
  methods: {
    resetData: function () {
      Object.assign(this.$data, dataInitialState())
    },
    async fetchPageData () {
      this.execWithLoader(async () => {
        this.fromChainData = getChainData(this.chainId)
        this.tokens = await BridgeService.getChainTokens(this.chainId)
      })
    },
    async getBalance () {
      this.execWithLoader(async () => {
        this.selectedBalance = await WalletService.getTokenBalance(this.selectedToken.address)
      }, 'Get token balance error')
    },
    async lockOrBurn () {
      this.execWithLoader(async () => {
        if (this.chainId === this.selectedToken.nativeChainId) { // this is native token
          console.log('BridgeService.lockToken')
          await BridgeService.lockToken(this.toChainId, this.selectedToken.address, this.amount)
        } else { // this is wrapped token
          console.log('BridgeService.burnToken')
          await BridgeService.burnToken(this.selectedToken.address, this.amount)
        }
      }, 'Error sending lock tx')
    },
    async mintOrRelease (claimId) {
      this.execWithLoader(async () => {
        const claim = this.claims[claimId]

        if (claim.targetChain === this.chainId) {
          if (claim.type === 'mint') {
            await BridgeService.mintToken(claim)
          } else { // type is release
            await BridgeService.releaseToken(claim)
          }
        } else { // prompt MM to switch network
          const targetChain = getChainData(claim.targetChain)
          const hexTargetChainId = ethers.utils.hexStripZeros(targetChain.chain_id)
          // Check if MetaMask is installed
          // MetaMask injects the global API into window.ethereum
          if (window.ethereum) {
            try {
            // check if the chain to connect to is installed
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: hexTargetChainId }] // chainId must be in hexadecimal numbers
              })
            } catch (error) {
              console.log(error)
              // This error code indicates that the chain has not been added to MetaMask
              // if it is not, then install it into the user MetaMask
              if (error.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: 4,
                        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
                      }
                    ]
                  })
                } catch (addError) {
                  console.error(addError)
                }
              }
              console.error(error)
            }
          } else {
          // if no window.ethereum then MetaMask is not installed
            alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html')
          }
        }
      })
    }
  }
}
</script>
