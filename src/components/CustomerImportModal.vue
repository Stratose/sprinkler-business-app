<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Import Customers</h2>
        <button @click="$emit('close')" class="close-button">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Import Method Tabs -->
        <div class="import-tabs">
          <button
            @click="activeTab = 'csv'"
            :class="['tab-button', { active: activeTab === 'csv' }]"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            CSV File
          </button>
          <button
            @click="activeTab = 'contacts'"
            :class="['tab-button', { active: activeTab === 'contacts' }]"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 6a3 3 0 106 0 3 3 0 00-6 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Web Contacts
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- CSV Import Tab -->
          <div v-if="activeTab === 'csv'" class="tab-pane">
            <CsvImport @close="$emit('close')" @success="handleImportSuccess" />
          </div>

          <!-- Device Contacts Tab -->
          <div v-if="activeTab === 'contacts'" class="tab-pane">
            <WebContactsImport @close="$emit('close')" @success="handleImportSuccess" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CsvImport from "./CsvImport.vue";
import WebContactsImport from "./WebContactsImport.vue";

interface Emits {
  (e: "close"): void;
  (e: "success", count: number): void;
}

const emit = defineEmits<Emits>();

// State
const activeTab = ref<"csv" | "contacts">("csv");

// Web contacts are available on all platforms
// The WebContactsImport component will handle browser compatibility internally

// Handle import success from child components
const handleImportSuccess = (count: number) => {
  emit("success", count);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.close-button:hover {
  background: #f3f4f6;
}

.close-button svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Tabs */
.import-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #374151;
  background: #f9fafb;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: #eff6ff;
}

.tab-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Tab Content */
.tab-content {
  flex: 1;
  overflow: auto;
}

.tab-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-content {
    max-width: 100%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .tab-button {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .tab-button svg {
    width: 1rem;
    height: 1rem;
  }
}

@media (max-width: 480px) {
  .tab-button {
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
  }

  .tab-button svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
