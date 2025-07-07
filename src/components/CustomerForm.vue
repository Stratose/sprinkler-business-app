<template>
  <div class="customer-form">
    <form @submit.prevent="handleSubmit" class="form">
      <!-- First Name -->
      <div class="form-group">
        <label for="firstName" class="form-label">First Name *</label>
        <input
          id="firstName"
          v-model="formData.first_name"
          type="text"
          class="form-input"
          :class="{ 'form-input-error': errors.first_name }"
          placeholder="Enter first name"
          required
        />
        <p v-if="errors.first_name" class="form-error">{{ errors.first_name }}</p>
      </div>

      <!-- Last Name -->
      <div class="form-group">
        <label for="lastName" class="form-label">Last Name *</label>
        <input
          id="lastName"
          v-model="formData.last_name"
          type="text"
          class="form-input"
          :class="{ 'form-input-error': errors.last_name }"
          placeholder="Enter last name"
          required
        />
        <p v-if="errors.last_name" class="form-error">{{ errors.last_name }}</p>
      </div>

      <!-- Phone -->
      <div class="form-group">
        <label for="phone" class="form-label">Phone Number *</label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          class="form-input"
          :class="{ 'form-input-error': errors.phone }"
          placeholder="Enter phone number"
          required
        />
        <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
      </div>

      <!-- Address -->
      <div class="form-group">
        <label for="address" class="form-label">Address *</label>
        <textarea
          id="address"
          v-model="formData.address"
          class="form-textarea"
          :class="{ 'form-input-error': errors.address }"
          placeholder="Enter full address"
          rows="3"
          required
        ></textarea>
        <p v-if="errors.address" class="form-error">{{ errors.address }}</p>
      </div>

      <!-- Location Coordinates (Optional) -->
      <div class="form-group">
        <div class="form-row">
          <div class="form-col">
            <label for="latitude" class="form-label">Latitude (Optional)</label>
            <input
              id="latitude"
              v-model.number="formData.latitude"
              type="number"
              step="any"
              class="form-input"
              :class="{ 'form-input-error': errors.latitude }"
              placeholder="e.g., 40.7128"
            />
            <p v-if="errors.latitude" class="form-error">{{ errors.latitude }}</p>
          </div>
          <div class="form-col">
            <label for="longitude" class="form-label">Longitude (Optional)</label>
            <input
              id="longitude"
              v-model.number="formData.longitude"
              type="number"
              step="any"
              class="form-input"
              :class="{ 'form-input-error': errors.longitude }"
              placeholder="e.g., -74.0060"
            />
            <p v-if="errors.longitude" class="form-error">{{ errors.longitude }}</p>
          </div>
        </div>
        <p class="form-help">
          GPS coordinates will help with mapping and navigation. Leave blank if unknown.
        </p>
      </div>

      <!-- Location Helper Button -->
      <div class="form-group">
        <button
          type="button"
          @click="getCurrentLocation"
          class="location-btn"
          :disabled="gettingLocation"
        >
          <svg class="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <span>{{ gettingLocation ? "Getting Location..." : "Use Current Location" }}</span>
        </button>
      </div>

      <!-- General Error Message -->
      <div v-if="generalError" class="form-error general-error">
        {{ generalError }}
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button
          type="button"
          @click="$emit('cancel')"
          class="form-btn cancel-btn"
          :disabled="submitting"
        >
          Cancel
        </button>
        <button type="submit" class="form-btn submit-btn" :disabled="submitting || !isFormValid">
          <span v-if="submitting">
            {{ isEditing ? "Saving..." : "Adding..." }}
          </span>
          <span v-else>
            {{ isEditing ? "Save Changes" : "Add Customer" }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useCustomersStore } from "@/stores/customers";
import { useAuthStore } from "@/stores/auth";
import type { Customer, Database } from "@/lib/supabase";

interface Props {
  customer?: Customer | null;
  isEditing?: boolean;
}

interface Emits {
  (
    e: "submit",
    data:
      | Database["public"]["Tables"]["customers"]["Insert"]
      | Database["public"]["Tables"]["customers"]["Update"]
  ): void;
  (e: "cancel"): void;
  (e: "success", customer: Customer): void;
}

const props = withDefaults(defineProps<Props>(), {
  customer: null,
  isEditing: false,
});

const emit = defineEmits<Emits>();

const customersStore = useCustomersStore();
const authStore = useAuthStore();

// Form data
const formData = ref({
  first_name: "",
  last_name: "",
  phone: "",
  address: "",
  latitude: null as number | null,
  longitude: null as number | null,
});

// Form state
const submitting = ref(false);
const gettingLocation = ref(false);
const generalError = ref("");
const errors = ref({
  first_name: "",
  last_name: "",
  phone: "",
  address: "",
  latitude: "",
  longitude: "",
});

// Computed properties
const isFormValid = computed(() => {
  return (
    formData.value.first_name.trim() &&
    formData.value.last_name.trim() &&
    formData.value.phone.trim() &&
    formData.value.address.trim() &&
    !Object.values(errors.value).some((error) => error)
  );
});

