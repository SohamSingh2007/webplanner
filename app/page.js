"use client";

import React, { useState, useEffect } from "react";
import { 
  getSupabase, getSupabaseCredentials, saveSupabaseCredentials, 
  clearSupabaseCredentials, initSupabase 
} from "@/lib/supabase";
import { 
  DashboardTab, DailyPlannerTab, ChapterTrackerTab, RevisionPlannerTab, 
  HoursTrackerTab, MockTestTab, StudyTimerTab,
  PREDEFINED_CHAPTERS, SUBJECT_DETAILS, getLocalDateString
} from "@/components/tracker";
import { 
  BookOpen, Calendar, Clock, Award, FileText, CheckCircle, 
  Settings, LogOut, ShieldAlert, ArrowRight, Activity, Database, X, Timer, PenTool
} from "lucide-react";
import { useToast } from "@/components/toast";

export default function Home() {
  const toast = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [credentials, setCredentials] = useState({ url: "", anonKey: "", isCustom: false });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configUrl, setConfigUrl] = useState("");
  const [configAnonKey, setConfigAnonKey] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Auth states
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("dashboard");

  // Database States
  const [chapterProgress, setChapterProgress] = useState([]);
  const [dayPlans, setDayPlans] = useState([]);
  const [revisionEntries, setRevisionEntries] = useState([]);
  const [saTracker, setSaTracker] = useState([]);
  const [studyHours, setStudyHours] = useState([]);
  const [testScores, setTestScores] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [userPrefs, setUserPrefs] = useState({
    priorities: ["", "", ""],
    weak_topics: "",
    weekly_review: "",
    weekly_target: 42.0,
    productivity_rating: 3,
    habits_today: {
      woke_up: false,
      no_social_media: false,
      targets_met: false,
      revised_yesterday: false,
      active_posture: false
    }
  });

  // Countdown State
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [targetDateStr, setTargetDateStr] = useState("2026-09-08");
  const [isEditingTargetDate, setIsEditingTargetDate] = useState(false);

  const recalculateCountdown = (dateStr) => {
    if (!dateStr) return;
    const targetDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(diffDays > 0 ? diffDays : 0);
  };

  const handleTargetDateChange = (dateStr) => {
    setTargetDateStr(dateStr);
    localStorage.setItem("ca_tracker_target_date", dateStr);
    recalculateCountdown(dateStr);
  };

  const getAttemptLabel = () => {
    if (!targetDateStr) return "Custom Attempt";
    const date = new Date(targetDateStr);
    if (isNaN(date.getTime())) return "Custom Attempt";
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year} Attempt`;
  };

  // 1. Mount effect & initialization
  useEffect(() => {
    // Self-healing: clear typo-ridden URL in localStorage
    if (typeof window !== "undefined") {
      const localUrl = localStorage.getItem("ca_tracker_supabase_url");
      if (localUrl && localUrl.includes("cmcxunyaxhxsrqftbul")) {
        localStorage.removeItem("ca_tracker_supabase_url");
        localStorage.removeItem("ca_tracker_supabase_anon_key");
        window.location.reload();
        return;
      }
    }

    setIsMounted(true);
    
    // Load and recalculate target date
    const savedTarget = localStorage.getItem("ca_tracker_target_date") || "2026-09-08";
    setTargetDateStr(savedTarget);
    recalculateCountdown(savedTarget);

    // Init Supabase client
    const client = getSupabase();
    setSupabaseClient(client);

    // Get current credentials for setup view
    const creds = getSupabaseCredentials();
    setCredentials(creds);
    setConfigUrl(creds.url || "");
    setConfigAnonKey(creds.anonKey || "");

    // Check if client is initialized
    const isDemoActive = localStorage.getItem("ca_tracker_demo_active") === "true";
    if (isDemoActive || !client) {
      setIsDemoMode(true);
      const savedUser = localStorage.getItem("ca_tracker_demo_user");
      setUser(savedUser ? JSON.parse(savedUser) : { id: "demo-user", email: "demo@ca-planner.com" });
    } else {
      // Check auth session
      client.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
        } else {
          const demoActive = localStorage.getItem("ca_tracker_demo_active") === "true";
          if (demoActive) {
            setIsDemoMode(true);
            const savedUser = localStorage.getItem("ca_tracker_demo_user");
            setUser(savedUser ? JSON.parse(savedUser) : { id: "demo-user", email: "demo@ca-planner.com" });
          }
        }
      });

      // Listen to auth changes
      const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user);
          setIsDemoMode(false);
          localStorage.removeItem("ca_tracker_demo_active");
          localStorage.removeItem("ca_tracker_demo_user");
        } else {
          const demoActive = localStorage.getItem("ca_tracker_demo_active") === "true";
          if (!demoActive) {
            setUser(null);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // 2. Fetch Data once User/Demo is active
  useEffect(() => {
    if (!user) return;

    if (isDemoMode) {
      loadDemoData();
    } else {
      fetchSupabaseData();
    }
  }, [user, isDemoMode, supabaseClient]);

  // 3. Supabase Realtime Subscription Setup
  useEffect(() => {
    if (!supabaseClient || !user || isDemoMode) return;

    const channels = [];

    // Sub function helper
    const subscribeToTable = (table, stateSetter) => {
      const channel = supabaseClient
        .channel(`realtime:${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: table },
          (payload) => {
            // Apply filtering manually if user_id doesn't match
            if (payload.new && payload.new.user_id !== user.id) return;
            if (payload.old && payload.old.user_id && payload.old.user_id !== user.id) return;

            stateSetter((prev) => {
              if (payload.eventType === "INSERT") {
                // Prevent duplicate insertions
                if (prev.some(x => x.id === payload.new.id)) return prev;
                return [...prev, payload.new];
              }
              if (payload.eventType === "UPDATE") {
                return prev.map((x) => x.id === payload.new.id ? payload.new : x);
              }
              if (payload.eventType === "DELETE") {
                return prev.filter((x) => x.id !== payload.old.id);
              }
              return prev;
            });
          }
        )
        .subscribe();
      channels.push(channel);
    };

    // Subscriptions
    subscribeToTable("chapter_progress", setChapterProgress);
    subscribeToTable("day_plans", setDayPlans);
    subscribeToTable("revision_entries", setRevisionEntries);
    subscribeToTable("sa_tracker", setSaTracker);
    subscribeToTable("study_hours", setStudyHours);
    subscribeToTable("test_scores", setTestScores);
    subscribeToTable("mock_tests", setMockTests);

    // Special handler for user preferences (single object)
    const prefsChannel = supabaseClient
      .channel("realtime:user_preferences")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_preferences" },
        (payload) => {
          if (payload.new && payload.new.user_id === user.id) {
            setUserPrefs(payload.new);
          }
        }
      )
      .subscribe();
    channels.push(prefsChannel);

    return () => {
      channels.forEach(ch => supabaseClient.removeChannel(ch));
    };
  }, [supabaseClient, user, isDemoMode]);

  // Demo mode local storage load
  const loadDemoData = () => {
    if (typeof window === "undefined") return;

    setChapterProgress(JSON.parse(localStorage.getItem("ca_demo_chapter_progress") || "[]"));
    setDayPlans(JSON.parse(localStorage.getItem("ca_demo_day_plans") || "[]"));
    setRevisionEntries(JSON.parse(localStorage.getItem("ca_demo_revision_entries") || "[]"));
    setSaTracker(JSON.parse(localStorage.getItem("ca_demo_sa_tracker") || "[]"));
    setStudyHours(JSON.parse(localStorage.getItem("ca_demo_study_hours") || "[]"));
    setTestScores(JSON.parse(localStorage.getItem("ca_demo_test_scores") || "[]"));
    setMockTests(JSON.parse(localStorage.getItem("ca_demo_mock_tests") || "[]"));
    
    const prefs = localStorage.getItem("ca_demo_user_preferences");
    if (prefs) {
      setUserPrefs(JSON.parse(prefs));
    }
  };

  const fetchSupabaseData = async () => {
    if (!supabaseClient || !user) return;

    try {
      // 1. Chapter Progress
      const { data: cp } = await supabaseClient.from("chapter_progress").select("*").eq("user_id", user.id);
      setChapterProgress(cp || []);

      // 2. Day plans
      const { data: dp } = await supabaseClient.from("day_plans").select("*").eq("user_id", user.id);
      setDayPlans(dp || []);

      // 3. Revision Entries
      const { data: re } = await supabaseClient.from("revision_entries").select("*").eq("user_id", user.id);
      setRevisionEntries(re || []);

      // 4. SA Tracker
      const { data: sa } = await supabaseClient.from("sa_tracker").select("*").eq("user_id", user.id);
      setSaTracker(sa || []);

      // 5. Study Hours
      const { data: sh } = await supabaseClient.from("study_hours").select("*").eq("user_id", user.id);
      setStudyHours(sh || []);

      // 6. Test scores
      const { data: ts } = await supabaseClient.from("test_scores").select("*").eq("user_id", user.id);
      setTestScores(ts || []);

      // 7. Mock tests
      const { data: mt } = await supabaseClient.from("mock_tests").select("*").eq("user_id", user.id);
      setMockTests(mt || []);

      // 8. User preferences
      const { data: prefs } = await supabaseClient.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle();
      if (prefs) {
        setUserPrefs(prefs);
      } else {
        // Create initial prefs in Supabase
        const initialPrefs = {
          user_id: user.id,
          priorities: ["", "", ""],
          weak_topics: "",
          weekly_review: "",
          weekly_target: 42.0,
          productivity_rating: 3,
          habits_today: {
            woke_up: false,
            no_social_media: false,
            targets_met: false,
            revised_yesterday: false,
            active_posture: false
          }
        };
        await supabaseClient.from("user_preferences").upsert(initialPrefs);
        setUserPrefs(initialPrefs);
      }
    } catch (err) {
      console.error("Error fetching database records:", err);
    }
  };

  const handleLocalMockAuth = () => {
    if (typeof window === "undefined") return;

    const mockUsers = JSON.parse(localStorage.getItem("ca_mock_users") || "[]");

    if (isSignUp) {
      if (mockUsers.some(u => u.email === email)) {
        setAuthError("Email already registered locally.");
        setAuthLoading(false);
        return;
      }
      const newUser = { id: `local-user-${Math.random().toString(36).substring(7)}`, email, password };
      mockUsers.push(newUser);
      localStorage.setItem("ca_mock_users", JSON.stringify(mockUsers));
      toast.success("Account created! You can now sign in.");
      setIsSignUp(false);
    } else {
      const match = mockUsers.find(u => u.email === email && u.password === password);
      if (match) {
        setIsDemoMode(true);
        setUser(match);
        localStorage.setItem("ca_tracker_demo_active", "true");
        localStorage.setItem("ca_tracker_demo_user", JSON.stringify(match));
      } else {
        // If no users exist, auto-create to make it zero-friction!
        if (mockUsers.length === 0) {
          const newUser = { id: "local-user-demo", email, password };
          localStorage.setItem("ca_mock_users", JSON.stringify([newUser]));
          setIsDemoMode(true);
          setUser(newUser);
          localStorage.setItem("ca_tracker_demo_active", "true");
          localStorage.setItem("ca_tracker_demo_user", JSON.stringify(newUser));
        } else {
          setAuthError("Invalid email or password.");
        }
      }
    }
    setAuthLoading(false);
  };

  // Auth Operations
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    if (isDemoMode || !supabaseClient) {
      handleLocalMockAuth();
      return;
    }

    try {
      if (isSignUp) {
        const { error, data } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Registered! Check your email to confirm your account, then sign in.");
        setIsSignUp(false);
      } else {
        const { error, data } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
      }
    } catch (err) {
      console.warn("Supabase Auth failed, falling back to local auth:", err);
      // Fallback to local auth if network fetch fails!
      if (err.message && (err.message.includes("fetch") || err.message.includes("NetworkError") || err.message.includes("Failed to fetch"))) {
        handleLocalMockAuth();
      } else {
        setAuthError(err.message || "Authentication failed.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setUser(null);
      const demoKeys = [
        "ca_tracker_demo_active",
        "ca_tracker_demo_user",
        "ca_demo_chapter_progress",
        "ca_demo_day_plans",
        "ca_demo_revision_entries",
        "ca_demo_sa_tracker",
        "ca_demo_study_hours",
        "ca_demo_test_scores",
        "ca_demo_mock_tests",
        "ca_demo_user_preferences"
      ];
      demoKeys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    } else if (supabaseClient) {
      await supabaseClient.auth.signOut();
      setUser(null);
    }
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setUser({ id: "demo-user", email: "demo@ca-planner.com" });
    localStorage.setItem("ca_tracker_demo_active", "true");
    loadDemoData();
  };

  // DATABASE WRITES
  // 1. Update Chapter Progress Checked Status
  const handleUpdateChapterProgress = async (id, updates, info = {}) => {
    if (isDemoMode) {
      let updatedList;
      if (id) {
        updatedList = chapterProgress.map(x => x.id === id ? { ...x, ...updates } : x);
      } else {
        const newRecord = {
          id: Math.random().toString(36).substring(7),
          user_id: user.id,
          subject: info.subject,
          chapter_index: info.chapter_index,
          done: false,
          rev1: false,
          rev2: false,
          rev3: false,
          test_done: false,
          notes: "",
          date_completed: null,
          ...updates
        };
        updatedList = [...chapterProgress, newRecord];
      }
      setChapterProgress(updatedList);
      localStorage.setItem("ca_demo_chapter_progress", JSON.stringify(updatedList));
    } else {
      try {
        if (id) {
          // Optimistically update
          setChapterProgress(prev => prev.map(x => x.id === id ? { ...x, ...updates } : x));
          const { data, error } = await supabaseClient
            .from("chapter_progress")
            .update(updates)
            .eq("id", id)
            .select();
          if (error) throw error;
          if (data && data[0]) {
            setChapterProgress(prev => prev.map(x => x.id === id ? data[0] : x));
          }
        } else {
          // Insert/Upsert new progress record
          const { data, error } = await supabaseClient
            .from("chapter_progress")
            .upsert({
              user_id: user.id,
              subject: info.subject,
              chapter_index: info.chapter_index,
              ...updates
            })
            .select();
          if (error) throw error;
          if (data && data[0]) {
            setChapterProgress(prev => {
              const filtered = prev.filter(x => !(x.subject === info.subject && x.chapter_index === info.chapter_index));
              return [...filtered, data[0]];
            });
          }
        }
      } catch (err) {
        console.error("Error updating chapter progress in Supabase:", err);
        toast.error("Failed to save chapter progress: " + err.message);
      }
    }
  };

  // 2. Day Planner Writes
  const handleAddPlan = async (payload) => {
    if (isDemoMode) {
      const newPlan = { id: Math.random().toString(36).substring(7), user_id: user.id, ...payload };
      const updatedList = [...dayPlans, newPlan];
      setDayPlans(updatedList);
      localStorage.setItem("ca_demo_day_plans", JSON.stringify(updatedList));
    } else {
      try {
        // Optimistic update with temporary ID
        const tempId = `temp-${Math.random().toString(36).substring(7)}`;
        const tempPlan = { id: tempId, user_id: user.id, ...payload };
        setDayPlans(prev => [...prev, tempPlan]);

        const { data, error } = await supabaseClient
          .from("day_plans")
          .insert({ user_id: user.id, ...payload })
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setDayPlans(prev => prev.map(x => x.id === tempId ? data[0] : x));
        }
      } catch (err) {
        console.error("Error adding day plan to Supabase:", err);
        toast.error("Failed to add plan: " + err.message);
      }
    }
  };

  const handleUpdatePlan = async (id, updates) => {
    if (isDemoMode) {
      const updatedList = dayPlans.map(x => x.id === id ? { ...x, ...updates } : x);
      setDayPlans(updatedList);
      localStorage.setItem("ca_demo_day_plans", JSON.stringify(updatedList));
    } else {
      try {
        setDayPlans(prev => prev.map(x => x.id === id ? { ...x, ...updates } : x));
        const { data, error } = await supabaseClient
          .from("day_plans")
          .update(updates)
          .eq("id", id)
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setDayPlans(prev => prev.map(x => x.id === id ? data[0] : x));
        }
      } catch (err) {
        console.error("Error updating day plan in Supabase:", err);
        toast.error("Failed to update plan: " + err.message);
      }
    }
  };

  const handleDeletePlan = async (id) => {
    if (isDemoMode) {
      const updatedList = dayPlans.filter(x => x.id !== id);
      setDayPlans(updatedList);
      localStorage.setItem("ca_demo_day_plans", JSON.stringify(updatedList));
    } else {
      try {
        setDayPlans(prev => prev.filter(x => x.id !== id));
        const { error } = await supabaseClient
          .from("day_plans")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.error("Error deleting day plan in Supabase:", err);
        toast.error("Failed to delete plan: " + err.message);
      }
    }
  };

  // 3. Revision Log Writes
  const handleAddRevision = async (payload) => {
    if (isDemoMode) {
      const newRev = { id: Math.random().toString(36).substring(7), user_id: user.id, ...payload };
      const updatedList = [...revisionEntries, newRev];
      setRevisionEntries(updatedList);
      localStorage.setItem("ca_demo_revision_entries", JSON.stringify(updatedList));
    } else {
      try {
        const tempId = `temp-${Math.random().toString(36).substring(7)}`;
        const tempRev = { id: tempId, user_id: user.id, ...payload };
        setRevisionEntries(prev => [...prev, tempRev]);

        const { data, error } = await supabaseClient
          .from("revision_entries")
          .insert({ user_id: user.id, ...payload })
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setRevisionEntries(prev => prev.map(x => x.id === tempId ? data[0] : x));
        }
      } catch (err) {
        console.error("Error adding revision to Supabase:", err);
        toast.error("Failed to add revision: " + err.message);
      }
    }
  };

  const handleUpdateRevision = async (id, updates) => {
    if (isDemoMode) {
      const updatedList = revisionEntries.map(x => x.id === id ? { ...x, ...updates } : x);
      setRevisionEntries(updatedList);
      localStorage.setItem("ca_demo_revision_entries", JSON.stringify(updatedList));
    } else {
      try {
        setRevisionEntries(prev => prev.map(x => x.id === id ? { ...x, ...updates } : x));
        const { data, error } = await supabaseClient
          .from("revision_entries")
          .update(updates)
          .eq("id", id)
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setRevisionEntries(prev => prev.map(x => x.id === id ? data[0] : x));
        }
      } catch (err) {
        console.error("Error updating revision in Supabase:", err);
        toast.error("Failed to update revision: " + err.message);
      }
    }
  };

  const handleDeleteRevision = async (id) => {
    if (isDemoMode) {
      const updatedList = revisionEntries.filter(x => x.id !== id);
      setRevisionEntries(updatedList);
      localStorage.setItem("ca_demo_revision_entries", JSON.stringify(updatedList));
    } else {
      try {
        setRevisionEntries(prev => prev.filter(x => x.id !== id));
        const { error } = await supabaseClient
          .from("revision_entries")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.error("Error deleting revision from Supabase:", err);
        toast.error("Failed to delete revision: " + err.message);
      }
    }
  };

  // 4. Audit SA Tracker Writes
  const handleUpdateSa = async (id, code, completed) => {
    if (isDemoMode) {
      let updatedList;
      if (id) {
        updatedList = saTracker.map(x => x.id === id ? { ...x, completed } : x);
      } else {
        const newRecord = { id: Math.random().toString(36).substring(7), user_id: user.id, sa_code: code, completed };
        updatedList = [...saTracker, newRecord];
      }
      setSaTracker(updatedList);
      localStorage.setItem("ca_demo_sa_tracker", JSON.stringify(updatedList));
    } else {
      try {
        if (id) {
          setSaTracker(prev => prev.map(x => x.id === id ? { ...x, completed } : x));
          const { data, error } = await supabaseClient
            .from("sa_tracker")
            .update({ completed })
            .eq("id", id)
            .select();
          if (error) throw error;
          if (data && data[0]) {
            setSaTracker(prev => prev.map(x => x.id === id ? data[0] : x));
          }
        } else {
          const { data, error } = await supabaseClient
            .from("sa_tracker")
            .upsert({ user_id: user.id, sa_code: code, completed })
            .select();
          if (error) throw error;
          if (data && data[0]) {
            setSaTracker(prev => {
              const filtered = prev.filter(x => x.sa_code !== code);
              return [...filtered, data[0]];
            });
          }
        }
      } catch (err) {
        console.error("Error updating SA tracker in Supabase:", err);
        toast.error("Failed to update SA status: " + err.message);
      }
    }
  };

  // 5. Study Hours Logs
  const handleUpdateHours = async (dateStr, totalHours) => {
    const existing = studyHours.find(h => h.date === dateStr);
    if (isDemoMode) {
      let updatedList;
      if (existing) {
        updatedList = studyHours.map(x => x.date === dateStr ? { ...x, total_hours: totalHours } : x);
      } else {
        const newRecord = { id: Math.random().toString(36).substring(7), user_id: user.id, date: dateStr, total_hours: totalHours };
        updatedList = [...studyHours, newRecord];
      }
      setStudyHours(updatedList);
      localStorage.setItem("ca_demo_study_hours", JSON.stringify(updatedList));
    } else {
      try {
        if (existing) {
          setStudyHours(prev => prev.map(x => x.id === existing.id ? { ...x, total_hours: totalHours } : x));
          const { data, error } = await supabaseClient
            .from("study_hours")
            .update({ total_hours: totalHours })
            .eq("id", existing.id)
            .select();
          if (error) throw error;
          if (data && data[0]) {
            setStudyHours(prev => prev.map(x => x.id === existing.id ? data[0] : x));
          }
        } else {
          const { data, error } = await supabaseClient
            .from("study_hours")
            .upsert({ user_id: user.id, date: dateStr, total_hours: totalHours })
            .select();
          if (error) throw error;
          if (data && data[0]) {
            setStudyHours(prev => {
              const filtered = prev.filter(x => x.date !== dateStr);
              return [...filtered, data[0]];
            });
          }
        }
      } catch (err) {
        console.error("Error updating study hours in Supabase:", err);
        toast.error("Failed to save study hours: " + err.message);
      }
    }
  };

  // 6. Test Scores Logs
  const handleAddTest = async (payload) => {
    if (isDemoMode) {
      const newTest = { id: Math.random().toString(36).substring(7), user_id: user.id, ...payload };
      const updatedList = [...testScores, newTest];
      setTestScores(updatedList);
      localStorage.setItem("ca_demo_test_scores", JSON.stringify(updatedList));
    } else {
      try {
        const tempId = `temp-${Math.random().toString(36).substring(7)}`;
        const tempTest = { id: tempId, user_id: user.id, ...payload };
        setTestScores(prev => [...prev, tempTest]);

        const { data, error } = await supabaseClient
          .from("test_scores")
          .insert({ user_id: user.id, ...payload })
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setTestScores(prev => prev.map(x => x.id === tempId ? data[0] : x));
        }
      } catch (err) {
        console.error("Error adding test score to Supabase:", err);
        toast.error("Failed to add test score: " + err.message);
      }
    }
  };

  const handleUpdateTest = async (id, updates) => {
    if (isDemoMode) {
      const updatedList = testScores.map(x => x.id === id ? { ...x, ...updates } : x);
      setTestScores(updatedList);
      localStorage.setItem("ca_demo_test_scores", JSON.stringify(updatedList));
    } else {
      try {
        setTestScores(prev => prev.map(x => x.id === id ? { ...x, ...updates } : x));
        const { data, error } = await supabaseClient
          .from("test_scores")
          .update(updates)
          .eq("id", id)
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setTestScores(prev => prev.map(x => x.id === id ? data[0] : x));
        }
      } catch (err) {
        console.error("Error updating test score in Supabase:", err);
        toast.error("Failed to update test score: " + err.message);
      }
    }
  };

  const handleDeleteTest = async (id) => {
    if (isDemoMode) {
      const updatedList = testScores.filter(x => x.id !== id);
      setTestScores(updatedList);
      localStorage.setItem("ca_demo_test_scores", JSON.stringify(updatedList));
    } else {
      try {
        setTestScores(prev => prev.filter(x => x.id !== id));
        const { error } = await supabaseClient
          .from("test_scores")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.error("Error deleting test score from Supabase:", err);
        toast.error("Failed to delete test score: " + err.message);
      }
    }
  };

  // 7. Mock Test Logs
  const handleAddMock = async (payload) => {
    if (isDemoMode) {
      const newMock = { id: Math.random().toString(36).substring(7), user_id: user.id, ...payload };
      const updatedList = [...mockTests, newMock];
      setMockTests(updatedList);
      localStorage.setItem("ca_demo_mock_tests", JSON.stringify(updatedList));
    } else {
      try {
        const tempId = `temp-${Math.random().toString(36).substring(7)}`;
        const tempMock = { id: tempId, user_id: user.id, ...payload };
        setMockTests(prev => [...prev, tempMock]);

        const { data, error } = await supabaseClient
          .from("mock_tests")
          .insert({ user_id: user.id, ...payload })
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setMockTests(prev => prev.map(x => x.id === tempId ? data[0] : x));
        }
      } catch (err) {
        console.error("Error adding mock test to Supabase:", err);
        toast.error("Failed to add mock test: " + err.message);
      }
    }
  };

  const handleUpdateMock = async (id, updates) => {
    if (isDemoMode) {
      const updatedList = mockTests.map(x => x.id === id ? { ...x, ...updates } : x);
      setMockTests(updatedList);
      localStorage.setItem("ca_demo_mock_tests", JSON.stringify(updatedList));
    } else {
      try {
        setMockTests(prev => prev.map(x => x.id === id ? { ...x, ...updates } : x));
        const { data, error } = await supabaseClient
          .from("mock_tests")
          .update(updates)
          .eq("id", id)
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setMockTests(prev => prev.map(x => x.id === id ? data[0] : x));
        }
      } catch (err) {
        console.error("Error updating mock test in Supabase:", err);
        toast.error("Failed to update mock test: " + err.message);
      }
    }
  };

  const handleDeleteMock = async (id) => {
    if (isDemoMode) {
      const updatedList = mockTests.filter(x => x.id !== id);
      setMockTests(updatedList);
      localStorage.setItem("ca_demo_mock_tests", JSON.stringify(updatedList));
    } else {
      try {
        setMockTests(prev => prev.filter(x => x.id !== id));
        const { error } = await supabaseClient
          .from("mock_tests")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.error("Error deleting mock test from Supabase:", err);
        toast.error("Failed to delete mock test: " + err.message);
      }
    }
  };

  // 8. User Prefs update
  const handleUpdatePrefs = async (updates) => {
    const updatedPrefs = { ...userPrefs, ...updates };
    setUserPrefs(updatedPrefs);

    if (isDemoMode) {
      localStorage.setItem("ca_demo_user_preferences", JSON.stringify(updatedPrefs));
    } else if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from("user_preferences").upsert({
          user_id: user.id,
          ...updatedPrefs
        });
        if (error) throw error;
      } catch (err) {
        console.error("Error updating preferences in Supabase:", err);
      }
    }
  };

  // AUTO CALCULATIONS
  const getCalculatedStats = () => {
    const totalChapters = PREDEFINED_CHAPTERS.length;
    
    // Subject wise counts
    const subjects = {
      costing: { name: "Costing", total: 0, done: 0, revised: 0, tested: 0, pct: 0 },
      fm: { name: "FM", total: 0, done: 0, revised: 0, tested: 0, pct: 0 },
      audit: { name: "Audit", total: 0, done: 0, revised: 0, tested: 0, pct: 0 },
      sm: { name: "SM", total: 0, done: 0, revised: 0, tested: 0, pct: 0 },
    };

    // Prepopulate total counts per subject
    PREDEFINED_CHAPTERS.forEach(ch => {
      if (subjects[ch.subject]) {
        subjects[ch.subject].total += 1;
      }
    });

    // Populate actual completions
    chapterProgress.forEach(prog => {
      const sub = prog.subject;
      if (subjects[sub]) {
        if (prog.done) subjects[sub].done += 1;
        
        // Sum total revisions
        let revCount = 0;
        if (prog.rev1) revCount++;
        if (prog.rev2) revCount++;
        if (prog.rev3) revCount++;
        subjects[sub].revived = (subjects[sub].revived || 0) + revCount;

        if (prog.test_done) subjects[sub].tested += 1;
      }
    });

    // Calculate subject percentages
    let sumPercentages = 0;
    Object.keys(subjects).forEach(key => {
      const s = subjects[key];
      s.pct = s.total > 0 ? (s.done / s.total) * 100 : 0;
      sumPercentages += s.pct;
    });

    const overallPct = sumPercentages / 4;
    const totalChaptersDone = PREDEFINED_CHAPTERS.reduce((sum, ch) => {
      const completed = chapterProgress.find(p => p.subject === ch.subject && p.chapter_index === ch.index)?.done;
      return sum + (completed ? 1 : 0);
    }, 0);

    // Sum Total Revisions (milestones + standard log entries + SA tracker checklists)
    const chRevisions = chapterProgress.reduce((sum, p) => {
      let rCount = 0;
      if (p.rev1) rCount++;
      if (p.rev2) rCount++;
      if (p.rev3) rCount++;
      return sum + rCount;
    }, 0);
    const customRevisions = revisionEntries.length;
    const saRevisions = saTracker.filter(s => s.completed).length;
    const totalRevisionsCount = chRevisions + customRevisions + saRevisions;

    // This Week Hours (sum of Monday-Sunday of current week)
    // Find Mon-Sun dates
    const today = new Date();
    const currentDay = today.getDay();
    const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
    
    let thisWeekHours = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + distanceToMon + i);
      const dStr = getLocalDateString(d);
      
      // manual log
      const manual = studyHours.find(h => h.date === dStr);
      if (manual) {
        thisWeekHours += manual.total_hours;
      } else {
        // fallback to checked planner hours
        const plannerSum = dayPlans
          .filter(p => p.date === dStr && p.done)
          .reduce((sum, p) => sum + (parseFloat(p.hours) || 0), 0);
        thisWeekHours += plannerSum;
      }
    }

    return {
      overallPct,
      chaptersDone: totalChaptersDone,
      totalRevisions: totalRevisionsCount,
      thisWeekHours,
      subjects
    };
  };

  const stats = getCalculatedStats();

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    saveSupabaseCredentials(configUrl, configAnonKey);
    setShowConfigModal(false);
  };

  // Wait for hydration
  if (!isMounted) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-[#faf9f5]">
        <div className="text-center font-serif">
          <p className="text-stone-500 italic">Unrolling the study planner...</p>
        </div>
      </div>
    );
  }

  // AUTH SCREEN
  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-[#faf9f5] px-4 py-12 relative">
        <div className="max-w-md w-full paper-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">Study Command Centre</h1>
            <p className="text-xs text-stone-500 font-serif italic mt-1.5">CA Inter Group 2 • Sep 2026 Attempt</p>
          </div>

          {!supabaseClient && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
              <div className="flex gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Database Credentials Missing</p>
                  <p className="mt-1">Connect your Supabase instance using the button below, or proceed in <strong>Demo Mode</strong> to evaluate using local storage.</p>
                </div>
              </div>
            </div>
          )}

          {authError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              {authError}
            </div>
          )}

          {supabaseClient ? (
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Email Address</label>
                <input 
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Password</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-600"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full bg-stone-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-stone-850 transition-colors flex items-center justify-center gap-2"
              >
                {authLoading ? "Synchronizing..." : isSignUp ? "Create Account" : "Access Planner"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-4"
                >
                  {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowConfigModal(true)}
              className="w-full bg-stone-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-stone-850 transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <Database className="w-4 h-4" />
              Connect Supabase DB
            </button>
          )}

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[10px] text-stone-400 font-bold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <button
            onClick={enableDemoMode}
            className="w-full bg-white text-stone-700 border border-stone-200 py-3 rounded-lg text-sm font-semibold hover:bg-stone-50 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Activity className="w-4 h-4" />
            Enter Demo Mode (No DB Setup)
          </button>
        </div>

        {/* Credentials Editor Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <form onSubmit={handleCredentialsSubmit} className="bg-white rounded-xl border border-stone-200 max-w-md w-full shadow-2xl p-6 relative">
              <button 
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-lg font-bold text-stone-900">Supabase Connection Parameters</h3>
              <p className="text-stone-400 text-xs mt-1">Provide your credentials to establish a database link</p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Supabase URL</label>
                  <input 
                    type="url"
                    placeholder="https://your-project.supabase.co"
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Supabase Anon Key</label>
                  <textarea 
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    value={configAnonKey}
                    onChange={(e) => setConfigAnonKey(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-3 h-24 focus:outline-none focus:border-stone-600 font-mono resize-none"
                    required
                  />
                </div>
                {configAnonKey && configAnonKey.trim().startsWith("sb_publishable_") && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] leading-relaxed">
                    <strong>⚠️ Invalid API Key Type Detected</strong>
                    <p className="mt-1">The key you entered starts with <code>sb_publishable_</code>. This is a CLI publishable bootstrap key, not a client-facing REST API key.</p>
                    <p className="mt-1">Please use the <strong>anon</strong> public key (which is a long JWT string starting with <code>eyJ</code>) found in your Supabase Dashboard under <strong>Settings &gt; API</strong>.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-850"
                >
                  Connect Instance
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // CORE APP VIEW
  return (
    <div className="min-h-screen flex flex-col pb-16 bg-[#faf9f5]">
      {/* Sticky Top Bar wrapper to prevent overlapping on scroll and wrap properly */}
      <div className="sticky top-0 z-40 shadow-md">
        {/* Header */}
        <header className="bg-[#1c1917] text-stone-100 py-4 px-6 md:px-8 border-b border-stone-850">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl md:text-2xl font-bold tracking-wide">CA Inter Group 2 — Study Command Centre</h1>
                {isDemoMode && (
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-amber-500 text-black rounded font-sans">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 font-serif italic mt-0.5">{getAttemptLabel()}</p>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3">
              <div className="text-right select-none">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block leading-none">
                  {isEditingTargetDate ? "Select Exam Date" : "Countdown"}
                </span>
                {isEditingTargetDate ? (
                  <input
                    type="date"
                    value={targetDateStr}
                    onChange={(e) => handleTargetDateChange(e.target.value)}
                    onBlur={() => setIsEditingTargetDate(false)}
                    className="font-mono text-xs bg-stone-850 text-stone-100 border border-stone-700 rounded px-1.5 py-0.5 mt-1 focus:outline-none focus:border-stone-500 w-28 text-center"
                    autoFocus
                  />
                ) : (
                  <span 
                    onClick={() => setIsEditingTargetDate(true)}
                    title="Click to change target exam date"
                    className={`font-mono text-xl font-bold mt-1 inline-block cursor-pointer hover:underline decoration-dotted underline-offset-4 ${
                      daysRemaining > 60 
                        ? 'text-emerald-400' 
                        : daysRemaining >= 30 
                          ? 'text-amber-400' 
                          : 'text-red-400'
                    }`}
                  >
                    {daysRemaining} Days
                  </span>
                )}
              </div>

              <div className="h-8 w-px bg-stone-800" />

              {/* Quick stats grid */}
              <div className="flex gap-4">
                <div className="text-center">
                  <span className="text-[9px] text-stone-400 uppercase font-semibold block leading-none">Overall %</span>
                  <span className="font-mono text-base font-bold text-stone-100 block mt-1">
                    {Math.round(stats.overallPct)}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-stone-400 uppercase font-semibold block leading-none">Chapters Done</span>
                  <span className="font-mono text-base font-bold text-stone-100 block mt-1">
                    {stats.chaptersDone}/40
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-stone-400 uppercase font-semibold block leading-none">Revisions</span>
                  <span className="font-mono text-base font-bold text-stone-100 block mt-1">
                    {stats.totalRevisions}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-stone-400 uppercase font-semibold block leading-none">This Week</span>
                  <span className="font-mono text-base font-bold text-stone-100 block mt-1">
                    {stats.thisWeekHours.toFixed(1)}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs navigation panel */}
        <nav className="bg-white border-b border-stone-250 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center gap-1 md:gap-2 px-4 md:px-8 py-2 min-w-max">
                {[
                  { id: "dashboard", label: "Dashboard", icon: BookOpen },
                  { id: "planner", label: "Daily Planner", icon: Calendar },
                  { id: "chapters", label: "Chapter Tracker", icon: CheckCircle },
                  { id: "revisions", label: "Revision Planner", icon: Clock },
                  { id: "hours", label: "Hours Tracker", icon: Activity },
                  { id: "mocks", label: "Test Tracker", icon: FileText },
                  { id: "clock", label: "Study Clock", icon: Timer }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-stone-900 text-white shadow-sm px-3 py-2'
                          : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50 px-2 sm:px-3 py-2'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className={`${activeTab === tab.id ? 'block' : 'hidden md:block'}`}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-shrink-0 pl-2 pr-4 md:pr-8 py-2 bg-white relative z-10 before:content-[''] before:absolute before:left-[-20px] before:top-0 before:bottom-0 before:w-[20px] before:bg-gradient-to-r before:from-transparent before:to-white">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 text-stone-500 hover:text-red-650 hover:bg-red-50/50 rounded-lg text-xs font-semibold transition-all border border-transparent hover:border-red-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
        {activeTab === "dashboard" && (
          <DashboardTab 
            stats={stats} 
            userPrefs={userPrefs} 
            onUpdatePrefs={handleUpdatePrefs} 
          />
        )}
        {activeTab === "planner" && (
          <DailyPlannerTab 
            dayPlans={dayPlans} 
            onAddPlan={handleAddPlan}
            onUpdatePlan={handleUpdatePlan}
            onDeletePlan={handleDeletePlan}
            toast={toast}
          />
        )}
        {activeTab === "chapters" && (
          <ChapterTrackerTab 
            chapterProgress={chapterProgress}
            onUpdateProgress={handleUpdateChapterProgress}
          />
        )}
        {activeTab === "revisions" && (
          <RevisionPlannerTab 
            revisionEntries={revisionEntries}
            saTracker={saTracker}
            onAddRevision={handleAddRevision}
            onUpdateRevision={handleUpdateRevision}
            onDeleteRevision={handleDeleteRevision}
            onUpdateSa={handleUpdateSa}
            toast={toast}
          />
        )}
        {activeTab === "hours" && (
          <HoursTrackerTab 
            dayPlans={dayPlans}
            studyHours={studyHours}
            userPrefs={userPrefs}
            onUpdatePrefs={handleUpdatePrefs}
            onUpdateHours={handleUpdateHours}
            toast={toast}
          />
        )}
        {activeTab === "mocks" && (
          <MockTestTab 
            mockTests={mockTests}
            onAddMock={handleAddMock}
            onUpdateMock={handleUpdateMock}
            onDeleteMock={handleDeleteMock}
            toast={toast}
          />
        )}
        {activeTab === "clock" && (
          <StudyTimerTab />
        )}
      </main>

      {/* Footer Settings & Sign Out */}
      <footer className="border-t border-stone-200 mt-auto bg-stone-50/50 py-4 px-6 md:px-8 text-xs text-stone-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <span className="font-medium text-stone-500">Connected: {user.email}</span>
            {credentials.isCustom && (
              <button
                onClick={() => {
                  if (confirm("Disconnect Supabase and switch to local storage?")) {
                    clearSupabaseCredentials();
                  }
                }}
                className="text-red-500 hover:text-red-700 underline underline-offset-2"
              >
                Disconnect DB
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Credentials Editor Modal from dashboard */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={handleCredentialsSubmit} className="bg-white rounded-xl border border-stone-200 max-w-md w-full shadow-2xl p-6 relative">
            <button 
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-stone-900">Supabase Connection Parameters</h3>
            <p className="text-stone-400 text-xs mt-1">Provide your credentials to establish a database link</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Supabase URL</label>
                <input 
                  type="url"
                  placeholder="https://your-project.supabase.co"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-600 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Supabase Anon Key</label>
                <textarea 
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={configAnonKey}
                  onChange={(e) => setConfigAnonKey(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-3 h-24 focus:outline-none focus:border-stone-600 font-mono resize-none"
                  required
                />
              </div>
              {configAnonKey && configAnonKey.trim().startsWith("sb_publishable_") && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] leading-relaxed">
                  <strong>⚠️ Invalid API Key Type Detected</strong>
                  <p className="mt-1">The key you entered starts with <code>sb_publishable_</code>. This is a CLI publishable bootstrap key, not a client-facing REST API key.</p>
                  <p className="mt-1">Please use the <strong>anon</strong> public key (which is a long JWT string starting with <code>eyJ</code>) found in your Supabase Dashboard under <strong>Settings &gt; API</strong>.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-850"
              >
                Save & Connect
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
