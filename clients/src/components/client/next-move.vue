<template>
  <div class="expand d-flex flex-column flex-center text-center">
    <h2>What's your next move with this finely-tuned audience?</h2>
    <div class="d-flex flex-center gap mt-8">
      <button class="large-btn" @click="gatherWallets">
        <Indicator v-if="loading" />

        <span v-else> Gather all those wallet addresses! </span>
      </button>
      <button class="large-btn" disabled>Let's launch a survey!</button>
    </div>
    <div class="d-flex align-center justify-space-between mt-6">
      <h4>Price</h4>

      <h4>{{ price }} Coin</h4>
    </div>
  </div>
</template>

<script setup>
import WalletsList from "@/components/client/wallets-list.vue";
// import { useFHEVM } from "@/composables/FHEVM";
import { useFHEVM } from "@/composables/FHEVM-ethers";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import Indicator from "../indicator.vue";
import { useRouter } from "vue-router";

const emits = defineEmits(["update:step"]);

const store = useStore();
const toaster = useToast();

const fhevm = useFHEVM();

const loading = ref(false);

const price = computed(() =>
  (
    1 * Object.values(store.state.answers).filter((val) => val != 2).length
  ).toFixed(0)
);

const gatherWallets = async () => {
  loading.value = true;
  try {
    // console.log(await fhevm.addToMap("2", "1"););
    const selectedQuestionCID = Object.keys(store.state.answers).find(
      (CID) => store.state.answers[CID] != 2
    );
    await fhevm.calculateQueryWallet(
      selectedQuestionCID,
      store.state.answers[selectedQuestionCID].toString()
    );
    const wallets = await fhevm.returnWallets();
    store.commit("setWalletLists", { walletsList: wallets });
    emits("update:step", WalletsList);
    console.log("wallets", wallets, wallets.value);
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
    toaster.error(error ?? "something went wrong");
  }
};
</script>

<style></style>
