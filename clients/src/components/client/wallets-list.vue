<template>
  <div class="floodgates">
    <h3>
      Voila! And just you wait - we're brewing up a way for you to target them
      in a cooler, less intrusive manner. Privacy-preserved targeting is on the
      horizon!
    </h3>
    <hr class="my-3" />

    <div class="wallets-list text-center pa-3 mb-3">
      <h4>Wallets</h4>
      <div class="mt-3">
        <h5
          v-for="(wallet, i) in $store.state.walletsList"
          :key="'w' + i"
          class="my-1"
        >
          {{ wallet }}
        </h5>
      </div>
    </div>

    <div class="d-flex flex-center mt-4">
      <button
        class="large-btn text-center"
        @click="$emit('update:step', HelpType)"
      >
        Home
      </button>
    </div>
  </div>
</template>

<script setup>
import HelpType from "@/components/client/help-type.vue";
import QuestionsBar from "@/components/questions-bar.vue";
import { computed, inject } from "vue";
import { useStore } from "vuex";

const store = useStore();

const questions = inject("questions");

const price = computed(() =>
  (
    0.1 * Object.values(store.state.answers).filter((val) => val != 2).length
  ).toFixed(1)
);
</script>

<style scoped lang="scss">
.floodgates {
  max-width: 50rem;
  width: 100%;
  margin: 16px auto;
}

.wallets-list {
  border: solid black;
  border-radius: 2rem;
  border-width: 1px 2px 2px 1px;
}
</style>
