<template>
  <div class="device-contacts-import">
    <!-- Loading Screen -->
    <div v-if="loading" class="loading-screen">
      <div class="spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>

    <!-- Permission Request -->
    <div v-else-if="!hasPermission && !showContacts" class="permission-request">
      <div class="permission-content">
        <svg class="permission-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 6a3 3 0 106 0 3 3 0 00-6 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h3 class="permission-title">Access Your Contacts</h3>
        <p class="permission-description">
          We need permission to access your contacts to import them as customers. This will help you
          quickly add your existing contacts to your customer list.
        </p>
        <button @click="requestPermission" class="btn primary" :disabled="loading">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Grant Permission
        </button>
      </div>
    </div>

    <!-- Contacts List -->
    <div v-else-if="showContacts" class="contacts-list">
      <div class="contacts-header">
        <h3 class="contacts-title">Select Contacts to Import</h3>
        <p class="contacts-description">Choose which contacts you'd like to import as customers</p>
      </div>

      <!-- Search and Filter -->
      <div class="contacts-controls">
        <div class="search-box">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search contacts..."
            class="search-input"
          />
        </div>

        <div class="selection-controls">
          <button @click="selectAll" class="btn small secondary">
            Select All ({{ filteredContacts.length }})
          </button>
          <button @click="clearSelection" class="btn small secondary">Clear Selection</button>
        </div>
      </div>

      <!-- Contacts Table -->
      <div class="contacts-table-container">
        <table class="contacts-table">
          <thead>
            <tr>
              <th class="checkbox-col">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="checkbox"
                />
              </th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="contact in paginatedContacts"
              :key="contact.contactId"
              :class="{ 'selected-row': selectedContacts.has(contact.contactId) }"
            >
              <td class="checkbox-col">
                <input
                  type="checkbox"
                  :checked="selectedContacts.has(contact.contactId)"
                  @change="toggleContact(contact.contactId)"
                  class="checkbox"
                />
              </td>
              <td class="contact-name">
                <div class="contact-avatar">
                  <img
                    v-if="contact.photoThumbnail"
                    :src="contact.photoThumbnail"
                    :alt="contact.displayName"
                    class="avatar-image"
                  />
                  <div v-else class="avatar-placeholder">
                    {{ getInitials(contact.displayName) }}
                  </div>
                </div>
                <span class="name">{{ contact.displayName }}</span>
              </td>
              <td class="contact-phone">
                <span v-if="contact.phoneNumbers.length > 0" class="phone-number">
                  {{ contact.phoneNumbers[0].number }}
                </span>
                <span v-else class="no-data">No phone</span>
              </td>
              <td class="contact-email">
                <span v-if="contact.emails.length > 0" class="email-address">
                  {{ contact.emails[0].address }}
                </span>
                <span v-else class="no-data">No email</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredContacts.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 6a3 3 0 106 0 3 3 0 00-6 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h4>No contacts found</h4>
          <p>No contacts match your search criteria.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="pagination-info"> Page {{ currentPage }} of {{ totalPages }} </span>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Next
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="contacts-actions">
        <button @click="goBack" class="btn secondary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <button
          @click="importSelectedContacts"
          :disabled="selectedContacts.size === 0 || importing"
          class="btn primary"
        >
          <span v-if="importing">Importing...</span>
          <span v-else>Import {{ selectedContacts.size }} Contacts</span>
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="error-title">Unable to Access Contacts</h3>
      <p class="error-message">{{ error }}</p>
      <button @click="resetComponent" class="btn primary">Try Again</button>
    </div>

    <!-- Success State -->
    <div v-if="importSuccess" class="success-state">
      <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="success-title">Contacts Imported Successfully!</h3>
      <p class="success-message">
        Successfully imported {{ importedCount }} contacts.
        <span v-if="skippedCount > 0">
          {{ skippedCount }} contacts were skipped due to missing required information.
        </span>
      </p>
      <button @click="resetComponent" class="btn primary">Import More</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Contacts, Contact } from "@capacitor-community/contacts";
