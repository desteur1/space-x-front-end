<template>
  <!-- Sélecteur pour filtrer les lancements -->
  <select v-model="filter" class="mb-4 bg-gray-100 p-2 rounded">
    <option value="all">Tous Lancements</option>
    <option value="success">Lancements Réussis</option>
    <option value="failed">Lancement Échoués</option>
  </select>
  <!-- Liste des lancements filtrés -->
  <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-center gap-4">
    <li
      v-for="launch in filteredLaunches"
      :key="launch.name"
      @click="selectLaunch(launch)"
      class="border rounded p-4 cursor-pointer hover:bg-gray-100 transition-colors"
    >
      {{ launch.name }}
      <span v-if="launch.success">✅</span>
      <span v-if="launch.success === false">❌</span>
    </li>
  </ul>
  <!-- Composant enfant qui reçoit la prop 'filter' pour afficher les 10 derniers lancements filtrés -->
  <LastLaunch :filter="filter" />

  <!-- Modal affichant les détails d'un lancement sélectionné -->
  <LaunchModal
    v-if="selectedLaunch"
    :launch="selectedLaunch"
    @close="selectedLaunch = null"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Launch } from "../types/spacex";
import { fetchAllLaunches } from "../types/spacex";
import LastLaunch from "./LastLaunch.vue";
import LaunchModal from "./LaunchModal.vue";

// Variables réactives
const launches = ref<Launch[]>([]);
const filter = ref("all");
const selectedLaunch = ref<Launch | null>(null);

// Fonction pour charger tous les lancements depuis l'API
const fetchLaunches = async () => {
  launches.value = await fetchAllLaunches();
};

// Fonction appelée lors du clic sur un lancement pour ouvrir le modal
const selectLaunch = (launch: Launch) => {
  selectedLaunch.value = launch;
};

// Liste filtrée selon la valeur du filtre
const filteredLaunches = computed(() => {
  if (filter.value === "success")
    return launches.value.filter((launch) => launch.success === true);
  if (filter.value === "failed")
    return launches.value.filter((launch) => launch.success === false);
  return launches.value;
});

// Appel de la fonction fetchLaunches dès que le composant est affiché à l’écran
onMounted(fetchLaunches);
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
.launch-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
