<template>
  <div class="expand d-flex flex-column flex-center client">
    <QuestionsPart :questions="questions" />
  </div>
</template>

<script setup>
import QuestionsPart from "@/components/user/questions.vue";

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
</script>

<style scoped>
.client {
  max-width: 50rem;
  width: 100%;
  margin: 16px auto;
}
</style>
