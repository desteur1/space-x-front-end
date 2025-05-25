<template>
  <!-- Sélecteur pour filtrer les lancements -->
  <select v-model="filter">
    <option value="all">Tous Lancements</option>
    <option value="success">Lancements Réussis</option>
    <option value="failed">Lancement Échoués</option>
  </select>
  <!-- Liste des lancements filtrés -->
  <ul>
    <!-- Boucle sur chaque lancement filtré -->
    <li v-for="launch in filteredLaunches" :key="launch.name">
      {{ launch.name }}
      <span v-if="launch.success">✅</span>
      <span v-if="launch.success === false">❌</span>
    </li>
  </ul>
  <!-- Composant enfant qui reçoit la prop 'filter' pour afficher les 10 derniers lancements filtrés -->
  <LastLaunch :filter="filter" />
</template>
<script lang="ts">
import type { Launch } from "../types/spacex";
import LastLaunch from "./LastLaunch.vue";

import { fetchAllLaunches } from "../types/spacex";
import { ref, computed, onMounted } from "vue";

export default {
  name: "LaunchList",
  components: {
    LastLaunch, // Déclare le composant enfant
  },

  setup() {
    // Variable réactive pour stocker tous les lancements
    const launches = ref<Launch[]>([]);
    // Variable réactive pour le filtre sélectionné
    const filter = ref("all");

    // Fonction pour charger tous les lancements depuis l'API
    const fetchLaunches = async () => {
      launches.value = await fetchAllLaunches();
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

    // Rend les variables et fonctions accessibles dans le template
    return { filter, filteredLaunches };
  },
};
</script>
<style scoped></style>
