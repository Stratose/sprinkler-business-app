<template>
  <div class="add-customer-view">
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
      <h1 class="view-title">Add New Customer</h1>
    </div>

    <!-- Customer Form -->
    <CustomerForm :is-editing="false" @success="handleSuccess" @cancel="handleCancel" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import CustomerForm from "@/components/CustomerForm.vue";
import type { Customer } from "@/lib/supabase";

const router = useRouter();

const goBack = () => {
  router.push("/customers");
};

const handleSuccess = (customer: Customer) => {
  // Navigate to the new customer's detail page
  router.push(`/customers/${customer.id}`);
};

const handleCancel = () => {
  router.push("/customers");
};
</script>

<style scoped>
.add-customer-view {
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .add-customer-view {
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
  .add-customer-view {
    padding: 0.75rem;
  }

  .view-title {
    font-size: 1.125rem;
  }
}
</style>
