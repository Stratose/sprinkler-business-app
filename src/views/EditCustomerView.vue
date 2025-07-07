<template>
  <div class="edit-customer-view">
    <!-- Header -->
    <div class="view-header">
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
      <h1 class="view-title">
        {{ customer ? `Edit ${getCustomerFullName(customer)}` : "Edit Customer" }}
      </h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading customer...</p>
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

    <!-- Customer Form -->
    <CustomerForm
      v-else-if="customer"
      :customer="customer"
      :is-editing="true"
      @success="handleSuccess"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCustomersStore } from "@/stores/customers";
import CustomerForm from "@/components/CustomerForm.vue";
import type { Customer } from "@/lib/supabase";

const route = useRoute();
const router = useRouter();
const customersStore = useCustomersStore();

// Computed properties
const customer = computed(() => customersStore.currentCustomer);
const loading = computed(() => customersStore.loading);
const error = computed(() => customersStore.error);

// Methods
const goBack = () => {
  const customerId = route.params.id as string;
  router.push(`/customers/${customerId}`);
};

const handleSuccess = (customer: Customer) => {
  // Navigate back to the customer's detail page
  router.push(`/customers/${customer.id}`);
};

const handleCancel = () => {
  const customerId = route.params.id as string;
  router.push(`/customers/${customerId}`);
};

const retryFetch = () => {
  const customerId = route.params.id as string;
  customersStore.fetchCustomer(customerId);
};

const getCustomerFullName = (customer: Customer): string => {
  return customersStore.getCustomerFullName(customer);
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
.edit-customer-view {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  flex: 1;
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .edit-customer-view {
    padding: 1rem;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .view-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .edit-customer-view {
    padding: 0.75rem;
  }

  .view-title {
    font-size: 1.125rem;
  }
}
</style>
