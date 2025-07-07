<template>
  <div class="loading-state" :class="{ 'full-screen': fullScreen }">
    <div class="loading-container">
      <div class="loading-content">
        <div class="spinner" :class="{ large: size === 'large', small: size === 'small' }">
          <div class="spinner-ring"></div>
        </div>
        <h3 v-if="title" class="loading-title">{{ title }}</h3>
        <p v-if="message" class="loading-message">{{ message }}</p>
        <div v-if="showProgress && progress !== null" class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  showProgress?: boolean;
  progress?: number | null;
}

withDefaults(defineProps<Props>(), {
  title: "",
  message: "",
  size: "medium",
  fullScreen: false,
  showProgress: false,
  progress: null,
});
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-state.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.loading-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring {
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner.small .spinner-ring {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.spinner.medium .spinner-ring {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner.large .spinner-ring {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-title {
  color: #2d3748;
  font-size: 1.25rem;
  margin: 0;
  font-weight: 600;
}

.loading-message {
  color: #718096;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4285f4, #34a853);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Mobile responsive */
@media (max-width: 480px) {
  .loading-container {
    padding: 1.5rem;
    margin: 1rem;
  }

  .loading-title {
    font-size: 1.1rem;
  }

  .loading-message {
    font-size: 0.8rem;
  }
}
</style>
