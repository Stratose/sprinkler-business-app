<template>
  <div class="customer-detail-view">
    <!-- Header with Back Button -->
    <div class="detail-header">
      <button @click="goBack" class="back-btn">
        <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Back</span>
      </button>

      <div class="header-actions">
        <button @click="navigateToEdit" class="action-btn edit-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>Edit</span>
        </button>
        <button @click="confirmDelete" class="action-btn delete-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading customer details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="error-text">{{ error }}</p>
      <button @click="retryFetch" class="retry-btn">Try Again</button>
    </div>

    <!-- Customer Details -->
    <div v-else-if="customer" class="customer-details">
      <!-- Customer Info Card -->
      <div class="info-card">
        <div class="customer-header">
          <div class="customer-avatar">
            {{ getCustomerInitials(customer) }}
          </div>
          <div class="customer-title">
            <h1 class="customer-name">{{ getCustomerFullName(customer) }}</h1>
            <p class="customer-added">Added {{ formatDate(customer.created_at) }}</p>
          </div>
        </div>

        <div class="customer-info">
          <div class="info-row">
            <div class="info-item">
              <h3 class="info-label">Phone Number</h3>
              <p class="info-value">
                <a :href="`tel:${customer.phone}`" class="phone-link">{{ customer.phone }}</a>
              </p>
            </div>
            <div class="info-item">
              <h3 class="info-label">Address</h3>
              <p class="info-value">{{ customer.address }}</p>
            </div>
          </div>

          <div v-if="customer.latitude && customer.longitude" class="info-row">
            <div class="info-item">
              <h3 class="info-label">Location Coordinates</h3>
              <p class="info-value">
                {{ customer.latitude }}, {{ customer.longitude }}
                <button @click="openInMaps" class="maps-btn">
                  <svg class="maps-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  Open in Maps
                </button>
              </p>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <h3 class="info-label">Last Updated</h3>
              <p class="info-value">{{ formatDate(customer.updated_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button @click="callCustomer" class="quick-action-btn call-btn">
          <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>Call</span>
        </button>

        <button @click="navigateToAddress" class="quick-action-btn navigate-btn">
          <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span>Navigate</span>
        </button>
      </div>

      <!-- Related Data Sections -->
      <div class="related-sections">
        <!-- Notes Section -->
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">Notes</h2>
            <button class="section-action-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Note
            </button>
          </div>
          <div class="section-content">
            <p class="section-placeholder">
              No notes yet. Add your first note to keep track of important information.
            </p>
          </div>
        </div>

        <!-- Appointments Section -->
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">Appointments</h2>
            <button class="section-action-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Schedule
            </button>
          </div>
          <div class="section-content">
            <p class="section-placeholder">
              No appointments scheduled. Click "Schedule" to add an appointment.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Delete Customer</h3>
        <p class="modal-text">
          Are you sure you want to delete
          <strong>{{ customer?.first_name }} {{ customer?.last_name }}</strong
          >? This action cannot be undone and will also delete all related notes, appointments, and
          media files.
        </p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="modal-btn cancel-btn">Cancel</button>
          <button @click="executeDelete" class="modal-btn delete-btn" :disabled="deleting">
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCustomersStore } from "@/stores/customers";
import type { Customer } from "@/lib/supabase";

const route = useRoute();
const router = useRouter();
const customersStore = useCustomersStore();

// Local state
const showDeleteModal = ref(false);
const deleting = ref(false);

// Computed properties
const customer = computed(() => customersStore.currentCustomer);
const loading = computed(() => customersStore.loading);
const error = computed(() => customersStore.error);

// Methods
const goBack = () => {
  router.push("/customers");
};

const navigateToEdit = () => {
  if (customer.value) {
    router.push(`/customers/${customer.value.id}/edit`);
  }
};

const retryFetch = () => {
  const customerId = route.params.id as string;
  customersStore.fetchCustomer(customerId);
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
};

const executeDelete = async () => {
  if (!customer.value) return;

  deleting.value = true;

  try {
    await customersStore.deleteCustomer(customer.value.id);
    router.push("/customers");
  } catch (error) {
    console.error("Error deleting customer:", error);
    // Error is already handled in the store
  } finally {
    deleting.value = false;
    showDeleteModal.value = false;
  }
};

const callCustomer = () => {
  if (customer.value) {
    window.location.href = `tel:${customer.value.phone}`;
  }
};

const navigateToAddress = () => {
  if (customer.value) {
    const address = encodeURIComponent(customer.value.address);

    if (customer.value.latitude && customer.value.longitude) {
      // Use coordinates if available
      window.open(
        `https://maps.google.com/maps?q=${customer.value.latitude},${customer.value.longitude}`,
        "_blank"
      );
    } else {
      // Use address
      window.open(`https://maps.google.com/maps?q=${address}`, "_blank");
    }
  }
};

const openInMaps = () => {
  if (customer.value?.latitude && customer.value?.longitude) {
    window.open(
      `https://maps.google.com/maps?q=${customer.value.latitude},${customer.value.longitude}`,
      "_blank"
    );
  }
};

const getCustomerFullName = (customer: Customer): string => {
  return customersStore.getCustomerFullName(customer);
};

const getCustomerInitials = (customer: Customer): string => {
  return `${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}`.toUpperCase();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Lifecycle
onMounted(() => {
  const customerId = route.params.id as string;
  if (customerId) {
    customersStore.fetchCustomer(customerId);
  }
});
</script>

<style scoped>
.customer-detail-view {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: #e5e7eb;
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background: #2563eb;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #6b7280;
  font-size: 1rem;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.error-text {
  color: #ef4444;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #2563eb;
}

.customer-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.customer-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.customer-avatar {
  width: 4rem;
  height: 4rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.customer-title {
  flex: 1;
}

.customer-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.customer-added {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  gap: 2rem;
}

.info-item {
  flex: 1;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.info-value {
  font-size: 1rem;
  color: #1f2937;
  margin: 0;
  line-height: 1.5;
}

.phone-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.phone-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.maps-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.maps-btn:hover {
  background: #e5e7eb;
}

.maps-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
}

.quick-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.quick-action-btn:hover {
  border-color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.call-btn {
  color: #059669;
  border-color: #d1fae5;
}

.call-btn:hover {
  border-color: #059669;
  background: #ecfdf5;
}

.navigate-btn {
  color: #3b82f6;
  border-color: #dbeafe;
}

.navigate-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.related-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.section-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.section-action-btn:hover {
  background: #2563eb;
}

.section-action-btn svg {
  width: 1rem;
  height: 1rem;
}

.section-content {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.section-placeholder {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 400px;
  width: 100%;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.modal-text {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.modal-btn.delete-btn {
  background: #ef4444;
  color: white;
}

.modal-btn.delete-btn:hover {
  background: #dc2626;
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .customer-detail-view {
    padding: 1rem;
  }

  .detail-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-actions {
    justify-content: space-between;
  }

  .customer-header {
    flex-direction: column;
    text-align: center;
  }

  .customer-avatar {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }

  .info-row {
    flex-direction: column;
    gap: 1rem;
  }

  .quick-actions {
    flex-direction: column;
  }

  .related-sections {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .customer-detail-view {
    padding: 0.75rem;
  }

  .info-card,
  .section-card {
    padding: 1rem;
  }

  .customer-name {
    font-size: 1.25rem;
  }

  .modal-content {
    padding: 1rem;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-btn {
    width: 100%;
  }
}
</style>
