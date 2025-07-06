import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthLogin from "../components/AuthLogin.vue";
import AuthCallback from "../views/AuthCallback.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: AuthLogin,
      meta: { requiresAuth: false },
    },
    {
      path: "/auth/callback",
      name: "auth-callback",
      component: AuthCallback,
      meta: { requiresAuth: false },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard for authentication
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // Wait for auth initialization if still loading
  if (authStore.loading) {
    await new Promise((resolve) => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.loading) {
          unwatch();
          resolve(true);
        }
      });
    });
  }

  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = authStore.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page
    return { name: "login" };
  }

  if (!requiresAuth && isAuthenticated && to.name === "login") {
    // Redirect authenticated users away from login page
    return { name: "home" };
  }
});

export default router;
