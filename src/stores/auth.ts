import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

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

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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

  const signOut = async () => {
    try {
      loading.value = true;
      error.value = null;

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

      // Get initial session
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (initialSession) {
        session.value = initialSession;
        user.value = initialSession.user;
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);

        session.value = newSession;
        user.value = newSession?.user || null;

        if (event === "SIGNED_IN") {
          console.log("User signed in:", newSession?.user?.email);
        }

        if (event === "SIGNED_OUT") {
          console.log("User signed out");
        }
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Initialization failed";
      console.error("Auth initialization error:", err);
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    user,
    session,
    loading,
    error,

    // Getters
    isAuthenticated,
    userEmail,
    userName,
    userAvatar,

    // Actions
    signInWithGoogle,
    signOut,
    initialize,
    clearError,
  };
});
