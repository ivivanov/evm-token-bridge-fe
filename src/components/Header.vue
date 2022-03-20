<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <img
        src="/img/logo.png"
        width="50"
      >
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div
      id="navbarBasicExample"
      class="navbar-menu"
    >
      <div
        v-if="connected"
        class="navbar-start"
      >
        <div class="navbar-item">
          <router-link :to="{ name: 'bridge' }">
            Bridge
          </router-link>
        </div>
        <div class="navbar-item">
          <router-link :to="{ name: 'claim' }">
            Claim
          </router-link>
        </div>
        <div class="navbar-item">
          <router-link :to="{ name: 'faucet' }">
            Faucet
          </router-link>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <img
            class="blockie"
            :src="blockie"
            :alt="address"
          >
          <div v-if="connected">
            <span class="tag is-info is-light is-medium">{{ ellipseAddress(account) }}</span>
            <span class="tag is-info is-light is-medium">{{ chainData.name }}</span>
            <input
              class="button is-primary is-small"
              type="button"
              value="Disconnect"
              @click.prevent="$emit('disconnect')"
            >
          </div>
          <input
            v-else
            class="button is-primary is-small"
            type="button"
            value="Connect Wallet"
            @click.prevent="$emit('connect')"
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import blockies from 'blockies'
import utilities from '@/mixins/utilities.js'

export default {
  mixins: [utilities],
  emits: [
    'connect',
    'disconnect'
  ],
  data () {
    return {
      chainData: {},
      blockie: ''
    }
  },
  computed: mapState([
    'connected',
    'account',
    'networkName',
    'chainId'
  ]),
  watch: {
    account () {
      const seed = this.$store.state.account.toLowerCase() || ''
      this.blockie = blockies({ seed }).toDataURL('image/png')
    },
    chainId () {
      this.chainData = this.chainId ? this.getChainData(this.chainId) : null
    }
  }
}
</script>

<style scoped>
.tag {
  margin-right: 5px;
}

.blockie {
  margin-right: 5px;
  border-radius: 4px;
}

</style>
