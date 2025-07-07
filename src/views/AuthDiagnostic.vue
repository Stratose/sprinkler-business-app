<template>
  <div class="diagnostic-page">
    <div class="diagnostic-container">
      <h1>OAuth Diagnostic Information</h1>

      <div class="diagnostic-section">
        <h2>Environment Information</h2>
        <ul>
          <li><strong>Current URL:</strong> {{ currentUrl }}</li>
          <li><strong>Origin:</strong> {{ currentOrigin }}</li>
          <li><strong>Environment Mode:</strong> {{ envMode }}</li>
          <li><strong>Is Development:</strong> {{ isDev }}</li>
          <li><strong>Supabase URL:</strong> {{ supabaseUrl }}</li>
        </ul>
      </div>

      <div class="diagnostic-section">
        <h2>Expected OAuth Redirect URLs</h2>
        <ul>
          <li><strong>Development:</strong> http://localhost:3000/auth/callback</li>
          <li>
            <strong>Production:</strong> https://sprinkler-business-app.vercel.app/auth/callback
          </li>
          <li><strong>Current Expected:</strong> {{ expectedRedirectUrl }}</li>
        </ul>
      </div>

      <div class="diagnostic-section">
        <h2>Supabase Project Configuration</h2>
        <p>Ensure these URLs are added to your Supabase project:</p>
        <ol>
          <li>
            Go to <a href="https://supabase.com/dashboard" target="_blank">Supabase Dashboard</a>
          </li>
          <li>Select your project</li>
          <li>Go to Authentication → Settings</li>
          <li>Add these Site URLs:</li>
          <ul>
            <li>http://localhost:3000 (for development)</li>
            <li>https://sprinkler-business-app.vercel.app (for production)</li>
          </ul>
          <li>Add these Redirect URLs:</li>
          <ul>
            <li>http://localhost:3000/auth/callback (for development)</li>
            <li>https://sprinkler-business-app.vercel.app/auth/callback (for production)</li>
          </ul>
        </ol>
      </div>

      <div class="diagnostic-section">
        <h2>Test OAuth Flow</h2>
        <button @click="testOAuth" :disabled="loading" class="btn primary">
          {{ loading ? "Testing..." : "Test Google OAuth" }}
        </button>
        <p v-if="lastRedirectUrl" class="redirect-info">
          <strong>Last attempted redirect URL:</strong> {{ lastRedirectUrl }}
        </p>
      </div>

      <div class="diagnostic-section">
        <h2>URL Parameters (if any)</h2>
        <pre>{{ urlParams }}</pre>
      </div>

      <div class="back-link">
        <router-link to="/">← Back to App</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const loading = ref(false);
const lastRedirectUrl = ref("");

const currentUrl = ref("");
const currentOrigin = ref("");
const envMode = ref("");
const isDev = ref(false);
const supabaseUrl = ref("");
const urlParams = ref("");

onMounted(() => {
  currentUrl.value = window.location.href;
  currentOrigin.value = window.location.origin;
  envMode.value = import.meta.env.MODE;
  isDev.value = import.meta.env.DEV;
  supabaseUrl.value = import.meta.env.VITE_SUPABASE_URL || "Not set";

  const params = new URLSearchParams(window.location.search);
  const paramObj: Record<string, string> = {};
  params.forEach((value, key) => {
    paramObj[key] = value;
  });
  urlParams.value = JSON.stringify(paramObj, null, 2);
});

const expectedRedirectUrl = computed(() => {
  if (isDev.value) {
    return `${currentOrigin.value}/auth/callback`;
  } else {
    const origin = currentOrigin.value;
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return "https://sprinkler-business-app.vercel.app/auth/callback";
    } else {
      return `${origin}/auth/callback`;
    }
  }
});

const testOAuth = async () => {
  loading.value = true;

  try {
    // Capture what redirect URL would be used
    lastRedirectUrl.value = expectedRedirectUrl.value;

    // Attempt OAuth login
    await authStore.signInWithGoogle();
  } catch (error) {
    console.error("OAuth test failed:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.diagnostic-page {
  min-height: 100vh;
  padding: 2rem;
  background: #f7fafc;
}

.diagnostic-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.diagnostic-container h1 {
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
}

.diagnostic-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.diagnostic-section:last-child {
  border-bottom: none;
}

.diagnostic-section h2 {
  color: #4a5568;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.diagnostic-section ul,
.diagnostic-section ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.diagnostic-section li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.diagnostic-section a {
  color: #3182ce;
  text-decoration: underline;
}

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

.btn.primary {
  background: #3b82f6;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.redirect-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.375rem;
  font-family: monospace;
  font-size: 0.875rem;
}

pre {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-size: 0.875rem;
}

.back-link {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.back-link a {
  color: #3182ce;
  text-decoration: none;
  font-weight: 500;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
