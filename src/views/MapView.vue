<template>
  <div class="map-view">
    <!-- Header -->
    <div class="map-header">
      <div class="header-content">
        <div class="header-title">
          <h1 class="page-title">
            <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Customer Map
          </h1>
          <p class="page-description">View all customer locations on an interactive map</p>
        </div>
        <div class="header-actions">
          <button @click="centerMap" class="action-btn" :disabled="!mapLoaded">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            Center Map
          </button>
          <router-link to="/customers" class="action-btn secondary">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Customer List
          </router-link>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="map-container">
      <!-- Google Maps API Not Available -->
      <div v-if="!googleMapsApiKey" class="map-unavailable">
        <div class="unavailable-content">
          <svg class="unavailable-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="unavailable-title">Google Maps Not Available</h3>
          <p class="unavailable-message">
            Google Maps API key is not configured. Please add
            <code>VITE_GOOGLE_MAPS_API_KEY</code> to your environment variables.
          </p>
          <div class="unavailable-help">
            <p class="help-text">Get your API key from:</p>
            <a
              href="https://console.cloud.google.com/google/maps-apis"
              target="_blank"
              class="help-link"
            >
              Google Cloud Console → Maps API
            </a>
          </div>
        </div>
      </div>

      <!-- Map Wrapper - Always present when API key is available -->
      <div v-else class="map-wrapper">
        <!-- Loading overlay -->
        <div v-if="loading" class="map-loading-overlay">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading customer locations...</p>
          </div>
        </div>

        <!-- Error overlay -->
        <div v-if="error" class="map-error-overlay">
          <div class="error-content">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 class="error-title">Failed to Load Map</h3>
            <p class="error-message">{{ error }}</p>
            <button @click="initializeMap" class="error-retry-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </button>
          </div>
        </div>

        <!-- Map container - always present when API key is available -->
        <div ref="mapContainer" class="google-map"></div>

        <!-- Map Stats -->
        <div v-if="mapLoaded" class="map-stats">
          <div class="stat-item">
            <span class="stat-label">Total Customers:</span>
            <span class="stat-value">{{ totalCustomers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">On Map:</span>
            <span class="stat-value">{{ customersWithCoordinates }}</span>
          </div>
          <div v-if="customersWithoutCoordinates > 0" class="stat-item warning">
            <span class="stat-label">Missing Location:</span>
            <span class="stat-value">{{ customersWithoutCoordinates }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Info Panel (when marker is selected) -->
    <transition name="slide-up">
      <div v-if="selectedCustomer" class="customer-info-panel">
        <div class="panel-header">
          <div class="customer-avatar">
            <span class="customer-initials">
              {{ getCustomerInitials(selectedCustomer) }}
            </span>
          </div>
          <div class="customer-details">
            <h3 class="customer-name">{{ getCustomerFullName(selectedCustomer) }}</h3>
            <p class="customer-phone">{{ selectedCustomer.phone }}</p>
          </div>
          <button @click="closeCustomerPanel" class="panel-close-btn">
            <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="panel-content">
          <div class="customer-address">
            <svg class="address-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <span>{{ selectedCustomer.address }}</span>
          </div>
          <div class="panel-actions">
            <button @click="callCustomer(selectedCustomer)" class="panel-action-btn primary">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call
            </button>
            <button @click="getDirections(selectedCustomer)" class="panel-action-btn secondary">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Directions
            </button>
            <router-link :to="`/customers/${selectedCustomer.id}`" class="panel-action-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useCustomersStore } from "@/stores/customers";
import type { Customer } from "@/lib/supabase";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const customersStore = useCustomersStore();

// Component state
const mapContainer = ref<HTMLElement>();
const googleMap = ref<any>(null);
const mapLoaded = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedCustomer = ref<Customer | null>(null);
const markers = ref<any[]>([]);

// Configuration
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Computed properties
const customers = computed(() => customersStore.customers);
const totalCustomers = computed(() => customers.value.length);

const customersWithCoordinates = computed(() => {
  return customers.value.filter(
    (customer) => customer.latitude != null && customer.longitude != null
  ).length;
});

const customersWithoutCoordinates = computed(() => {
  return totalCustomers.value - customersWithCoordinates.value;
});

// Default map center (US center)
const defaultCenter = { lat: 39.8283, lng: -98.5795 };

// Methods
const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps API"));

    document.head.appendChild(script);
  });
};

