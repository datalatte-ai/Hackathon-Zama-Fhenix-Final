<template>
  <div class="floodgates">
    <h3 class="mb-8">
      Hold onto your coffee cups! We're still brewing that one. For now, I can
      give you a % of the population that matches your filter!
    </h3>
    <questions-bar :questions="questions" />
    <hr />
    <div class="d-flex align-center justify-space-between mt-3">
      <h4>Price</h4>

      <h4>{{ price }} Coin</h4>
    </div>

    <div class="d-flex flex-center mt-4">
      <button class="large-btn text-center" :disabled="loading" @click="pay">
        <indicator v-if="loading" />
        <span v-else> Query & Pay </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import QuestionsBar from "@/components/questions-bar.vue";
import { useFHEVM } from "@/composables/FHEVM-ethers";
import { computed, inject, ref } from "vue";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import Indicator from "../indicator.vue";

const store = useStore();
const toaster = useToast();

const fhevm = useFHEVM();

const loading = ref(false);

const questions = inject("questions");

const price = computed(() =>
  (
    0.1 * Object.values(store.state.answers).filter((val) => val != 2).length
  ).toFixed(1)
);

const pay = async () => {
  loading.value = true;
  try {
    const selectedQuestionCID = Object.keys(store.state.answers).find(
      (CID) => store.state.answers[CID] != 2
    );
    const receipt = await fhevm.calculateQueryAnswer(
      selectedQuestionCID,
      store.state.answers[selectedQuestionCID].toString()
    );
    console.log("calculateQueryAnswer", receipt);
    const count = await fhevm.returnCountAnswer();
    console.log("count", count);
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
    toaster.error(error ?? "something went wrong");
  }
};
</script>

<style scoped lang="scss">
.floodgates {
  max-width: 50rem;
  width: 100%;
  margin: 16px auto;
}
</style>
