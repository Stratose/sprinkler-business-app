<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

onMounted(async () => {
  // Initialize authentication
  await authStore.initialize();
});

const handleSignOut = async () => {
  try {
    await authStore.signOut();
  } catch (error) {
    console.error("Sign out failed:", error);
  }
};
</script>

<template>
  <div id="app">
    <!-- Show loading state during auth initialization -->
    <div v-if="authStore.loading" class="loading-screen">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
      </div>
      <p>Loading...</p>
    </div>

    <!-- Main app content when not loading -->
    <div v-else>
      <!-- Navigation header for authenticated users -->
      <header v-if="authStore.isAuthenticated" class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <h1>🌊 Sprinkler Manager</h1>
          </div>

          <nav class="main-nav">
            <RouterLink to="/" class="nav-link">Dashboard</RouterLink>
            <RouterLink to="/about" class="nav-link">About</RouterLink>
          </nav>

          <div class="user-section">
            <div class="user-info">
              <img
                v-if="authStore.userAvatar"
                :src="authStore.userAvatar"
                :alt="authStore.userName"
                class="user-avatar"
              />
              <div class="user-details">
                <span class="user-name">{{ authStore.userName }}</span>
                <span class="user-email">{{ authStore.userEmail }}</span>
              </div>
            </div>
            <button @click="handleSignOut" class="sign-out-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Main content area -->
      <main class="main-content" :class="{ 'with-header': authStore.isAuthenticated }">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Loading screen */
.loading-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.loading-spinner {
  margin-bottom: 1rem;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
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

/* App header */
.app-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-section h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 600;
}

.main-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #f7fafc;
  color: #2d3748;
}

.nav-link.router-link-active {
  background: #edf2f7;
  color: #2d3748;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.875rem;
}

.user-email {
  font-size: 0.75rem;
  color: #718096;
}

.sign-out-btn {
  background: #f56565;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.sign-out-btn:hover {
  background: #e53e3e;
}

/* Main content */
.main-content {
  flex: 1;
  background: #f7fafc;
}

.main-content.with-header {
  min-height: calc(100vh - 64px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 0 0.5rem;
    gap: 1rem;
  }

  .logo-section h1 {
    font-size: 1.25rem;
  }

  .main-nav {
    gap: 1rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .user-details {
    display: none;
  }

  .sign-out-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .main-nav {
    display: none;
  }

  .header-content {
    justify-content: space-between;
  }
}
</style>
