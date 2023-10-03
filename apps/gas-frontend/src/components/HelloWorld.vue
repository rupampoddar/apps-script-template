<script setup lang="ts">
import { ref } from "vue";

// These 2 lines are needed to call apps-script (`gas-backend`) functions
import server from "../lib/server";
const { serverFunctions } = server;

defineProps<{ msg: string }>();
const count = ref(0);

//
// Example: fetch data from apps script
//
const jsonData = ref<null | string>(null);
const isLoading = ref(false);
const fetchData = async () => {
  try {
    isLoading.value = true;
    // Call the `gas-backend` function (see `gas-backend/src/index.ts`)
    const data = await serverFunctions.getData();
    console.log(data);
    jsonData.value = JSON.stringify(data, null, 2);
  } catch (e) {
    console.error("Error fetching data:", e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <div class="card">
    <button type="button" @click="fetchData" :disabled="isLoading">
      {{ isLoading ? "Loading..." : "Fetch Data from Apps-Script" }}
    </button>
    <pre>{{ jsonData }}</pre>

  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
pre {
  text-align: left;
}
</style>
