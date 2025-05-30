<template>
  <section class="text-center mt-8 pb-4">
    <h2 class="text-2xl my-6 text-white">Derniers Lancements</h2>
    <ul>
      <li
        v-for="launch in filteredLaunches"
        :key="launch.name"
        @click="selectLaunch(launch)"
        class="w-full sm:w-2/3 lg:w-1/3 mx-auto mb-4 p-4 border rounded cursor-pointer hover:bg-gray-100 transition-colors duration-500 ease-in-out"
      >
        {{ launch.name }} -{{ new Date(launch.date_utc).toLocaleString() }} -
        <span>
          {{
            launch.success === true
              ? "✅ "
              : launch.success === false
              ? "❌ "
              : "🕖 Inconnu"
          }}
        </span>
      </li>
    </ul>
  </section>
  <section>
    <LaunchModal
      v-if="selectedLaunch"
      :launch="selectedLaunch"
      @close="selectedLaunch = null"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Launch } from "../types/spacex";
import { fetchLastLaunches } from "../types/spacex";
import LaunchModal from "./LaunchModal.vue";

// Déclare la prop 'filter'
const props = defineProps<{ filter: string }>();

// Variables réactives
const launches = ref<Launch[]>([]);
const selectedLaunch = ref<Launch | null>(null);

// Récupère les 200 derniers lancements au montage
onMounted(async () => {
  launches.value = await fetchLastLaunches(200);
});

// Calcule les 10 derniers lancements filtrés selon la prop 'filter'

const filteredLaunches = computed(() => {
  let filtered = launches.value;
  if (props.filter === "success") {
    filtered = filtered.filter((launch) => launch.success === true);
  } else if (props.filter === "failed") {
    filtered = filtered.filter((launch) => launch.success === false);
  }
  return filtered.slice(0, 10);
});

// Fonction pour ouvrir le modal
function selectLaunch(launch: Launch) {
  selectedLaunch.value = launch;
}
</script>

<style scoped></style>
