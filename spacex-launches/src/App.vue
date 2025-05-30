<template>
  <main class="mx-4 px-4 bg-blue-500">
    <h1 class="text-center text-4xl py-4 text-white">SpaceX Launches</h1>
    <section class="text-center">
      <h2 class="text-2xl my-6 text-white">Prochain Lancement</h2>
      <div v-if="launch">
        <h2>{{ launch.name }}</h2>
        <p>{{ new Date(launch.date_utc).toUTCString() }}</p>
        <p>{{ countdown }} seconds</p>
        <p v-if="countdown === 0">🚀🚀 Launched!</p>
      </div>
      <div v-else>
        <p>Aucun lancement à venir trouvé.</p>
      </div>
    </section>
    <section>
      <h2 class="text-center text-2xl my-8 text-white">Liste Des Lancements</h2>
      <LaunchList />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Launch } from "./types/spacex";
import { fetchNextLaunch } from "./types/spacex";
import LaunchList from "./components/LaunchList.vue";

// Reactive variable to hold the launch data, initially null
const launch = ref<Launch | null>(null);

// Reactive variable to hold the countdown in seconds
const countdown = ref<number>(0);

// Function to update countdown based on current time and launch date
const updateCountdown = (launchDate: Date) => {
  const now = new Date();
  countdown.value = Math.max(
    0,
    Math.floor((launchDate.getTime() - now.getTime()) / 1000)
  );
};

const fetchLaunch = async () => {
  launch.value = await fetchNextLaunch();
  updateCountdown(new Date(launch.value.date_utc));
  setInterval(() => updateCountdown(new Date(launch.value!.date_utc)), 1000);
};

onMounted(fetchLaunch);
</script>

<style scoped>
/* h1 {
  color: red;
} */
</style>
