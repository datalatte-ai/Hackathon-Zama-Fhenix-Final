<template>
  <div class="expand d-flex flex-column flex-center text-center">
    <h2>How can I help you?</h2>
    <div class="d-flex flex-center gap mt-8">
      <button class="large-btn" @click="$emit('update:step', FindAudience)">
        Find my target audience
      </button>
      <button class="large-btn" @click="$emit('update:step', Floodgates)">
        Open the floodgates of knowledge!
      </button>
    </div>
  </div>
</template>

<script setup>
import FindAudience from "@/components/client/find-audience.vue";
import Floodgates from "@/components/client/floodgates.vue";
defineEmits(["update:step"]);
</script>

<style></style>
