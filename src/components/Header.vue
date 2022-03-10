<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <img
          src="/img/logo.png"
          width="112"
          height="28"
        />
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
            <img class="blockie" :src="blockie" :alt="address" />
            <div v-if="connected">
              <span class="tag is-info is-light is-medium">{{ ellipseAddress(address) }}</span>
              <span class="tag is-info is-light is-medium">{{ chainData.name }}</span>
              <input
                class="button is-primary is-small"
                type="button"
                value="Disconnect"
                @click.prevent="$emit('disconnect')"
              />
            </div>
            <input
              v-if="!connected"
              class="button is-primary"
              type="button"
              value="Connect"
              @click.prevent="$emit('connect')"
            />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import blockies from 'blockies'
import utilities from "@/mixins/utilities.js"


export default {
  mixins: [utilities],
  props: {
    connected: Boolean,
    address: String,
    networkName: String,
    chainId: Number
    //killSession function emit it on disconnect click
  },
  emits: [
    'connect',
    'disconnect'
  ],
  data() {
    return {
      chainData: {},
      blockie: ''
    };
  },
  mounted() {
    },
  watch: {
    address () {
      const seed = this.address.toLowerCase() || ''
      this.blockie = blockies({
        seed
      }).toDataURL("image/png")
    },
    chainId () {
      this.chainData = this.chainId ? this.getChainData(this.chainId) : null;
    }
  }
};
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
