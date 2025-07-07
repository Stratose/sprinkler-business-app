<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h1>Welcome back, {{ authStore.userName }}! 👋</h1>
        <p>Here's what's happening with your sprinkler business today.</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Total Customers</h3>
            <p class="stat-number">{{ customerCount }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>Today's Appointments</h3>
            <p class="stat-number">{{ todayAppointments }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <h3>Recent Notes</h3>
            <p class="stat-number">{{ recentNotes }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📸</div>
          <div class="stat-content">
            <h3>Media Files</h3>
            <p class="stat-number">{{ mediaFiles }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="actions-section">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <router-link to="/customers/add" class="action-btn primary">
            <span class="action-icon">➕</span>
            <span>Add Customer</span>
          </router-link>

          <router-link to="/customers" class="action-btn">
            <span class="action-icon">👥</span>
            <span>View Customers</span>
          </router-link>

          <button class="action-btn" disabled>
            <span class="action-icon">📅</span>
            <span>Schedule Appointment</span>
          </button>

          <router-link to="/map" class="action-btn">
            <span class="action-icon">🗺️</span>
            <span>View Map</span>
          </router-link>
        </div>
      </div>

      <!-- System Status -->
      <div class="system-status">
        <h3>System Status</h3>
        <div class="status-grid">
          <div class="status-item">
            <span class="status-indicator success"></span>
            <span>Database Connection</span>
            <span class="status-value">✅ Connected</span>
          </div>

          <div class="status-item">
            <span class="status-indicator success"></span>
            <span>Authentication</span>
            <span class="status-value">✅ Active</span>
          </div>

          <div class="status-item">
            <span class="status-indicator success"></span>
            <span>Data Sync</span>
            <span class="status-value">✅ Up to date</span>
          </div>
        </div>
      </div>

      <!-- Development Progress (temporary) -->
      <div class="dev-progress" v-if="showDevProgress">
        <h3>🚧 Development Progress</h3>
        <div class="progress-list">
          <div class="progress-item completed">
            <span class="progress-icon">✅</span>
            <span>Database schema & authentication</span>
          </div>
          <div class="progress-item completed">
            <span class="progress-icon">✅</span>
            <span>Google OAuth integration</span>
          </div>
          <div class="progress-item completed">
            <span class="progress-icon">✅</span>
            <span>Customer management interface</span>
          </div>
          <div class="progress-item completed">
            <span class="progress-icon">✅</span>
            <span>Google Maps integration</span>
          </div>
          <div class="progress-item pending">
            <span class="progress-icon">⏳</span>
            <span>Notes and media system</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/lib/supabase";

const authStore = useAuthStore();

// Dashboard stats (placeholder data for now)
const customerCount = ref(0);
const todayAppointments = ref(0);
const recentNotes = ref(0);
const mediaFiles = ref(0);
const showDevProgress = ref(true); // Show development progress temporarily

// Load dashboard data
const loadDashboardData = async () => {
  try {
    // Get customer count
    const { count: customers } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });
    customerCount.value = customers || 0;

    // Get today's appointments count
    const today = new Date().toISOString().split("T")[0];
    const { count: appointments } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .gte("appointment_date", today)
      .lt("appointment_date", `${today}T23:59:59`);
    todayAppointments.value = appointments || 0;

    // Get recent notes count (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: notes } = await supabase
      .from("customer_notes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString());
    recentNotes.value = notes || 0;

    // Get media files count
    const { count: media } = await supabase
      .from("media_files")
      .select("*", { count: "exact", head: true });
    mediaFiles.value = media || 0;
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Welcome Section */
.welcome-section {
  text-align: center;
  margin-bottom: 1rem;
}

.welcome-section h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.welcome-section p {
  font-size: 1.125rem;
  color: #718096;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: #edf2f7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
}

/* Actions Section */
.actions-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.actions-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.action-btn.primary {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
}

.action-btn.primary:hover {
  background: #3182ce;
  border-color: #3182ce;
}

.action-icon {
  font-size: 1.25rem;
}

/* System Status */
.system-status {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.system-status h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #2d3748;
  font-weight: 600;
}

.status-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.success {
  background: #48bb78;
}

.status-value {
  margin-left: auto;
  font-weight: 500;
  color: #48bb78;
}

/* Development Progress */
.dev-progress {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 12px;
  padding: 1.5rem;
}

.dev-progress h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #c53030;
  font-weight: 600;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
}

.progress-item.completed {
  background: #f0fff4;
  color: #22543d;
}

.progress-item.in-progress {
  background: #fffbeb;
  color: #744210;
}

.progress-item.pending {
  background: #f7fafc;
  color: #4a5568;
}

.progress-icon {
  font-size: 1rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .welcome-section h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .status-grid {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 0.5rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .actions-section,
  .system-status,
  .dev-progress {
    padding: 1rem;
  }
}
</style>
