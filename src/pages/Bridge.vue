<template>
  <h1 class="subtitle is-4 has-text-centered">
    EVM Token Bridge
  </h1>

  <div class="field">
    <label class="label">From</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select v-model="form.from">
          <option value="3">
            Ropsten
          </option>
          <option value="4">
            Rinkeby
          </option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">To</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select v-model="form.to">
          <option value="4">
            Rinkeby
          </option>
          <option value="3">
            Ropsten
          </option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Asset</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select v-model="form.asset">
          <option value="ACM">
            Acme ACM
          </option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Amount
      <span class="tag is-info is-light is-pulled-right">Available: {{ form.acmeBalance }}</span>
    </label>
    <div class="control">
      <input
        v-model="form.amount"
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
// import WalletService from '@/services/wallet.js'

export default {
  data () {
    return {
      form: {
        from: '4',
        to: '3',
        asset: 'ACM',
        acmeBalance: 0.0,
        amount: ''
      }
    }
  },
  async mounted () {
    // this.form.acmeBalance = await WalletService.getAcmeBalance(library, address)
  },
  methods: {
    async confirmLock () {
      this.fetching = true
      // await WalletService.lockAmount(this.library, this.address, this.form.amount)
    }
  }
}
</script>
