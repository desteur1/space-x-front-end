<template>
  <main class="text-3xl font-bold text-center">
    <h1>SpaceX Launches</h1>
    <section>
      <h2>Prochain Lancement</h2>
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
  </main>
</template>

<style scoped></style>
<script lang="ts">
// Import Vue Composition API functions
import { ref, onMounted } from "vue";
// Import Launch type definition (make sure you have this type defined in your project)
import type { Launch } from "./types/spacex";

export default {
  setup() {
    // Reactive variable to hold the launch data, initially null
    const launch = ref<Launch | null>(null);

    // Reactive variable to hold the countdown in seconds
    const countdown = ref<number>(0);

    // Function to fetch next launch data from the SpaceX API
    const fetchLaunch = async () => {
      // Fetch the next launch JSON data from the API
      const res = await fetch("https://api.spacexdata.com/v4/launches/next");
      // Parse the JSON response and type it as Launch
      const data: Launch = await res.json();
      // Assign fetched launch data to the reactive launch variable
      launch.value = data;

      // Immediately update the countdown using the launch date
      updateCountdown(new Date(data.date_utc));

      // Set up a timer to update the countdown every second (1000ms)
      setInterval(() => updateCountdown(new Date(data.date_utc)), 1000);
    };

    // Function to update countdown based on current time and launch date
    const updateCountdown = (launchDate: Date) => {
      const now = new Date();
      // Calculate difference in seconds between launch date and now, clamp to 0 minimum
      countdown.value = Math.max(
        0,
        Math.floor((launchDate.getTime() - now.getTime()) / 1000)
      );
    };

    // onMounted lifecycle hook runs once when component is mounted to the DOM
    // We use it to start fetching launch data
    onMounted(fetchLaunch);

    // Return the reactive variables so the template can use them
    return {
      launch,
      countdown,
    };
  },
};
</script>
