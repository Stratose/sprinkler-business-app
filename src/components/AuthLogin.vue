<template>
  <div class="auth-login">
    <div class="login-container">
      <div class="login-header">
        <h1>🌊 Sprinkler Business Manager</h1>
        <p>Sign in to manage your customers and appointments</p>
      </div>

      <div class="login-form">
        <button @click="handleGoogleSignIn" :disabled="authStore.loading" class="google-signin-btn">
          <div v-if="authStore.loading" class="button-spinner">
            <div class="spinner-ring"></div>
          </div>
          <svg v-else class="google-icon" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span v-if="!authStore.loading">Continue with Google</span>
          <span v-else>Redirecting to Google...</span>
        </button>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
          <button @click="authStore.clearError" class="clear-error">✕</button>
        </div>

        <!-- Development-only authentication bypass -->
        <div v-if="isDevelopment" class="dev-auth-section">
          <div class="dev-divider">
            <span>Development Only</span>
          </div>
          <button @click="handleDevSignIn" :disabled="authStore.loading" class="dev-signin-btn">
            <div v-if="authStore.loading" class="button-spinner">
              <div class="spinner-ring"></div>
            </div>
            <span v-else class="dev-icon">🔧</span>
            <span v-if="!authStore.loading">Quick Dev Login</span>
            <span v-else>Signing in...</span>
          </button>
          <p class="dev-warning">This button is automatically disabled in production</p>
        </div>
      </div>

      <div class="login-footer">
        <p>Secure authentication powered by Google</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// Check if we're in development mode
const isDevelopment = computed(() => import.meta.env.DEV);

const handleGoogleSignIn = async () => {
  try {
    await authStore.signInWithGoogle();
  } catch (error) {
    console.error("Sign in failed:", error);
  }
};

const handleDevSignIn = async () => {
  try {
    await authStore.signInWithDev();
    // Navigate to home page after successful dev auth
    router.push("/");
  } catch (error) {
    console.error("Dev sign in failed:", error);
  }
};
</script>

<style scoped>
.auth-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-header {
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.login-header p {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.login-form {
  margin-bottom: 2rem;
}

.google-signin-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.2s;
}

.google-signin-btn:hover:not(:disabled) {
  border-color: #4285f4;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.15);
}

.google-signin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.button-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-spinner .spinner-ring {
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #4285f4;
  border-radius: 50%;
  animation: button-spin 1s linear infinite;
}

@keyframes button-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 6px;
  color: #c53030;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clear-error {
  background: none;
  border: none;
  color: #c53030;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
}

.login-footer {
  color: #a0aec0;
  font-size: 0.875rem;
}

.login-footer p {
  margin: 0;
}

/* Development authentication styles */
.dev-auth-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.dev-divider {
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
}

.dev-divider span {
  background: white;
  padding: 0 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #f56565;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dev-signin-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: #fff5f5;
  border: 2px solid #feb2b2;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #c53030;
  cursor: pointer;
  transition: all 0.2s;
}

.dev-signin-btn:hover:not(:disabled) {
  background: #fed7d7;
  border-color: #f56565;
}

.dev-signin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.dev-icon {
  font-size: 1.25rem;
}

.dev-warning {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #a0aec0;
  text-align: center;
  font-style: italic;
}

/* Mobile responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
