<template>
  <div class="auth-callback">
    <!-- Loading state -->
    <LoadingState
      v-if="processing && !error"
      :full-screen="true"
      title="Completing sign in..."
      message="Please wait while we verify your authentication."
      size="medium"
    />

    <!-- Error state -->
    <div v-else-if="error" class="callback-container">
      <div class="callback-content">
        <div class="error-icon">
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2>Authentication Error</h2>
        <p>{{ error }}</p>
        <p class="redirect-message">Redirecting to login page...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoadingState from "@/components/LoadingState.vue";

const router = useRouter();
const authStore = useAuthStore();
const error = ref<string | null>(null);
const processing = ref(true);

onMounted(async () => {
  try {
    console.log("🔧 OAuth callback processing started");

    // Check URL parameters for OAuth errors
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    if (errorParam) {
      // Handle specific OAuth errors
      const errorMessages = {
        access_denied: "Authentication was canceled. Please try again.",
        invalid_request: "Invalid authentication request. Please try again.",
        server_error: "Google authentication service is temporarily unavailable.",
        temporarily_unavailable: "Google authentication service is temporarily unavailable.",
      };

      error.value =
        errorMessages[errorParam as keyof typeof errorMessages] ||
        errorDescription ||
        "Authentication was canceled or failed";
      processing.value = false;

      console.log("❌ OAuth error detected:", errorParam, errorDescription);

      // Redirect to login after showing error briefly
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    // Wait for auth initialization to complete
    console.log("⏳ Waiting for auth initialization...");
    await authStore.waitForInitialization();

    // Check authentication status after initialization
    if (authStore.isAuthenticated) {
      console.log("✅ Authentication successful, redirecting to dashboard");
      router.push("/");
    } else {
      console.log("❌ Authentication failed, redirecting to login");
      router.push("/login");
    }
  } catch (err) {
    console.error("❌ Auth callback error:", err);

    // Determine error type for better user feedback
    if (err instanceof Error && err.message.includes("timeout")) {
      error.value = "Authentication is taking longer than expected. Please try again.";
    } else {
      error.value = "An error occurred during authentication. Please try again.";
    }

    processing.value = false;

    // Redirect to login after showing error
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }
});
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.callback-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.callback-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* Spinner styles removed - now using LoadingState component */

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e53e3e;
}

.callback-content h2 {
  color: #2d3748;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}

.callback-content p {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.redirect-message {
  color: #a0aec0;
  font-size: 0.875rem;
  font-style: italic;
}

/* Mobile responsive */
@media (max-width: 480px) {
  .callback-container {
    padding: 2rem 1.5rem;
  }

  .callback-content h2 {
    font-size: 1.25rem;
  }
}
</style>
