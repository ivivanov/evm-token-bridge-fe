<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <img
        src="/img/logo.png"
        width="80"
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
      <div class="navbar-start" />

      <div class="navbar-end">
        <div class="navbar-item">
          <img
            class="blockie"
            :src="blockie"
            :alt="address"
          >
          <div v-if="connected">
            <span class="tag is-info is-light is-medium">{{ ellipseAddress(address) }}</span>
            <span class="tag is-info is-light is-medium">{{ chainData.name }}</span>
            <input
              class="button is-primary is-small"
              type="button"
              value="Disconnect"
              @click.prevent="$emit('disconnect')"
            >
          </div>
          <input
            v-if="!connected"
            class="button is-primary"
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
import blockies from 'blockies'
import utilities from '@/mixins/utilities.js'

export default {
  mixins: [utilities],
  props: {
    connected: Boolean,
    address: {
      type: String,
      default: ''
    },
    networkName: {
      type: String,
      default: ''
    },
    chainId: {
      type: Number,
      default: 1
    }
  },
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
  watch: {
    address () {
      const seed = this.address.toLowerCase() || ''
      this.blockie = blockies({
        seed
      }).toDataURL('image/png')
    },
    chainId () {
      this.chainData = this.chainId ? this.getChainData(this.chainId) : null
    }
  },
  mounted () {
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
