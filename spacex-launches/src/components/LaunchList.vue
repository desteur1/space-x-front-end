<template>
  <select v-model="filter">
    <option value="all">Tous les Lancements</option>
    <option value="success">Lancements réussis</option>
    <option value="failed">Lancement échoués</option>
  </select>
  <h3>Liste des Lancements</h3>
  <ul>
    <li v-for="launch in filteredLaunches" :key="launch.name">
      {{ launch.name }}
      <span v-if="launch.success">✅</span>
      <span v-if="launch.success === false">❌</span>
      <!-- <span v-else>⏳</span> -->
    </li>
  </ul>
</template>
<script lang="ts">
import type { Launch } from "../types/spacex";

import { fetchAllLaunches } from "../types/spacex";
import { ref, computed, onMounted } from "vue";
export default {
  name: "LaunchList",

  setup() {
    const launches = ref<Launch[]>([]);
    const filter = ref("all");
    const fetchLaunches = async () => {
      launches.value = await fetchAllLaunches();
    };
    const filteredLaunches = computed(() => {
      if (filter.value === "success")
        return launches.value.filter((launch) => launch.success);
      if (filter.value === "failed")
        return launches.value.filter((launch) => launch.success === false);
      return launches.value;
    });

    onMounted(fetchLaunches);
    return { filter, filteredLaunches };
  },
};
</script>
<style scoped></style>
