<template>
  <nav>
    <router-link to="/">Survey Data Query</router-link>
    <router-link to="/user">Survey Respondent</router-link>

    <button v-if="wallet" @click="disconnect">Disconnect</button>
    <button v-else @click="connect">Connect Wallet</button>
  </nav>
  <hr />
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import metamask from "@/provider/metamask";
import Web3 from "web3";

/**
 * @type {metamask} metamaskInstance
 */
let metamaskInstance;

const store = useStore();

const wallet = computed(() => store.state.wallet);

onMounted(() => {
  metamaskInstance = metamask.create();
  store.commit("setWeb3", {
    web3: metamaskInstance.getProvider(),
  });
});

const connect = async () => {
  try {
    const wallet = await metamaskInstance.getWallet();

    store.commit("setWallet", {
      wallet,
    });

    // const web3 = new Web3("https://devnet.fhenix.io");

    // const result = await web3.eth.call({
    //   to: "0x0000000000000000000000000000000000000044",
    // });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const disconnect = async () => {
  store.commit("setWallet", {
    wallet: null,
  });
};
</script>

<style lang="scss" scoped>
nav {
  padding: 1rem;
  display: flex;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    padding: 0.25rem 1rem;

    &:first-of-type {
      padding-left: 0;
    }

    &.router-link-exact-active {
      color: #a873e9;
      text-decoration: underline;
    }
  }

  button {
    margin-left: auto;
  }
}
</style>
