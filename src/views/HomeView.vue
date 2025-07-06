<template>
  <div class="home">
    <h1>Sprinkler Business App</h1>

    <div class="connection-test">
      <h2>🔗 Database Connection</h2>
      <div v-if="connectionStatus === 'testing'" class="status testing">Testing connection...</div>
      <div v-else-if="connectionStatus === 'success'" class="status success">
        ✅ Connected to Supabase!
        <p>Project: {{ projectUrl }}</p>
        <p>Tables found: {{ tableCount }}</p>
      </div>
      <div v-else-if="connectionStatus === 'error'" class="status error">
        ❌ Connection failed: {{ errorMessage }}
      </div>

      <button @click="testConnection" :disabled="connectionStatus === 'testing'">
        Test Connection
      </button>
    </div>

    <div class="next-steps" v-if="connectionStatus === 'success'">
      <h3>🚀 Ready for Development!</h3>
      <ul>
        <li>✅ Database schema created</li>
        <li>✅ Supabase connection working</li>
        <li>⏳ Google OAuth (next step)</li>
        <li>⏳ Customer management UI</li>
        <li>⏳ Maps integration</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";

const connectionStatus = ref<"idle" | "testing" | "success" | "error">("idle");
const errorMessage = ref("");
const projectUrl = ref("");
const tableCount = ref(0);

const testConnection = async () => {
  connectionStatus.value = "testing";
  errorMessage.value = "";

  try {
    // Get project info from environment
    projectUrl.value = import.meta.env.VITE_SUPABASE_URL || "Unknown";

    // Test connection by querying for tables
    const { error } = await supabase
      .from("customers")
      .select("count", { count: "exact", head: true });

    if (error) {
      throw error;
    }

    // Check all our tables exist
    const tables = ["customers", "customer_notes", "appointments", "media_files"];
    let existingTables = 0;

    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select("count", { count: "exact", head: true });

        if (!tableError) {
          existingTables++;
        }
      } catch (e) {
        console.warn(`Table ${table} not accessible:`, e);
      }
    }

    tableCount.value = existingTables;
    connectionStatus.value = "success";
  } catch (error: unknown) {
    connectionStatus.value = "error";
    errorMessage.value = error instanceof Error ? error.message : "Unknown error";
    console.error("Supabase connection test failed:", error);
  }
};

// Test connection on component mount
onMounted(() => {
  testConnection();
});
</script>

<style scoped>
.home {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.connection-test {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
}

.status {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 6px;
  font-weight: 500;
}

.status.testing {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

.next-steps {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #e7f3ff;
  border-radius: 8px;
  text-align: left;
}

.next-steps ul {
  list-style: none;
  padding: 0;
}

.next-steps li {
  padding: 0.5rem 0;
  font-size: 1.1rem;
}
</style>
