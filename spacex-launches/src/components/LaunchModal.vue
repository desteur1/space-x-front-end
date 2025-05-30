<template>
  <main>
    <!-- modal Overlay , close  modal if we click out of the content -->
    <div class="modal-overlay" @click.self="close">
      <div class="text-center modal-content">
        <button class="close-btn text-red-600" @click="close">X</button>
        <h2 class="text-xl">{{ launch.name }}</h2>
        <p><strong>Date :</strong>{{ formatedDate }}</p>
        <p>
          <strong>Details :</strong>{{ launch.details || "No details found" }}
        </p>

        <!-- display launchpad if available -->
        <img
          v-if="launch.links?.patch?.small"
          :src="launch.links.patch.small"
          alt="Patch image"
          class="img-modal"
        />
        <!-- links to official article  if available -->
        <p v-if="launch.links?.article">
          <a :href="launch.links.article" target="_blank" rel="noopener">
            Official article</a
          >
        </p>
        <div>
          <h3>payloads</h3>

          <!-- checkbox to display/hide video -->
          <label>
            <input type="checkbox" v-model="showVideo" />
            Display video
          </label>
          <!-- display youtube video if showVideo is true(clicked) -->
          <div v-if="showVideo" class="video-container">
            <!--display iframe youtube video if youtubeID is available -->
            <iframe
              v-if="youtubeID"
              :src="`https://www.youtube.com/embed/${youtubeID}`"
              frameborder="0"
              allowfullscreen
              class="w-full mb-4 h-[315px]"
            ></iframe>
            <p v-else>No video available</p>
          </div>

          <!-- launch-site name (or "Loading..." if not yet load) -->
          <p>
            <strong>Launch site :</strong
            >{{ launchpad?.name || "Loading......" }}
          </p>
          <!-- lists of payloads associated with the launch -->

          <ul>
            <li v-for="p in payloads" :key="p.id">
              Loading payloads: {{ p.name }} <br />
              <br />
              Clients: {{ p.customers?.join(", ") }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// Importation des fonctions et types nécessaires de Vue et de l'API SpaceX
import { ref, watch, computed } from "vue";
import type { Launch, Payload, Launchpad } from "../types/spacex";
import { fetchPayloadById, fetchLaunchpadById } from "../types/spacex";

// Déclare la prop 'launch' reçue du parent
const props = defineProps<{ launch: Launch }>();

// Déclare l'événement 'close' pour fermer la modale
const emit = defineEmits<{
  (e: "close"): void;
}>();

// Variable réactive pour stocker les payloads associés au lancement
const payloads = ref<Payload[]>([]);
// Variable réactive pour stocker les infos du launchpad
const launchpad = ref<Launchpad | null>(null);
// Variable réactive pour afficher/masquer la vidéo
const showVideo = ref(false);

// Propriété calculée pour formater la date du lancement en français
const formatedDate = computed(() => {
  const date = new Date(props.launch.date_utc);
  return date.toLocaleDateString("fr-FR");
});

// Propriété calculée pour extraire l'ID YouTube de la vidéo du lancement
const youtubeID = computed(() => {
  const url = props.launch.links?.webcast;
  if (!url) return null;
  const match =
    url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?&]+)/);
  return match ? match[1] : null;
});

// Fonction pour charger les payloads associés au lancement
const loadPayloads = async () => {
  const ids = props.launch.Payload || [];
  const loaded = await Promise.all(ids.map((id) => fetchPayloadById(id)));
  payloads.value = loaded;
};

// Fonction pour charger les infos du launchpad
const loadLaunchpad = async () => {
  if (props.launch.launchpad) {
    launchpad.value = await fetchLaunchpadById(props.launch.launchpad);
  }
};

// Fonction pour fermer la modale (émet l'événement 'close')
function close() {
  emit("close");
}

// Recharge les données payloads/launchpad à chaque changement de lancement
watch(
  () => props.launch,
  () => {
    loadPayloads();
    loadLaunchpad();
    showVideo.value = false; // Réinitialise l'affichage de la vidéo
  },
  { immediate: true }
);
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 2rem;
  max-width: 700px;
  width: 90%;
  border-radius: 8px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto; /* Allow scrolling if content overflows */
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-weight: bold;
  padding-right: 1rem;
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.6;
}
.close-btn:hover {
  opacity: 1;
}
.img-modal {
  max-width: 150px;
  margin: auto;
  padding: 1rem 0;
}

.video-container {
  margin-top: 1rem;
  text-align: center;
}
</style>