import { Capacitor } from "@capacitor/core";
import { useCustomersStore } from "@/stores/customers";
import { useAuthStore } from "@/stores/auth";

interface Emits {
  (e: "close"): void;
  (e: "success", count: number): void;
}

const emit = defineEmits<Emits>();

const customersStore = useCustomersStore();
const authStore = useAuthStore();

// State
const loading = ref(false);
const loadingMessage = ref("");
const hasPermission = ref(false);
const showContacts = ref(false);
const error = ref("");
const contacts = ref<Contact[]>([]);
const selectedContacts = ref(new Set<string>());
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 10;
const importing = ref(false);
const importSuccess = ref(false);
const importedCount = ref(0);
const skippedCount = ref(0);

// Computed
const filteredContacts = computed(() => {
  if (!searchQuery.value.trim()) {
    return contacts.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return contacts.value.filter(
    (contact) =>
      contact.displayName?.toLowerCase().includes(query) ||
      contact.phoneNumbers.some((phone) => phone.number?.includes(query)) ||
      contact.emails.some((email) => email.address?.toLowerCase().includes(query))
  );
});

const totalPages = computed(() => Math.ceil(filteredContacts.value.length / pageSize));

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredContacts.value.slice(start, end);
});

const allSelected = computed(() => {
  return (
    filteredContacts.value.length > 0 &&
    filteredContacts.value.every((contact) => selectedContacts.value.has(contact.contactId))
  );
});

// Check if platform supports contacts
const isSupported = computed(() => {
  return Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android";
});

// Component lifecycle
onMounted(async () => {
  if (!isSupported.value) {
    error.value = "Contact access is only available on mobile devices";
    return;
  }

  // Check if we already have permission
  await checkPermission();
});

// Methods
const checkPermission = async () => {
  try {
    const result = await Contacts.getPermissions();
    hasPermission.value = result.granted;

    if (result.granted) {
      await loadContacts();
    }
  } catch (err) {
    console.error("Error checking permissions:", err);
    error.value = "Unable to check contact permissions";
  }
};

const requestPermission = async () => {
  loading.value = true;
  loadingMessage.value = "Requesting permission...";

  try {
    const result = await Contacts.getPermissions();
    hasPermission.value = result.granted;

    if (result.granted) {
      await loadContacts();
    } else {
      error.value = "Permission denied. Please enable contact access in your device settings.";
    }
  } catch (err) {
    console.error("Error requesting permissions:", err);
    error.value = "Unable to request contact permissions";
  } finally {
    loading.value = false;
  }
};

const loadContacts = async () => {
  loading.value = true;
  loadingMessage.value = "Loading contacts...";

  try {
    const result = await Contacts.getContacts();
    contacts.value = result.contacts.filter(
      (contact) =>
        contact.displayName && contact.phoneNumbers.length > 0 && contact.phoneNumbers[0].number
    );

    showContacts.value = true;
  } catch (err) {
    console.error("Error loading contacts:", err);
    error.value = "Unable to load contacts. Please try again.";
  } finally {
    loading.value = false;
  }
};

const toggleContact = (contactId: string) => {
  if (selectedContacts.value.has(contactId)) {
    selectedContacts.value.delete(contactId);
  } else {
    selectedContacts.value.add(contactId);
  }
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    clearSelection();
  } else {
    selectAll();
  }
};

const selectAll = () => {
  filteredContacts.value.forEach((contact) => {
    selectedContacts.value.add(contact.contactId);
  });
};

const clearSelection = () => {
  selectedContacts.value.clear();
};