// Methods
const clearErrors = () => {
  errors.value = {
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
  };
  generalError.value = "";
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  // Required fields
  if (!formData.value.first_name.trim()) {
    errors.value.first_name = "First name is required";
    isValid = false;
  } else if (formData.value.first_name.length < 2) {
    errors.value.first_name = "First name must be at least 2 characters";
    isValid = false;
  }

  if (!formData.value.last_name.trim()) {
    errors.value.last_name = "Last name is required";
    isValid = false;
  } else if (formData.value.last_name.length < 2) {
    errors.value.last_name = "Last name must be at least 2 characters";
    isValid = false;
  }

  if (!formData.value.phone.trim()) {
    errors.value.phone = "Phone number is required";
    isValid = false;
  } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.value.phone)) {
    errors.value.phone = "Please enter a valid phone number";
    isValid = false;
  }

  if (!formData.value.address.trim()) {
    errors.value.address = "Address is required";
    isValid = false;
  } else if (formData.value.address.length < 10) {
    errors.value.address = "Please enter a complete address";
    isValid = false;
  }

  // Coordinate validation
  if (
    formData.value.latitude !== null &&
    (formData.value.latitude < -90 || formData.value.latitude > 90)
  ) {
    errors.value.latitude = "Latitude must be between -90 and 90";
    isValid = false;
  }

  if (
    formData.value.longitude !== null &&
    (formData.value.longitude < -180 || formData.value.longitude > 180)
  ) {
    errors.value.longitude = "Longitude must be between -180 and 180";
    isValid = false;
  }

  return isValid;
};

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    generalError.value = "Geolocation is not supported by your browser";
    return;
  }

  gettingLocation.value = true;
  generalError.value = "";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      formData.value.latitude = Number(position.coords.latitude.toFixed(6));
      formData.value.longitude = Number(position.coords.longitude.toFixed(6));
      gettingLocation.value = false;
    },
    (error) => {
      gettingLocation.value = false;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          generalError.value = "Location access denied. Please enable location services.";
          break;
        case error.POSITION_UNAVAILABLE:
          generalError.value = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          generalError.value = "Location request timed out.";
          break;
        default:
          generalError.value = "An error occurred while retrieving location.";
          break;
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }
  );
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  submitting.value = true;
  generalError.value = "";

  try {
    if (!authStore.user?.id) {
      throw new Error("User not authenticated");
    }

    const customerData = {
      first_name: formData.value.first_name.trim(),
      last_name: formData.value.last_name.trim(),
      phone: formData.value.phone.trim(),
      address: formData.value.address.trim(),
      latitude: formData.value.latitude === null ? undefined : formData.value.latitude,
      longitude: formData.value.longitude === null ? undefined : formData.value.longitude,
      user_id: authStore.user.id,
    };

    let result: Customer;

    if (props.isEditing && props.customer) {
      // Update existing customer
      result = await customersStore.updateCustomer(props.customer.id, customerData);
    } else {
      // Create new customer
      result = await customersStore.createCustomer(customerData);
    }

    emit("success", result);
    emit("submit", customerData);
  } catch (error) {
    console.error("Error submitting customer:", error);
    generalError.value =
      error instanceof Error ? error.message : "An error occurred while saving the customer";
  } finally {
    submitting.value = false;
  }
};

// Initialize form data when customer prop changes
watch(
  () => props.customer,
  (newCustomer) => {
    if (newCustomer) {
      formData.value = {
        first_name: newCustomer.first_name,
        last_name: newCustomer.last_name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        latitude: newCustomer.latitude === undefined ? null : newCustomer.latitude,
        longitude: newCustomer.longitude === undefined ? null : newCustomer.longitude,
      };
    } else {
      formData.value = {
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        latitude: null,
        longitude: null,
      };
    }
    clearErrors();
  },
  { immediate: true }
);

// Initialize form on mount
onMounted(() => {
  if (props.customer) {
    formData.value = {
      first_name: props.customer.first_name,
      last_name: props.customer.last_name,
      phone: props.customer.phone,
      address: props.customer.address,
      latitude: props.customer.latitude === undefined ? null : props.customer.latitude,
      longitude: props.customer.longitude === undefined ? null : props.customer.longitude,
    };
  }
});
</script>

<style scoped>
.customer-form {
  max-width: 600px;
  margin: 0 auto;
}

.form {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.form-input-error {
  border-color: #ef4444;
}

.form-input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}

.form-textarea {
  resize: vertical;
  min-height: 4rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-col {
  flex: 1;
}

.form-help {
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.form-error {
  font-size: 0.8125rem;
  color: #ef4444;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.general-error {
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.location-btn {
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
  transition: background-color 0.2s, border-color 0.2s;
}

.location-btn:hover:not(:disabled) {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.location-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.location-icon {
  width: 1rem;
  height: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.form-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.submit-btn {
  background: #3b82f6;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.form-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .form {
    padding: 1rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .customer-form {
    margin: 0;
  }

  .form {
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: 0.75rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-actions {
    margin-top: 1.5rem;
    padding-top: 1rem;
  }
}
</style>
