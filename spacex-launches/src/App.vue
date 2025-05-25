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
    <section>
      <h2>Liste Des Lancements</h2>
      <LaunchList />
    </section>
  </main>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import type { Launch } from "./types/spacex";
import { fetchNextLaunch } from "./types/spacex";
import LaunchList from "./components/LaunchList.vue";

export default {
  components: {
    LaunchList,
  },
  setup() {
    // Reactive variable to hold the launch data, initially null
    const launch = ref<Launch | null>(null);

    // Reactive variable to hold the countdown in seconds
    const countdown = ref<number>(0);

    // Function to update countdown based on current time and launch date
    const updateCountdown = (launchDate: Date) => {
      const now = new Date();
      // Calculate difference in seconds between launch date and now, clamp to 0 minimum
      countdown.value = Math.max(
        0,
        Math.floor((launchDate.getTime() - now.getTime()) / 1000)
      );
    };
    const fetchLaunch = async () => {
      launch.value = await fetchNextLaunch();
      updateCountdown(new Date(launch.value.date_utc));
      // toutes les 1000 millisecondes(secondes), la fonction updateCountdown est appelée pour mettre à jour le compte à rebours
      setInterval(
        () => updateCountdown(new Date(launch.value!.date_utc)),
        1000
      ); // Le point d'exclamation (!) est utilisé pour indiquer à TypeScript que launch.value n'est pas null ici
    };

    // Fetch the next launch data when the component is mounted(displayed in the browser)
    onMounted(fetchLaunch);

    // Return the reactive variables so the template can use them
    return {
      launch,
      countdown,
    };
  },
};
</script>

<style scoped></style>