const getInitials = (name: string | undefined): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const importSelectedContacts = async () => {
  if (!authStore.user?.id) return;

  importing.value = true;

  try {
    const contactsToImport = contacts.value
      .filter((contact) => selectedContacts.value.has(contact.contactId))
      .map((contact) => {
        const phone = contact.phoneNumbers[0]?.number || "";
        const email = contact.emails[0]?.address || "";

        // Try to split display name into first and last name
        const nameParts = contact.displayName?.split(" ") || [];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        return {
          first_name: firstName,
          last_name: lastName || "Unknown", // Fallback for last name
          phone: phone,
          address: email ? `Email: ${email}` : "No address provided", // Use email as placeholder address
          user_id: authStore.user.id,
        };
      })
      .filter(
        (contact) => contact.first_name && contact.last_name && contact.phone && contact.address
      );

    if (contactsToImport.length === 0) {
      error.value = "No valid contacts selected. Contacts must have a name and phone number.";
      return;
    }

    await customersStore.bulkCreateCustomers(contactsToImport);

    importedCount.value = contactsToImport.length;
    skippedCount.value = selectedContacts.value.size - contactsToImport.length;
    importSuccess.value = true;

    emit("success", importedCount.value);
  } catch (err) {
    console.error("Error importing contacts:", err);
    error.value = "Failed to import contacts. Please try again.";
  } finally {
    importing.value = false;
  }
};

const goBack = () => {
  showContacts.value = false;
  selectedContacts.value.clear();
  searchQuery.value = "";
  currentPage.value = 1;
};

const resetComponent = () => {
  hasPermission.value = false;
  showContacts.value = false;
  error.value = "";
  contacts.value = [];
  selectedContacts.value.clear();
  searchQuery.value = "";
  currentPage.value = 1;
  importSuccess.value = false;
  importedCount.value = 0;
  skippedCount.value = 0;
};
</script>

<style scoped>
.device-contacts-import {
  padding: 1.5rem;
  max-width: 800px;
  width: 100%;
}

/* Loading Screen */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Permission Request */
.permission-request {
  text-align: center;
  padding: 2rem;
}

.permission-content {
  max-width: 400px;
  margin: 0 auto;
}

.permission-icon {
  width: 4rem;
  height: 4rem;
  color: #3b82f6;
  margin: 0 auto 1rem;
}

.permission-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.permission-description {
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 2rem 0;
}

/* Contacts List */
.contacts-header {
  text-align: center;
  margin-bottom: 2rem;
}

.contacts-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.contacts-description {
  color: #6b7280;
  margin: 0;
}

.contacts-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
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

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.selection-controls {
  display: flex;
  gap: 0.5rem;
}

/* Contacts Table */
.contacts-table-container {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-bottom: 1.5rem;
  max-height: 600px;
  overflow-y: auto;
}

.contacts-table {
  width: 100%;
  border-collapse: collapse;
}

.contacts-table th {
  background: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
}

.contacts-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.checkbox-col {
  width: 40px;
  text-align: center;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
}

.selected-row {
  background: #eff6ff;
}

.contact-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
}

.name {
  font-weight: 500;
  color: #1f2937;
}

.phone-number {
  color: #374151;
  font-family: monospace;
}

.email-address {
  color: #374151;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
}

.empty-state h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.empty-state p {
  margin: 0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Action Buttons */
.contacts-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 2rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
  margin: 0 auto 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.error-message {
  color: #6b7280;
  margin: 0 0 2rem 0;
}

/* Success State */
.success-state {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  width: 4rem;
  height: 4rem;
  color: #059669;
  margin: 0 auto 1rem;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.success-message {
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.btn svg {
  width: 1rem;
  height: 1rem;
}

.btn.primary {
  background: #3b82f6;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn.secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .device-contacts-import {
    padding: 1rem;
  }

  .contacts-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .selection-controls {
    justify-content: center;
  }

  .contacts-table-container {
    font-size: 0.875rem;
  }

  .contacts-table th,
  .contacts-table td {
    padding: 0.5rem;
  }

  .contact-name {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .contacts-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .contacts-title,
  .permission-title,
  .error-title,
  .success-title {
    font-size: 1.25rem;
  }

  .contacts-table th,
  .contacts-table td {
    padding: 0.375rem;
  }

  .contact-avatar {
    width: 1.5rem;
    height: 1.5rem;
  }

  .avatar-placeholder {
    font-size: 0.625rem;
  }
}
</style>