const initializeMap = async () => {
  if (!googleMapsApiKey) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    await loadGoogleMapsScript();

    // Wait for DOM to be ready
    await nextTick();

    // Ensure map container exists
    if (!mapContainer.value) {
      throw new Error("Map container not found - DOM not ready");
    }

    // Create map
    googleMap.value = new window.google.maps.Map(mapContainer.value, {
      zoom: 6,
      center: defaultCenter,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    mapLoaded.value = true;
    await addCustomerMarkers();
  } catch (err) {
    console.error("Error initializing map:", err);
    error.value = err instanceof Error ? err.message : "Failed to initialize map";
  } finally {
    loading.value = false;
  }
};

const addCustomerMarkers = async () => {
  if (!googleMap.value || !window.google) return;

  // Clear existing markers
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];

  const bounds = new window.google.maps.LatLngBounds();
  let hasValidCoordinates = false;

  // Performance optimization: For large datasets, use smaller markers and batch processing
  const isLargeDataset = customers.value.length > 50;
  const batchSize = isLargeDataset ? 20 : customers.value.length;

  const addMarkersBatch = (startIndex: number) => {
    const endIndex = Math.min(startIndex + batchSize, customers.value.length);

    for (let i = startIndex; i < endIndex; i++) {
      const customer = customers.value[i];
      if (customer.latitude != null && customer.longitude != null) {
        const position = {
          lat: Number(customer.latitude),
          lng: Number(customer.longitude),
        };

        const marker = new window.google.maps.Marker({
          position,
          map: googleMap.value,
          title: `${customer.first_name} ${customer.last_name}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: isLargeDataset ? 6 : 8, // Smaller markers for large datasets
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });

        // Add click listener
        marker.addListener("click", () => {
          selectedCustomer.value = customer;
          googleMap.value.panTo(position);
        });

        markers.value.push(marker);
        bounds.extend(position);
        hasValidCoordinates = true;
      }
    }

    // Process next batch if there are more markers
    if (endIndex < customers.value.length) {
      // Use setTimeout to prevent blocking the UI
      setTimeout(() => addMarkersBatch(endIndex), 10);
    } else {
      // Fit map to show all markers after all batches are processed
      if (hasValidCoordinates) {
        if (markers.value.length === 1) {
          googleMap.value.setCenter(bounds.getCenter());
          googleMap.value.setZoom(15);
        } else {
          googleMap.value.fitBounds(bounds);
        }
      }
    }
  };

  // Start batch processing
  addMarkersBatch(0);
};

const centerMap = () => {
  if (!googleMap.value || markers.value.length === 0) return;

  const bounds = new window.google.maps.LatLngBounds();
  markers.value.forEach((marker) => {
    bounds.extend(marker.getPosition());
  });

  if (markers.value.length === 1) {
    googleMap.value.setCenter(bounds.getCenter());
    googleMap.value.setZoom(15);
  } else {
    googleMap.value.fitBounds(bounds);
  }
};

const closeCustomerPanel = () => {
  selectedCustomer.value = null;
};

const callCustomer = (customer: Customer) => {
  window.location.href = `tel:${customer.phone}`;
};

const getDirections = (customer: Customer) => {
  if (customer.latitude != null && customer.longitude != null) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${customer.latitude},${customer.longitude}`;
    window.open(url, "_blank");
  } else {
    const address = encodeURIComponent(customer.address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(url, "_blank");
  }
};

const getCustomerFullName = (customer: Customer): string => {
  return customersStore.getCustomerFullName(customer);
};

const getCustomerInitials = (customer: Customer): string => {
  return `${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}`.toUpperCase();
};

// Lifecycle
onMounted(async () => {
  // Load customers first
  if (customers.value.length === 0) {
    await customersStore.fetchCustomers();
  }

  // Wait for DOM to be ready before initializing map
  await nextTick();

  // Initialize map after a brief delay to ensure DOM is fully rendered
  setTimeout(() => {
    initializeMap();
  }, 100);
});
</script>

<style scoped>
.map-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: none;
}

.header-title {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.title-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #3b82f6;
}

.page-description {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover:not(:disabled) {
  background: #2563eb;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: #6b7280;
  color: white;
}

.action-btn.secondary:hover {
  background: #4b5563;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-loading,
.map-error,
.map-unavailable {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.loading-content,
.error-content,
.unavailable-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.error-icon,
.unavailable-icon {
  width: 3rem;
  height: 3rem;
  color: #ef4444;
  margin: 0 auto 1rem;
}

.error-title,
.unavailable-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.error-message,
.unavailable-message {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.unavailable-message code {
  background: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
}

.unavailable-help {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
}

.help-text {
  color: #0369a1;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.help-link {
  color: #0284c7;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.help-link:hover {
  text-decoration: underline;
}

.error-retry-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0 auto;
}

.error-retry-btn:hover {
  background: #2563eb;
}

.map-wrapper {
  position: relative;
  height: 100%;
}

.map-loading-overlay,
.map-error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.google-map {
  width: 100%;
  height: 100%;
}

.map-stats {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 180px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.stat-label {
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

.stat-item.warning .stat-value {
  color: #f59e0b;
}

.customer-info-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  z-index: 1000;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.customer-avatar {
  width: 3rem;
  height: 3rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.customer-initials {
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
}

.customer-details {
  flex: 1;
}

.customer-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.customer-phone {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.panel-close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  color: #6b7280;
  transition: background-color 0.2s;
}

.panel-close-btn:hover {
  background: #f3f4f6;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.panel-content {
  padding: 1rem 1.5rem;
}

.customer-address {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.address-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.panel-actions {
  display: flex;
  gap: 0.75rem;
}

.panel-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  color: #374151;
}

.panel-action-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.panel-action-btn.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.panel-action-btn.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.panel-action-btn.secondary {
  background: #6b7280;
  color: white;
  border-color: #6b7280;
}

.panel-action-btn.secondary:hover {
  background: #4b5563;
  border-color: #4b5563;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .map-header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    align-self: stretch;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .map-stats {
    position: static;
    margin: 1rem;
    order: -1;
  }

  .panel-actions {
    flex-direction: column;
  }

  .panel-action-btn {
    justify-content: center;
  }
}
</style>
