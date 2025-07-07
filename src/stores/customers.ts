import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase, type Customer, type Database } from "@/lib/supabase";

export const useCustomersStore = defineStore("customers", () => {
  // State
  const customers = ref<Customer[]>([]);
  const currentCustomer = ref<Customer | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");

  // Getters
  const filteredCustomers = computed(() => {
    if (!searchQuery.value.trim()) {
      return customers.value;
    }

    const query = searchQuery.value.toLowerCase().trim();
    return customers.value.filter(
      (customer) =>
        customer.first_name.toLowerCase().includes(query) ||
        customer.last_name.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.address.toLowerCase().includes(query)
    );
  });

  const totalCustomers = computed(() => customers.value.length);

  // Actions
  async function fetchCustomers() {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      customers.value = data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch customers";
      console.error("Error fetching customers:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCustomer(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      currentCustomer.value = data;
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch customer";
      console.error("Error fetching customer:", err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createCustomer(customerData: Database["public"]["Tables"]["customers"]["Insert"]) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: createError } = await supabase
        .from("customers")
        .insert([customerData])
        .select()
        .single();

      if (createError) throw createError;

      // Add to local state
      customers.value.unshift(data);

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to create customer";
      console.error("Error creating customer:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateCustomer(
    id: string,
    updates: Database["public"]["Tables"]["customers"]["Update"]
  ) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from("customers")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      const index = customers.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        customers.value[index] = data;
      }

      // Update current customer if it's the one being updated
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = data;
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to update customer";
      console.error("Error updating customer:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCustomer(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase.from("customers").delete().eq("id", id);

      if (deleteError) throw deleteError;

      // Remove from local state
      customers.value = customers.value.filter((c) => c.id !== id);

      // Clear current customer if it was the deleted one
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = null;
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to delete customer";
      console.error("Error deleting customer:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function bulkCreateCustomers(
    customersData: Database["public"]["Tables"]["customers"]["Insert"][]
  ) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: createError } = await supabase
        .from("customers")
        .insert(customersData)
        .select();

      if (createError) throw createError;

      // Add to local state
      if (data) {
        customers.value.unshift(...data);
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to import customers";
      console.error("Error importing customers:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Validation helper for import data
  function validateCustomerData(customerData: Record<string, unknown>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (
      !customerData.first_name ||
      typeof customerData.first_name !== "string" ||
      customerData.first_name.trim().length < 2
    ) {
      errors.push("First name is required and must be at least 2 characters");
    }

    if (
      !customerData.last_name ||
      typeof customerData.last_name !== "string" ||
      customerData.last_name.trim().length < 2
    ) {
      errors.push("Last name is required and must be at least 2 characters");
    }

    if (
      !customerData.phone ||
      typeof customerData.phone !== "string" ||
      customerData.phone.trim().length < 10
    ) {
      errors.push("Phone number is required and must be at least 10 characters");
    }

    if (
      !customerData.address ||
      typeof customerData.address !== "string" ||
      customerData.address.trim().length < 10
    ) {
      errors.push("Address is required and must be at least 10 characters");
    }

    // Validate coordinates if provided
    if (customerData.latitude !== undefined && customerData.latitude !== null) {
      const lat = Number(customerData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push("Latitude must be a number between -90 and 90");
      }
    }

    if (customerData.longitude !== undefined && customerData.longitude !== null) {
      const lng = Number(customerData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push("Longitude must be a number between -180 and 180");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Utility functions
  function clearError() {
    error.value = null;
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function clearCurrentCustomer() {
    currentCustomer.value = null;
  }

  // Helper function to get customer's full name
  function getCustomerFullName(customer: Customer): string {
    return `${customer.first_name} ${customer.last_name}`;
  }

  return {
    // State
    customers,
    currentCustomer,
    loading,
    error,
    searchQuery,

    // Getters
    filteredCustomers,
    totalCustomers,

    // Actions
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    bulkCreateCustomers,

    // Utilities
    clearError,
    setSearchQuery,
    clearCurrentCustomer,
    getCustomerFullName,
    validateCustomerData,
  };
});
