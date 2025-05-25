<template>
  <section>
    <h2>Derniers Lancements</h2>
    <ul>
      <!-- Boucle sur les lancements filtrés et affiche chaque lancement -->
      <li v-for="launch in filteredLaunches" :key="launch.name">
        {{ launch.name }} -{{ new Date(launch.date_utc).toLocaleString() }} -
        <span>{{
          launch.success === true
            ? "✅ Réussi"
            : launch.success === false
            ? "❌ Échec"
            : "🕖 Inconnu"
        }}</span>
      </li>
    </ul>
  </section>
</template>
<script lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Launch } from "../types/spacex";
import { fetchLastLaunches } from "../types/spacex";

export default {
  name: "LastLaunch",
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

    // Rend la liste filtrée disponible dans le template
    return {
      filteredLaunches,
    };
  },
};
</script>
<style scoped></style>
