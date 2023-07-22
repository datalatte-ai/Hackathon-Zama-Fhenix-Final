<template>
  <div class="find-audience">
    <questions-bar :questions="questions" />
    <hr />
    <div class="d-flex align-center justify-space-between mt-3">
      <h4>Price</h4>

      <h4>{{ price }} Coin</h4>
    </div>

    <div class="d-flex flex-center mt-4">
      <button
        class="large-btn text-center"
        @click="$emit('update:step', NextMove)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import QuestionsBar from "@/components/questions-bar.vue";
import NextMove from "@/components/client/next-move.vue";
import { computed, inject } from "vue";
import { useStore } from "vuex";

const store = useStore();

const questions = inject("questions");

const price = computed(() =>
  (
    1 * Object.values(store.state.answers).filter((val) => val != 2).length
  ).toFixed(0)
);
</script>

<style scoped lang="scss">
.find-audience {
  max-width: 50rem;
  width: 100%;
  margin: 16px auto;
}
</style>
