<template>
  <div class="debug-info">
    <h4>🔧 Map Debug Info</h4>
    <div class="debug-item">
      <span class="debug-label">API Key:</span>
      <span class="debug-value">{{ hasApiKey ? "✅ Present" : "❌ Missing" }}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Map Container:</span>
      <span class="debug-value">{{ containerStatus }}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Google Maps Loaded:</span>
      <span class="debug-value">{{ googleMapsLoaded ? "✅ Yes" : "❌ No" }}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Customers Count:</span>
      <span class="debug-value">{{ customersCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useCustomersStore } from "@/stores/customers";

const props = defineProps<{
  mapContainer: HTMLElement | undefined;
  loading: boolean;
  error: string | null;
}>();

const customersStore = useCustomersStore();

const hasApiKey = computed(() => !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
const googleMapsLoaded = computed(() => !!(window as any).google);
const customersCount = computed(() => customersStore.customers.length);

const containerStatus = computed(() => {
  if (props.mapContainer) {
    return "✅ Available";
  } else if (props.loading) {
    return "⏳ Loading...";
  } else if (props.error) {
    return "❌ Error";
  } else {
    return "❓ Not Found";
  }
});

// Watch for changes
watch(
  () => props.mapContainer,
  (newVal) => {
    console.log("🔧 Map container changed:", newVal ? "Available" : "Not available");
  }
);

onMounted(() => {
  console.log("🔧 Debug component mounted");
  console.log("🔧 Initial container status:", props.mapContainer ? "Available" : "Not available");
});
</script>

<style scoped>
.debug-info {
  position: fixed;
  top: 80px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.75rem;
  z-index: 9999;
  min-width: 200px;
}

.debug-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.debug-label {
  opacity: 0.8;
}

.debug-value {
  font-weight: bold;
}
</style>
