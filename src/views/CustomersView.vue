<template>
  <div class="customers-view">
    <!-- Header -->
    <div class="customers-header">
      <h1 class="customers-title">Customers</h1>
      <div class="customers-stats">
        <span class="stats-text">{{ totalCustomers }} customers</span>
      </div>
    </div>

    <!-- Search and Actions -->
    <div class="customers-actions">
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search customers..."
          class="search-input"
          @input="onSearchInput"
        />
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div class="action-buttons">
        <button @click="showImportModal = true" class="import-btn">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 17l3 3 3-3M12 12v8"
            />
          </svg>
          <span class="btn-text">Import</span>
        </button>
        <button @click="navigateToAddCustomer" class="add-customer-btn">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span class="btn-text">Add</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading customers...</p>
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

    <!-- Empty State -->
    <div v-else-if="filteredCustomers.length === 0 && !loading" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h2 class="empty-title">
        {{ searchQuery ? "No customers found" : "No customers yet" }}
      </h2>
      <p class="empty-text">
        {{
          searchQuery ? "Try adjusting your search terms" : "Add your first customer to get started"
        }}
      </p>
      <button v-if="!searchQuery" @click="navigateToAddCustomer" class="add-first-customer-btn">
        Add First Customer
      </button>
    </div>

    <!-- Customer List -->
    <div v-else class="customers-list">
      <div
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="customer-card"
        @click="navigateToCustomer(customer.id)"
      >
        <div class="customer-info">
          <div class="customer-avatar">
            {{ getCustomerInitials(customer) }}
          </div>
          <div class="customer-details">
            <h3 class="customer-name">{{ getCustomerFullName(customer) }}</h3>
            <p class="customer-phone">{{ customer.phone }}</p>
            <p class="customer-address">{{ customer.address }}</p>
            <p class="customer-date">Added {{ formatDate(customer.created_at) }}</p>
          </div>
        </div>

        <div class="customer-actions" @click.stop>
          <button
            @click="navigateToEditCustomer(customer.id)"
            class="action-btn edit-btn"
            title="Edit customer"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            @click="confirmDelete(customer)"
            class="action-btn delete-btn"
            title="Delete customer"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirmation" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Delete Customer</h3>
        <p class="modal-text">
          Are you sure you want to delete
          <strong>{{ deleteConfirmation.first_name }} {{ deleteConfirmation.last_name }}</strong
          >? This action cannot be undone.
        </p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="modal-btn cancel-btn">Cancel</button>
          <button @click="executeDelete" class="modal-btn delete-btn" :disabled="loading">
            {{ loading ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <CustomerImportModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @success="handleImportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useCustomersStore } from "@/stores/customers";
import type { Customer } from "@/lib/supabase";
import CustomerImportModal from "@/components/CustomerImportModal.vue";

const router = useRouter();
const customersStore = useCustomersStore();

// Local state
const deleteConfirmation = ref<Customer | null>(null);
const showImportModal = ref(false);

// Computed properties from store
const filteredCustomers = computed(() => customersStore.filteredCustomers);
const totalCustomers = computed(() => customersStore.totalCustomers);
const loading = computed(() => customersStore.loading);
const error = computed(() => customersStore.error);
const searchQuery = computed({
  get: () => customersStore.searchQuery,
  set: (value) => customersStore.setSearchQuery(value),
});

// Methods
const onSearchInput = () => {
  // Search is handled by the computed property
};

const navigateToAddCustomer = () => {
  router.push("/customers/add");
};

const navigateToCustomer = (id: string) => {
  router.push(`/customers/${id}`);
};

const navigateToEditCustomer = (id: string) => {
  router.push(`/customers/${id}/edit`);
};

const retryFetch = () => {
  customersStore.fetchCustomers();
};

const confirmDelete = (customer: Customer) => {
  deleteConfirmation.value = customer;
};

const cancelDelete = () => {
  deleteConfirmation.value = null;
};

const executeDelete = async () => {
  if (!deleteConfirmation.value) return;

  try {
    await customersStore.deleteCustomer(deleteConfirmation.value.id);
    deleteConfirmation.value = null;
  } catch (error) {
    console.error("Error deleting customer:", error);
    // Error is already handled in the store
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
  });
};

const handleImportSuccess = (count: number) => {
  showImportModal.value = false;
  // Show success message or notification
  console.log(`Successfully imported ${count} customers`);
  // Refresh the customer list
  customersStore.fetchCustomers();
};

// Lifecycle
onMounted(() => {
  customersStore.fetchCustomers();
});
</script>

<style scoped>
.customers-view {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.customers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.customers-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.customers-stats {
  color: #6b7280;
  font-size: 0.875rem;
}

.customers-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-container {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.add-customer-btn,
.import-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-customer-btn {
  background: #3b82f6;
  color: white;
}

.add-customer-btn:hover {
  background: #2563eb;
}

.import-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.import-btn:hover {
  background: #e5e7eb;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.loading-state,
.error-state,
.empty-state {
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

.error-icon,
.empty-icon {
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

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-text {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.add-first-customer-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-first-customer-btn:hover {
  background: #2563eb;
}

.customers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.customer-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.customer-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.customer-avatar {
  width: 3rem;
  height: 3rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.customer-details {
  flex: 1;
  min-width: 0;
}

.customer-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.customer-phone {
  font-size: 0.875rem;
  color: #3b82f6;
  margin: 0 0 0.25rem 0;
}

.customer-address {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.customer-date {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.customer-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
}

.edit-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.edit-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.delete-btn {
  background: #fef2f2;
  color: #ef4444;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
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
  .customers-view {
    padding: 1rem;
  }

  .customers-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .customers-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .add-customer-btn,
  .import-btn {
    justify-content: center;
  }

  .btn-text {
    display: inline;
  }

  .customer-card {
    padding: 0.75rem;
  }

  .customer-info {
    gap: 0.75rem;
  }

  .customer-avatar {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }

  .customer-name {
    font-size: 1rem;
  }

  .customer-phone,
  .customer-address {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .customers-view {
    padding: 0.75rem;
  }

  .customers-title {
    font-size: 1.5rem;
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
