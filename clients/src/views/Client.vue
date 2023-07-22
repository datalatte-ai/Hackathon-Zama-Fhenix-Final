<template>
  <div class="expand d-flex flex-column flex-center client">
    <component :is="step" @update:step="updateStep" />
  </div>
</template>

<script setup>
import { onMounted, provide, ref } from "vue";
import HelpType from "@/components/client/help-type.vue";
import { useStore } from "vuex";

const store = useStore();

const step = ref(HelpType);

const questions = [
  {
    CID: "1",
    title: "Do you like coffee?",
    answers: ["No", "Yes"],
  },
  {
    CID: "2",
    title: "Do you believe pineapple belongs on pizza??",
    answers: ["No", "Yes"],
  },
  {
    CID: "3",
    title: "Is there any bad time for a good joke?",
    answers: ["No", "Yes"],
  },
  {
    CID: "4",
    title: "If you had to pick a pet, which you choose?",
    answers: ["Cat", "Dog"],
  },
];
provide("questions", questions);

onMounted(() => {
  store.commit("setInitAnswers", { questions });
});

const updateStep = (component) => {
  step.value = component;
};
</script>

<style scoped>
.client {
  max-width: 50rem;
  width: 100%;
  margin: 16px auto;
}
</style>
