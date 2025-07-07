<template>
  <div class="space-y-4">
    <!-- Platform Check -->
    <div v-if="!isSupported" class="text-center py-8">
      <div class="text-gray-500 mb-4">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        Device contacts are only available on mobile devices
      </div>
      <p class="text-sm text-gray-400">
        This feature requires a mobile device with contact access permissions
      </p>
    </div>

    <!-- Contacts Feature Info -->
    <div v-else class="text-center py-8">
      <div class="text-gray-500 mb-4">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.196-2.121M13 7a4 4 0 11-8 0 4 4 0 018 0zM5 20h8v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2z"
          />
        </svg>
        Device Contacts Import
      </div>
      <p class="text-sm text-gray-600 mb-4">
        Import contacts directly from your device's contact list
      </p>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-blue-800">
          <strong>Note:</strong> This feature requires building a native app with proper contact
          permissions. It's not available in the web preview.
        </p>
      </div>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-sm text-yellow-800">
          <strong>Coming Soon:</strong> Device contacts import will be available in the next update.
          For now, please use the CSV import feature to add multiple customers.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Capacitor } from "@capacitor/core";

interface Emits {
  (e: "close"): void;
  (e: "success", count: number): void;
}

defineEmits<Emits>();

// Check if platform supports contacts
const isSupported = computed(() => {
  return Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android";
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
