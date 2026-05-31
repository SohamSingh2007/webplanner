import { createClient } from "@supabase/supabase-js";

// EDIT THESE IF YOU WANT TO HARDCODE CREDENTIALS:
export const SUPABASE_URL_DEFAULT = "";
export const SUPABASE_ANON_KEY_DEFAULT = "";

let supabaseInstance = null;

export function getSupabaseCredentials() {
  if (typeof window !== "undefined") {
    const localUrl = localStorage.getItem("ca_tracker_supabase_url");
    const localKey = localStorage.getItem("ca_tracker_supabase_anon_key");
    if (localUrl && localKey) {
      return { url: localUrl, anonKey: localKey, isCustom: true };
    }
  }
  
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_DEFAULT;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_DEFAULT;
  
  return { 
    url: envUrl ? envUrl.trim() : "", 
    anonKey: envKey ? envKey.trim() : "", 
    isCustom: false 
  };
}

export function initSupabase() {
  const { url, anonKey } = getSupabaseCredentials();
  
  if (!url || !anonKey || url === "" || url.includes("PLACEHOLDER") || url.includes("your-supabase")) {
    return null;
  }
  
  try {
    // If instance already created with the same config, return it
    if (supabaseInstance && supabaseInstance.supabaseUrl === url) {
      return supabaseInstance;
    }
    
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    return supabaseInstance;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
}

export function getSupabase() {
  return initSupabase();
}

// Helper to save custom credentials
export function saveSupabaseCredentials(url, anonKey) {
  if (typeof window !== "undefined") {
    if (!url || !anonKey) {
      localStorage.removeItem("ca_tracker_supabase_url");
      localStorage.removeItem("ca_tracker_supabase_anon_key");
    } else {
      localStorage.setItem("ca_tracker_supabase_url", url.trim());
      localStorage.setItem("ca_tracker_supabase_anon_key", anonKey.trim());
    }
    window.location.reload();
  }
}

// Helper to clear credentials
export function clearSupabaseCredentials() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ca_tracker_supabase_url");
    localStorage.removeItem("ca_tracker_supabase_anon_key");
    window.location.reload();
  }
}
