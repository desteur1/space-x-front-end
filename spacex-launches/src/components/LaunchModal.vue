<template>
  <main>
    <!-- modal Overlay , close  modal if we click out of the content -->
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <button class="close-btn" @click="close">X</button>
        <h2>{{ launch.name }}</h2>
        <p><strong>Date :</strong>{{ formatedDate }}</p>
        <p>
          <strong>Details :</strong>{{ launch.details || "No details found" }}
        </p>

        <!-- display launchpad if available -->
        <img
          v-if="launch.links?.patch?.small"
          :src="launch.links.patch.small"
          alt="Patch image"
          style="max-width: 150px; margin-bottom: 1rem"
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
          <div v-if="showVideo">
            <!--display iframe youtube video if youtubeID is available -->
            <iframe
              v-if="youtubeID"
              :src="`https://www.youtube.com/embed/${youtubeID}`"
              frameborder="0"
              allowfullscreen
              style="width: 100%; height: 315px"
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

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import type { Launch, payload, Launchpad } from "../types/spacex";
import { fetchPayloadById, fetchLaunchpadById } from "../types/spacex";

export default defineComponent({
  name: "LaunchModal",
  // Declare the awaited props: Launch object with required type
  props: {
    launch: {
      type: Object as () => Launch,
      required: true,
    },
  },
  // Declare the events 'close' to notify the parent component when the modal should be closed
  emits: ["close"],
  setup(props, { emit }) {
    // Reactive variables to store payloads and launchpad data
    const payloads = ref<payload[]>([]);
    const launchpad = ref<Launchpad | null>(null);
    // Reactive variable to control the visibility of the video
    const showVideo = ref(false);
    // Computed property to format the launch date in French format
    const formatedDate = computed<string>(() => {
      const date = new Date(props.launch.date_utc);
      return date.toLocaleDateString("fr-FR", {
        // day: "2-digit",
        // month: "2-digit",
        // year: "numeric",
      });
    });
    // Computed property to extract the YouTube video ID from the launch links
    const youtubeID = computed(() => {
      const url = props.launch.links?.webcast;
      if (!url) return null;
      const match =
        url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
        url.match(/youtu\.be\/([^?&]+)/);
      return match ? match[1] : null;
    });
    // Functions to load payloads and launchpad data
    const loadPayloads = async () => {
      const ids = props.launch.payloads || [];
      const loadPayloads = await Promise.all(
        ids.map((id) => fetchPayloadById(id))
      );
      payloads.value = loadPayloads;
    };

    // Function to load information about the launchpad
    const loadLaunchpad = async () => {
      if (props.launch.launchpad) {
        launchpad.value = await fetchLaunchpadById(props.launch.launchpad);
      }
    };
    // Function to close the modal and emit the 'close' event
    const close = () => {
      emit("close");
    };
    // reload payloads and launchpad data when the launch prop changes
    watch(
      () => props.launch,
      () => {
        loadPayloads();
        loadLaunchpad();
        showVideo.value = false; // Reset video visibility when launch changes
      },

      { immediate: true }
    );
    // Return reactive variables and functions to the template
    return {
      payloads,
      launchpad,
      showVideo,
      formatedDate,
      youtubeID,
      close,
    };
  },
});
</script>
<style scoped></style>
