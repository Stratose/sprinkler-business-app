<template>
  <div class="space-y-4">
    <!-- Contact Picker Support Check -->
    <div v-if="!isContactPickerSupported" class="text-center py-8">
      <div class="text-gray-500 mb-4">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        Contact Access Not Supported
      </div>
      <p class="text-sm text-gray-600 mb-4">
        Your browser doesn't support accessing device contacts
      </p>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800">
          <strong>Try using:</strong> Chrome on Android for the best contact access experience, or
          use the CSV import feature instead.
        </p>
      </div>
    </div>

    <!-- Contact Picker Interface -->
    <div v-else class="space-y-4">
      <div class="text-center py-4">
        <div class="text-gray-700 mb-4">
          <svg
            class="w-12 h-12 mx-auto mb-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.196-2.121M13 7a4 4 0 11-8 0 4 4 0 018 0zM5 20h8v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2z"
            />
          </svg>
          Device Contacts Import
        </div>
        <p class="text-sm text-gray-600 mb-6">
          Import contacts directly from your device's contact list
        </p>

        <!-- Select Contacts Button -->
        <button
          @click="selectContacts"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
        >
          <span v-if="loading">Accessing Contacts...</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.196-2.121M13 7a4 4 0 11-8 0 4 4 0 018 0zM5 20h8v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2z"
              />
            </svg>
            Select Contacts from Device
          </span>
        </button>

        <p class="text-xs text-gray-500">
          You'll be prompted to select which contacts to share with this app
        </p>
      </div>

      <!-- Selected Contacts Preview -->
      <div v-if="selectedContacts.length > 0" class="space-y-4">
        <div class="border-t pt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-3">
            Selected Contacts ({{ selectedContacts.length }})
          </h3>

          <!-- Contacts List -->
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div
              v-for="contact in selectedContacts"
              :key="contact.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-blue-600">
                    {{ getInitials(contact.name) }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ contact.name }}</p>
                  <p class="text-sm text-gray-500">{{ contact.tel?.[0] || "No phone" }}</p>
                  <p class="text-sm text-gray-500">{{ contact.email?.[0] || "No email" }}</p>
                </div>
              </div>
              <button
                @click="removeContact(contact.id)"
                class="text-red-600 hover:text-red-800 p-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Import Actions -->
          <div class="flex gap-3 mt-4">
            <button
              @click="importContacts"
              :disabled="importing || selectedContacts.length === 0"
              class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="importing">Importing...</span>
              <span v-else>Import {{ selectedContacts.length }} Contacts</span>
            </button>
            <button
              @click="clearContacts"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="importSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center gap-2 text-green-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-medium">Import Successful!</span>
        </div>
        <p class="text-sm text-green-700 mt-1">
          Successfully imported {{ importedCount }} contacts.
          <span v-if="skippedCount > 0">
            {{ skippedCount }} contacts were skipped due to missing required information.
          </span>
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center gap-2 text-red-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-medium">Error</span>
        </div>
        <p class="text-sm text-red-700 mt-1">{{ error }}</p>
      </div>

      <!-- Browser Support Info -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-yellow-800 mb-2">Browser Compatibility</h4>
        <ul class="text-xs text-yellow-700 space-y-1">
          <li>✅ Chrome for Android (best support)</li>
          <li>✅ Edge for Android</li>
          <li>⚠️ Safari iOS (limited support)</li>
          <li>❌ Desktop browsers (not supported)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCustomersStore } from "@/stores/customers";
import { useAuthStore } from "@/stores/auth";

interface ContactInfo {
  id: string;
  name: string;
  tel?: string[];
  email?: string[];
}

interface ContactsManager {
  getProperties(): Promise<string[]>;
  select(properties: string[], options?: { multiple?: boolean }): Promise<RawContact[]>;
}

interface RawContact {
  name?: string[];
  tel?: string[];
  email?: string[];
}

declare global {
  interface Navigator {
    contacts?: ContactsManager;
  }
}

interface Emits {
  (e: "close"): void;
  (e: "success", count: number): void;
}

const emit = defineEmits<Emits>();

const customersStore = useCustomersStore();
const authStore = useAuthStore();

// State
const loading = ref(false);
const importing = ref(false);
const error = ref("");
const selectedContacts = ref<ContactInfo[]>([]);
const importSuccess = ref(false);
const importedCount = ref(0);
const skippedCount = ref(0);

// Check if Contact Picker API is supported
const isContactPickerSupported = computed(() => {
  return "contacts" in navigator && "ContactsManager" in window;
});

onMounted(() => {
  console.log("🔧 Contact Picker API supported:", isContactPickerSupported.value);
  console.log("🔧 User agent:", navigator.userAgent);
});

const selectContacts = async () => {
  if (!isContactPickerSupported.value) {
    error.value = "Contact Picker API is not supported in this browser";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    // Request specific contact properties
    const props = ["name", "tel", "email"];

    // Check if the properties are supported
    const supported = await navigator.contacts!.getProperties();
    console.log("🔧 Supported contact properties:", supported);

    // Select contacts using the Contact Picker API
    const contacts = await navigator.contacts!.select(props, { multiple: true });

    console.log("🔧 Selected contacts:", contacts);

    // Process the selected contacts
    const processedContacts: ContactInfo[] = contacts.map((contact: RawContact, index: number) => ({
      id: `web-contact-${Date.now()}-${index}`,
      name: contact.name?.[0] || "Unknown Contact",
      tel: contact.tel || [],
      email: contact.email || [],
    }));

    selectedContacts.value = processedContacts;

    if (processedContacts.length === 0) {
      error.value = "No contacts were selected";
    }
  } catch (err) {
    console.error("Contact selection error:", err);

    if (err instanceof Error && err.name === "AbortError") {
      error.value = "Contact selection was cancelled";
    } else if (err instanceof Error && err.name === "NotSupportedError") {
      error.value = "Contact access is not supported on this device";
    } else if (err instanceof Error && err.name === "NotAllowedError") {
      error.value = "Permission to access contacts was denied";
    } else {
      error.value = "Failed to access contacts. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};

const removeContact = (contactId: string) => {
  selectedContacts.value = selectedContacts.value.filter((c) => c.id !== contactId);
};

const clearContacts = () => {
  selectedContacts.value = [];
  importSuccess.value = false;
  error.value = "";
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

const importContacts = async () => {
  if (!authStore.user?.id) {
    error.value = "You must be logged in to import contacts";
    return;
  }

  importing.value = true;
  error.value = "";

  try {
    const contactsToImport = selectedContacts.value
      .map((contact) => {
        const phone = contact.tel?.[0] || "";
        const email = contact.email?.[0] || "";

        // Try to split display name into first and last name
        const nameParts = contact.name?.split(" ") || [];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        return {
          first_name: firstName,
          last_name: lastName || "Unknown", // Fallback for last name
          phone: phone,
          address: email ? `Email: ${email}` : "No address provided",
          user_id: authStore.user?.id || "",
        };
      })
      .filter((contact) => contact.first_name && contact.last_name && contact.phone);

    if (contactsToImport.length === 0) {
      error.value = "No valid contacts to import. Contacts must have a name and phone number.";
      return;
    }

    await customersStore.bulkCreateCustomers(contactsToImport);

    importedCount.value = contactsToImport.length;
    skippedCount.value = selectedContacts.value.length - contactsToImport.length;
    importSuccess.value = true;

    // Clear selected contacts after successful import
    selectedContacts.value = [];

    emit("success", importedCount.value);
  } catch (err) {
    console.error("Error importing contacts:", err);
    error.value = "Failed to import contacts. Please try again.";
  } finally {
    importing.value = false;
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
