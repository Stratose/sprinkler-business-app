import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email || "");
  const userName = computed(() => user.value?.user_metadata?.full_name || user.value?.email || "");
  const userAvatar = computed(() => user.value?.user_metadata?.avatar_url || "");

  // Actions
  const signInWithGoogle = async () => {
    try {
      loading.value = true;
      error.value = null;

      // Determine the correct redirect URL based on environment
      let redirectTo: string;

      if (import.meta.env.DEV) {
        // Development - use localhost
        redirectTo = `${window.location.origin}/auth/callback`;
      } else {
        // Production - ensure we use the production domain
        const currentOrigin = window.location.origin;

        // If we're somehow on localhost in production, force the production URL
        if (currentOrigin.includes("localhost") || currentOrigin.includes("127.0.0.1")) {
          redirectTo = "https://sprinkler-business-app.vercel.app/auth/callback";
        } else {
          redirectTo = `${currentOrigin}/auth/callback`;
        }
      }

      console.log("🔧 OAuth redirect URL:", redirectTo);

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // OAuth redirect will happen automatically
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Authentication failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Development-only authentication bypass
  const signInWithDev = async () => {
    if (!import.meta.env.DEV) {
      throw new Error("Development authentication is only available in development mode");
    }

    try {
      loading.value = true;
      error.value = null;

      // Create a mock user session that matches the OAuth structure
      const mockUser = {
        id: "dev-user-123",
        email: "developer@sprinkler-app.dev",
        user_metadata: {
          full_name: "Development User",
          avatar_url:
            "https://ui-avatars.com/api/?name=Dev+User&background=4299e1&color=fff&size=128",
          email: "developer@sprinkler-app.dev",
        },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockSession = {
        access_token: "dev-access-token",
        refresh_token: "dev-refresh-token",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        user: mockUser,
      };

      // Set the mock session in our store
      session.value = mockSession as Session;
      user.value = mockUser as User;

      console.log("🔧 Development authentication successful:", mockUser.email);

      return { user: mockUser, session: mockSession };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Development authentication failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    try {
      loading.value = true;
      error.value = null;

      // Check if this is a development session
      if (import.meta.env.DEV && session.value?.access_token === "dev-access-token") {
        console.log("🔧 Development session sign out");
        // For dev sessions, just clear the local state
        user.value = null;
        session.value = null;
        return;
      }

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      // Clear state
      user.value = null;
      session.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Sign out failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const initialize = async () => {
    try {
      loading.value = true;
      error.value = null;

      console.log("🔧 Initializing authentication...");

      // Get initial session
      const {
        data: { session: initialSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (initialSession) {
        session.value = initialSession;
        user.value = initialSession.user;
        console.log("🔧 Found existing session:", initialSession.user?.email);
      } else {
        console.log("🔧 No existing session found");
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log("🔧 Auth state changed:", event, newSession?.user?.email);

        // Set loading state during auth state transitions
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          loading.value = true;
        }

        try {
          session.value = newSession;
          user.value = newSession?.user || null;

          if (event === "SIGNED_IN") {
            console.log("✅ User signed in:", newSession?.user?.email);
          }

          if (event === "SIGNED_OUT") {
            console.log("✅ User signed out");
          }

          // Clear any previous errors on successful auth state changes
          error.value = null;
        } catch (err) {
          console.error("Auth state change error:", err);
          error.value = err instanceof Error ? err.message : "Authentication state error";
        } finally {
          loading.value = false;
        }
      });

      initialized.value = true;
      console.log("✅ Authentication initialized successfully");
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Initialization failed";
      console.error("❌ Auth initialization error:", err);
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  // Helper method to wait for auth initialization
  const waitForInitialization = async (timeout = 10000) => {
    if (initialized.value) {
      return;
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Auth initialization timeout"));
      }, timeout);

      const unwatch = watch(initialized, (newValue) => {
        if (newValue) {
          clearTimeout(timeoutId);
          unwatch();
          resolve(true);
        }
      });
    });
  };

  return {
    // State
    user,
    session,
    loading,
    error,
    initialized,

    // Getters
    isAuthenticated,
    userEmail,
    userName,
    userAvatar,

    // Actions
    signInWithGoogle,
    signInWithDev,
    signOut,
    initialize,
    clearError,
    waitForInitialization,
  };
});
