<template>
  <div
    v-for="(question, i) in questions"
    :key="'q' + i"
    class="d-flex align-center my-2"
  >
    <h3 class="flex-1">
      {{ question.title }}
    </h3>

    <div class="d-flex flex-1 justify-space-between">
      <button
        v-for="(answer, j) in question.answers"
        :key="'a' + j"
        class="medium-btn"
        :class="{
          'fill-btn':
            question.CID in $store.state.answers &&
            $store.state.answers[question.CID] === j,
        }"
        :disabled="disabled"
        @click="updateAnswer(question.CID, j)"
      >
        {{ answer }}
      </button>
      <button
        class="medium-btn"
        :class="{ 'fill-btn': $store.state.answers[question.CID] == 2 }"
        :disabled="disabled"
        @click="updateAnswer(question.CID, 2)"
      >
        Don't Care
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  questions: Array,
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:answer"]);

// function shuffleArray(inputArray) {
//   let array = [...inputArray];
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// const randomOrderQuestions = computed(() => shuffleArray(props.questions));

const updateAnswer = (CID, answer) => {
  store.commit("setAnswer", { CID, answer });
  console.log(CID, answer, store.state.answers);
};
</script>
