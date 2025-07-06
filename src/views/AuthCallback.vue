<template>
  <div class="auth-callback">
    <div class="callback-container">
      <div class="callback-content">
        <div class="spinner">
          <div class="spinner-ring"></div>
        </div>
        <h2>Completing sign in...</h2>
        <p>Please wait while we verify your authentication.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    // The auth state change will be handled by the store
    // Just wait a moment for the callback to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if we're authenticated
    if (authStore.isAuthenticated) {
      // Redirect to home page
      router.push("/");
    } else {
      // If not authenticated, redirect to login
      router.push("/login");
    }
  } catch (error) {
    console.error("Auth callback error:", error);
    router.push("/login");
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

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
