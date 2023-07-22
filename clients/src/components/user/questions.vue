<template>
  <div class="expand d-flex flex-column flex-center text-center">
    <h2>{{ randomOrderQuestions[step].title }}</h2>
    <div class="d-flex flex-center gap mt-8">
      <button
        v-for="(answer, j) in randomOrderQuestions[step].answers"
        :key="'a' + j"
        class="large-btn"
        :disabled="disabled"
        @click="updateAnswer(randomOrderQuestions[step].CID, j)"
      >
        <indicator v-if="loading" />
        <span v-else> {{ answer }} </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFHEVM } from "@/composables/FHEVM-ethers";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import Indicator from "../indicator.vue";

const store = useStore();
const toaster = useToast();
const router = useRouter();

const fhevm = useFHEVM();

const step = ref(0);

const loading = ref(false);

const props = defineProps({
  questions: Array,
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:answer"]);

function shuffleArray(inputArray) {
  let array = [...inputArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const randomOrderQuestions = computed(() => shuffleArray(props.questions));

const updateAnswer = async (CID, answer) => {
  loading.value = true;
  try {
    const receipt = await fhevm.addToMap(CID, answer);
    console.log("receipt", receipt);
    loading.value = false;
    if (receipt.status == 1) {
      if (step.value < props.questions.length - 1) step.value += 1;
      else router.push("/");
    } else throw "You have already answered the question";
  } catch (error) {
    console.log(error);
    loading.value = false;
    toaster.error(error || "something went wrong");
  }
};
</script>
