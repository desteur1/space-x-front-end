<template>
  <section class="text-center mt-8 pb-4">
    <h2 class="text-2xl my-6 text-white">Derniers Lancements</h2>
    <ul>
      <!-- Boucle sur les lancements filtrés et affiche chaque lancement -->
      <li
        v-for="launch in filteredLaunches"
        :key="launch.name"
        @click="selectLaunch(launch)"
        class="w-full sm:w-2/3 lg:w-1/3 mx-auto mb-4 p-4 border rounded cursor-pointer hover:bg-gray-100 transition-colors duration-500 ease-in-out"
      >
        {{ launch.name }} -{{ new Date(launch.date_utc).toLocaleString() }} -
        <span>{{
          launch.success === true
            ? "✅ "
            : launch.success === false
            ? "❌ "
            : "🕖 Inconnu"
        }}</span>
      </li>
    </ul>
  </section>
  <section>
    <!--modal affichant les détails d'un lancement sélectionné -->
    <LaunchModal
      v-if="selectedLaunch"
      :launch="selectedLaunch"
      @close="selectedLaunch = null"
    />
  </section>
</template>
<script lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Launch } from "../types/spacex";
import { fetchLastLaunches } from "../types/spacex";
import LaunchModal from "./LaunchModal.vue";

export default {
  name: "LastLaunch",
  components: {
    LaunchModal, // Déclare le composant enfant pour afficher les détails d'un lancement
  },
  // Déclare la prop 'filter' attendue depuis le parent
  props: {
    filter: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // Variable réactive pour stocker tous les lancements récupérés
    const launches = ref<Launch[]>([]);
    // Variable réactive pour le lancement sélectionné (pour le modal)
    const selectedLaunch = ref<Launch | null>(null);

    // Au montage du composant, récupère les 200 derniers lancements
    onMounted(async () => {
      launches.value = await fetchLastLaunches(200);
    });

    // Calcule les 10 derniers lancements filtrés selon la prop 'filter'
    const filteredLaunches = computed(() => {
      let filtered = launches.value;

      // Si le filtre est "success", ne garde que les lancements réussis
      if (props.filter === "success") {
        filtered = filtered.filter((launch) => launch.success === true);

        // Si le filtre est "failed", ne garde que les lancements échoués
      } else if (props.filter === "failed") {
        filtered = filtered.filter((launch) => launch.success === false);
      }
      return filtered.slice(0, 10);
    });
    // Fonction appelée lors du clic sur un lancement pour ouvrir le modal
    const selectLaunch = (launch: Launch) => {
      selectedLaunch.value = launch;
    };

    // Rend la liste filtrée disponible dans le template
    return {
      filteredLaunches,
      selectLaunch,
      selectedLaunch,
    };
  },
};
</script>
<style scoped></style>
