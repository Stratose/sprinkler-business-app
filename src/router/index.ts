import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthLogin from "../components/AuthLogin.vue";
import AuthCallback from "../views/AuthCallback.vue";
import CustomersView from "../views/CustomersView.vue";
import CustomerDetailView from "../views/CustomerDetailView.vue";
import AddCustomerView from "../views/AddCustomerView.vue";
import EditCustomerView from "../views/EditCustomerView.vue";
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
    {
      path: "/customers",
      name: "customers",
      component: CustomersView,
      meta: { requiresAuth: true },
    },
    {
      path: "/customers/add",
      name: "customers-add",
      component: AddCustomerView,
      meta: { requiresAuth: true },
    },
    {
      path: "/customers/:id",
      name: "customer-detail",
      component: CustomerDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: "/customers/:id/edit",
      name: "customer-edit",
      component: EditCustomerView,
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard for authentication
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // Skip auth check for OAuth callback route to avoid interference
  if (to.name === "auth-callback") {
    return true;
  }

  // Wait for auth initialization to complete
  try {
    await authStore.waitForInitialization();
  } catch (error) {
    console.error("Auth initialization failed in route guard:", error);
    // Continue with current auth state if timeout
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
