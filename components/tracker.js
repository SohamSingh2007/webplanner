import React, { useState, useEffect } from "react";
import { 
  CheckCircle, Circle, Calendar, BookOpen, Award, Clock, 
  Settings, AlertCircle, Plus, Trash2, Edit, Save, X, Book, 
  FileText, ShieldAlert, ListChecks, CheckSquare, Square,
  Play, Pause, RotateCcw, Timer, Maximize
} from "lucide-react";

// PREDEFINED DATA
export const PREDEFINED_CHAPTERS = [
  // COSTING (15)
  { subject: 'costing', index: 1, title: 'Ch1 Intro to Cost & Management Accounting' },
  { subject: 'costing', index: 2, title: 'Ch2 Material Cost' },
  { subject: 'costing', index: 3, title: 'Ch3 Employee Cost & Direct Expenses' },
  { subject: 'costing', index: 4, title: 'Ch4 Overheads Absorption Costing' },
  { subject: 'costing', index: 5, title: 'Ch5 Activity Based Costing' },
  { subject: 'costing', index: 6, title: 'Ch6 Cost Sheet' },
  { subject: 'costing', index: 7, title: 'Ch7 Cost Accounting Systems' },
  { subject: 'costing', index: 8, title: 'Ch8 Unit & Batch Costing' },
  { subject: 'costing', index: 9, title: 'Ch9 Job Costing' },
  { subject: 'costing', index: 10, title: 'Ch10 Process & Operation Costing' },
  { subject: 'costing', index: 11, title: 'Ch11 Joint Products & By Products' },
  { subject: 'costing', index: 12, title: 'Ch12 Service Costing' },
  { subject: 'costing', index: 13, title: 'Ch13 Standard Costing' },
  { subject: 'costing', index: 14, title: 'Ch14 Marginal Costing' },
  { subject: 'costing', index: 15, title: 'Ch15 Budgets & Budgetary Control' },
  
  // FM (9)
  { subject: 'fm', index: 1, title: 'Ch1 Scope & Objectives of FM' },
  { subject: 'fm', index: 2, title: 'Ch2 Types of Financing' },
  { subject: 'fm', index: 3, title: 'Ch3 Financial Analysis & Planning Ratio Analysis' },
  { subject: 'fm', index: 4, title: 'Ch4 Cost of Capital' },
  { subject: 'fm', index: 5, title: 'Ch5 Financing Decisions Capital Structure' },
  { subject: 'fm', index: 6, title: 'Ch6 Financing Decisions Leverages' },
  { subject: 'fm', index: 7, title: 'Ch7 Investment Decisions' },
  { subject: 'fm', index: 8, title: 'Ch8 Dividend Decision' },
  { subject: 'fm', index: 9, title: 'Ch9 Management of Working Capital' },
  
  // AUDIT (11)
  { subject: 'audit', index: 1, title: 'Ch1 Nature Objective & Scope' },
  { subject: 'audit', index: 2, title: 'Ch2 Audit Strategy Planning & Programme' },
  { subject: 'audit', index: 3, title: 'Ch3 Risk Assessment & Internal Control' },
  { subject: 'audit', index: 4, title: 'Ch4 Audit Evidence' },
  { subject: 'audit', index: 5, title: 'Ch5 Audit of Items of Financial Statements' },
  { subject: 'audit', index: 6, title: 'Ch6 Audit Documentation' },
  { subject: 'audit', index: 7, title: 'Ch7 Completion & Review' },
  { subject: 'audit', index: 8, title: 'Ch8 Audit Report' },
  { subject: 'audit', index: 9, title: 'Ch9 Special Features of Audit of Different Entities' },
  { subject: 'audit', index: 10, title: 'Ch10 Audit of Banks' },
  { subject: 'audit', index: 11, title: 'Ch11 Ethics & Terms of Audit Engagements' },
  
  // SM (5)
  { subject: 'sm', index: 1, title: 'Ch1 Intro to Strategic Management' },
  { subject: 'sm', index: 2, title: 'Ch2 Strategic Analysis External Environment' },
  { subject: 'sm', index: 3, title: 'Ch3 Strategic Analysis Internal Environment' },
  { subject: 'sm', index: 4, title: 'Ch4 Strategic Choices' },
  { subject: 'sm', index: 5, title: 'Ch5 Strategy Implementation & Evaluation' }
];

export const PREDEFINED_SAS = [
  'SA200', 'SA210', 'SA220', 'SA230', 'SA240', 'SA250', 'SA260', 'SA265',
  'SA299', 'SA300', 'SA315', 'SA320', 'SA330', 'SA402', 'SA450', 'SA500',
  'SA501', 'SA505', 'SA510', 'SA520', 'SA530', 'SA540', 'SA550', 'SA560',
  'SA570', 'SA580', 'SA600', 'SA610', 'SA700', 'SA701', 'SA705', 'SA706',
  'SA710', 'SQC1', 'CARO2020'
];

export const SUBJECT_DETAILS = {
  costing: { name: "Costing", color: "#10b981", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "bg-emerald-500", text: "text-emerald-600", bar: "bg-emerald-500" },
  fm: { name: "FM", color: "#3b82f6", bg: "bg-blue-50 text-blue-700 border-blue-200", badge: "bg-blue-500", text: "text-blue-600", bar: "bg-blue-500" },
  audit: { name: "Audit", color: "#ef4444", bg: "bg-red-50 text-red-700 border-red-200", badge: "bg-red-500", text: "text-red-600", bar: "bg-red-500" },
  sm: { name: "SM", color: "#a855f7", bg: "bg-purple-50 text-purple-700 border-purple-200", badge: "bg-purple-500", text: "text-purple-600", bar: "bg-purple-500" }
};

const habitsList = [
  { key: "woke_up", label: "Woke up on time (6:00 AM)" },
  { key: "no_social_media", label: "No social media during study hours" },
  { key: "targets_met", label: "Met planner targets for the day" },
  { key: "revised_yesterday", label: "Revised yesterday's topics" },
  { key: "active_posture", label: "Kept active posture & stayed hydrated" }
];

export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = "Delete", confirmColor = "bg-[#ef4444] hover:bg-red-600 text-white" }) {
  return (
    <div className="fixed inset-0 bg-stone-900/40 flex items-center justify-center p-4 z-[100] animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-[320px] w-full shadow-2xl flex flex-col items-center text-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 drop-shadow-sm">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#ef4444"/>
          <path d="M12 9V14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="12" cy="17.5" r="1.25" fill="white"/>
        </svg>
        <h3 className="text-xl font-bold text-stone-900 mb-3">{title}</h3>
        <p className="text-sm text-stone-500 mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 w-full">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-3 font-bold rounded-xl transition-colors ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// 1. DASHBOARD TAB
export function DashboardTab({ stats, userPrefs, onUpdatePrefs }) {
  const habits = userPrefs.habits_today || {
    woke_up: false,
    no_social_media: false,
    targets_met: false,
    revised_yesterday: false,
    active_posture: false
  };

  const handleHabitToggle = (key) => {
    const updatedHabits = { ...habits, [key]: !habits[key] };
    onUpdatePrefs({ habits_today: updatedHabits });
  };

  const handlePriorityChange = (index, value) => {
    const priorities = [...(userPrefs.priorities || [])];
    while (priorities.length <= index) priorities.push("");
    priorities[index] = value;
    onUpdatePrefs({ priorities });
  };

  const handleRatingChange = (rating) => {
    onUpdatePrefs({ productivity_rating: rating });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="font-serif text-2xl font-bold tracking-tight mb-2">Subject Progress Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(SUBJECT_DETAILS).map(([key, details]) => {
            const progress = stats.subjects[key] || { pct: 0, done: 0, total: 1, revised: 0, tested: 0 };
            return (
              <div key={key} className="paper-card p-5 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${details.bg}`}>
                      {details.name}
                    </span>
                    <h3 className="font-serif text-lg font-bold mt-1 text-stone-900">{details.name}</h3>
                  </div>
                  <span className="font-mono text-xl font-bold text-stone-800">{Math.round(progress.pct)}%</span>
                </div>
                
                <div className="w-full bg-stone-100 h-2 rounded-full mb-4 overflow-hidden">
                  <div 
                    className={`h-full ${details.bar} transition-all duration-500`}
                    style={{ width: `${progress.pct}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-1 text-center border-t border-stone-100 pt-3">
                  <div>
                    <p className="text-[10px] uppercase text-stone-400 font-medium">Chapters</p>
                    <p className="font-mono text-sm font-bold text-stone-700">{progress.done}/{progress.total}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-stone-400 font-medium">Revised</p>
                    <p className="font-mono text-sm font-bold text-stone-700">{progress.revised}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-stone-400 font-medium">Tested</p>
                    <p className="font-mono text-sm font-bold text-stone-700">{progress.tested}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="paper-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-stone-600" />
            <h3 className="font-serif text-xl font-bold text-stone-900">Today's Self-Check</h3>
          </div>
          <p className="text-stone-500 text-xs mb-4">Tick off daily habits that cultivate focus and discipline.</p>
          
          <div className="space-y-3">
            {habitsList.map((habit) => (
              <button 
                key={habit.key}
                onClick={() => handleHabitToggle(habit.key)}
                className="flex items-center w-full text-left gap-3 py-2 px-3 rounded-lg border border-stone-100 hover:bg-stone-50/50 transition-colors"
              >
                {habits[habit.key] ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${habits[habit.key] ? 'text-stone-900 font-medium' : 'text-stone-600'}`}>
                  {habit.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 border-t border-stone-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-stone-800">Productivity Rating</p>
              <p className="text-xs text-stone-400">Rate your focus and efficiency today (1-5)</p>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={`w-9 h-9 rounded-lg border font-mono text-sm font-bold flex items-center justify-center transition-all ${
                    userPrefs.productivity_rating === star 
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold tracking-tight mb-2">Focus Dashboard</h2>
        
        <div className="paper-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Top 3 Priorities</h3>
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-stone-400 w-4">#{idx + 1}</span>
                <input
                  type="text"
                  placeholder="Set main focus item..."
                  value={(userPrefs.priorities || [])[idx] || ""}
                  onChange={(e) => handlePriorityChange(idx, e.target.value)}
                  className="flex-1 text-sm bg-stone-50/50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="paper-card p-6">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Weak Topics & Gaps</h3>
          <p className="text-stone-400 text-xs mb-3">List concepts needing extra revision or practice.</p>
          <textarea
            className="w-full text-sm bg-stone-50/50 border border-stone-200 rounded-lg p-3 h-24 focus:outline-none focus:border-stone-600 transition-colors resize-none"
            placeholder="e.g. Standard Costing variances, Audit Report clauses..."
            value={userPrefs.weak_topics || ""}
            onChange={(e) => onUpdatePrefs({ weak_topics: e.target.value })}
          />
        </div>

        <div className="paper-card p-6">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Weekly Reflections</h3>
          <p className="text-stone-400 text-xs mb-3">Reflect on wins, blockers, and adjustments.</p>
          <textarea
            className="w-full text-sm bg-stone-50/50 border border-stone-200 rounded-lg p-3 h-24 focus:outline-none focus:border-stone-600 transition-colors resize-none"
            placeholder="What went well? What needs improvement for next week?"
            value={userPrefs.weekly_review || ""}
            onChange={(e) => onUpdatePrefs({ weekly_review: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

// 2. DAILY PLANNER TAB
export function DailyPlannerTab({ dayPlans, onAddPlan, onUpdatePlan, onDeletePlan, toast }) {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [filterType, setFilterType] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [target, setTarget] = useState("");
  const [hours, setHours] = useState("2");
  const filteredPlans = dayPlans.filter(p => p.date === selectedDate);
  const totalHours = filteredPlans.reduce((sum, p) => sum + (parseFloat(p.hours) || 0), 0);
  
  const displayPlans = filterType === "all" 
    ? filteredPlans 
    : filterType === "general"
      ? filteredPlans.filter(p => !p.subject || p.subject === "general")
      : filteredPlans.filter(p => p.subject === filterType);

  const formatTime12Hour = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(':');
    const hours = parseInt(h, 10);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${m} ${suffix}`;
  };

  useEffect(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      let diff = (endH + endM / 60) - (startH + startM / 60);
      if (diff < 0) diff += 24;
      setHours(diff.toFixed(1).replace('.0', ''));
    }
  }, [startTime, endTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDate || !startTime || !endTime || !subject || !topic.trim() || !target.trim() || !hours) {
      if (toast && toast.error) {
        toast.error("Please fill in all fields (Subject, Topic, Target, and Hours) to add a time block.");
      }
      return;
    }

    const generatedSlot = `${formatTime12Hour(startTime)} - ${formatTime12Hour(endTime)}`;
    
    const payload = {
      date: selectedDate,
      time_slot: generatedSlot,
      subject: subject,
      topic: topic,
      target: target,
      hours: parseFloat(hours) || 0,
      done: false
    };

    if (editingPlanId) {
      onUpdatePlan(editingPlanId, payload);
      setEditingPlanId(null);
      if (toast && toast.success) toast.success("Time block updated!");
    } else {
      onAddPlan(payload);
      if (toast && toast.success) toast.success("Time block added!");
    }

    setSubject("");
    setTopic("");
    setTarget("");
    setHours("2");
  };

  const handleEditClick = (plan) => {
    setEditingPlanId(plan.id);
    setSubject(plan.subject || "");
    setTopic(plan.topic || "");
    setTarget(plan.target || "");
    setHours(plan.hours.toString());
    
    try {
      const parts = plan.time_slot.split(" - ");
      if (parts.length === 2) {
        const parseTo24 = (timeString) => {
          const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (!match) return "00:00";
          let [_, h, m, modifier] = match;
          if (h === '12') h = '00';
          if (modifier.toUpperCase() === 'PM') h = (parseInt(h, 10) + 12).toString();
          return `${h.padStart(2, '0')}:${m}`;
        };
        setStartTime(parseTo24(parts[0]));
        setEndTime(parseTo24(parts[1]));
      }
    } catch(e) {
      console.log("Error parsing time", e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="paper-card p-6">
          <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-stone-600" />
            Schedule Block
          </h2>

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1.5">Planner Date</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-mono"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">Start Time *</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">End Time *</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600"
              >
                <option value="">General / None</option>
                <option value="costing">Costing</option>
                <option value="fm">FM</option>
                <option value="audit">Audit</option>
                <option value="sm">SM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Topic</label>
              <input 
                type="text"
                placeholder="e.g. Activity Based Costing"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Target</label>
              <input 
                type="text"
                placeholder="e.g. Solved 10 study material questions"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Duration (Hours)</label>
              <input 
                type="number"
                step="0.5"
                placeholder="e.g. 2"
                value={hours}
                readOnly
                className="w-full text-sm bg-stone-100 border border-stone-200 text-stone-500 rounded-lg px-3 py-2 cursor-not-allowed font-mono outline-none"
              />
            </div>

            {editingPlanId ? (
              <div className="flex gap-3 w-full">
                <button 
                  type="button"
                  onClick={() => {
                    setEditingPlanId(null);
                    setSubject("");
                    setTopic("");
                    setTarget("");
                    setHours("2");
                  }}
                  className="flex-1 bg-white text-stone-600 border border-stone-200 py-2.5 rounded-lg text-sm font-semibold hover:bg-stone-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-stone-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-stone-850 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Update
                </button>
              </div>
            ) : (
              <button 
                type="submit"
                className="w-full bg-stone-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-stone-850 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Time Block
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="paper-card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Schedule Details</h2>
              <p className="text-xs text-stone-400">Time slots scheduled for this calendar date</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400 font-semibold uppercase">Total Hours</p>
              <p className="font-mono text-2xl font-bold text-stone-800">{totalHours.toFixed(1)} hrs</p>
            </div>
          </div>

          {/* Filter Pills */}
          {filteredPlans.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button 
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filterType === "all" ? "bg-stone-900 text-white shadow-sm" : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800"}`}
              >
                All
              </button>
              {Object.entries(SUBJECT_DETAILS).map(([key, details]) => (
                <button 
                  key={key}
                  onClick={() => setFilterType(key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    filterType === key 
                      ? `bg-stone-900 text-white shadow-sm` 
                      : `bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800`
                  }`}
                >
                  {details.name}
                </button>
              ))}
            </div>
          )}

          {displayPlans.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-stone-200 rounded-lg">
              <Clock className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-500 text-sm">No time blocks scheduled for this date.</p>
              <p className="text-xs text-stone-400 mt-1">Use the sidebar to insert study slots.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayPlans.map((plan) => {
                const subDetails = SUBJECT_DETAILS[plan.subject];
                return (
                  <div 
                    key={plan.id}
                    className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                      plan.done 
                        ? 'bg-stone-50/70 border-stone-200 opacity-75' 
                        : 'bg-white border-stone-200 shadow-sm hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => onUpdatePlan(plan.id, { done: !plan.done })}
                        className="mt-0.5 flex-shrink-0 text-stone-400 hover:text-stone-700 transition-colors"
                      >
                        {plan.done ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                            {plan.time_slot}
                          </span>
                          {subDetails && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${subDetails.bg}`}>
                              {subDetails.name}
                            </span>
                          )}
                          {plan.hours > 0 && (
                            <span className="font-mono text-[10px] text-stone-500 bg-stone-50 border border-stone-200 px-1.5 py-0.5 rounded">
                              {plan.hours} hrs
                            </span>
                          )}
                        </div>
                        <h4 className={`text-sm font-semibold text-stone-800 ${plan.done ? 'line-through text-stone-400' : ''}`}>
                          {plan.topic || "General Study Block"}
                        </h4>
                        {plan.target && (
                          <p className="text-xs text-stone-500 mt-1 font-serif">
                            Target: {plan.target}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button
                        onClick={() => handleEditClick(plan)}
                        className="p-1.5 text-stone-300 hover:text-blue-600 rounded transition-colors"
                        title="Edit Block"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(plan.id)}
                        className="ml-1 p-1.5 text-stone-300 hover:text-red-600 rounded transition-colors"
                        title="Delete Block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {deletingId && (
        <ConfirmModal
          title="Delete Block"
          message="This will delete this time block from your schedule."
          onConfirm={() => { onDeletePlan(deletingId); setDeletingId(null); }}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}

// 3. CHAPTER TRACKER TAB
export function ChapterTrackerTab({ chapterProgress, onUpdateProgress, onBulkSaveProgress }) {
  const [filterSubject, setFilterSubject] = useState("all");
  const [editingChapter, setEditingChapter] = useState(null);
  const [modalNotes, setModalNotes] = useState("");
  const [modalDate, setModalDate] = useState("");

  const chapters = PREDEFINED_CHAPTERS.filter(ch => filterSubject === "all" || ch.subject === filterSubject);

  const getProgressFor = (subject, idx) => {
    return chapterProgress.find(p => p.subject === subject && p.chapter_index === idx) || {
      done: false, rev1: false, rev2: false, rev3: false, test_done: false, notes: "", date_completed: ""
    };
  };

  const handleCheckboxToggle = (subject, idx, field, currentVal) => {
    const record = chapterProgress.find(p => p.subject === subject && p.chapter_index === idx);
    const updates = { [field]: !currentVal };
    if (field === 'done' && !currentVal) {
      updates.date_completed = getLocalDateString();
    }
    
    if (record) {
      onUpdateProgress(record.id, updates, { subject, chapter_index: idx });
    } else {
      onUpdateProgress(null, {
        subject,
        chapter_index: idx,
        done: false,
        rev1: false,
        rev2: false,
        rev3: false,
        test_done: false,
        notes: "",
        ...updates
      });
    }
  };

  const openEditModal = (ch) => {
    const prog = getProgressFor(ch.subject, ch.index);
    setEditingChapter({ ...ch, prog });
    setModalNotes(prog.notes || "");
    setModalDate(prog.date_completed || "");
  };

  const saveModalEdits = () => {
    if (!editingChapter) return;
    const { subject, index, prog } = editingChapter;
    const record = chapterProgress.find(p => p.subject === subject && p.chapter_index === index);
    const updates = { notes: modalNotes, date_completed: modalDate || null };

    if (record) {
      onUpdateProgress(record.id, updates, { subject, chapter_index: index });
    } else {
      onUpdateProgress(null, {
        subject,
        chapter_index: index,
        done: false,
        rev1: false,
        rev2: false,
        rev3: false,
        test_done: false,
        ...updates
      });
    }
    setEditingChapter(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Syllabus Chapters</h2>
          <p className="text-xs text-stone-400">Track study, revisions, and practice for all 40 chapters</p>
        </div>
        
        <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200">
          <button 
            onClick={() => setFilterSubject("all")}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${filterSubject === "all" ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
          >
            All (40)
          </button>
          {Object.entries(SUBJECT_DETAILS).map(([key, details]) => (
            <button 
              key={key}
              onClick={() => setFilterSubject(key)}
              className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${filterSubject === key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
            >
              {details.name}
            </button>
          ))}
        </div>
      </div>

      <div className="paper-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12">No</th>
                <th className="py-3 px-4">Chapter Title</th>
                <th className="py-3 px-2 text-center w-20">1st Read</th>
                <th className="py-3 px-2 text-center w-20">Rev 1</th>
                <th className="py-3 px-2 text-center w-20">Rev 2</th>
                <th className="py-3 px-2 text-center w-20">Rev 3</th>
                <th className="py-3 px-2 text-center w-20">Test</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 w-16 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {chapters.map((ch, idx) => {
                const prog = getProgressFor(ch.subject, ch.index);
                const subDetails = SUBJECT_DETAILS[ch.subject];
                return (
                  <tr key={`${ch.subject}-${ch.index}`} className="hover:bg-stone-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-stone-400">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${subDetails.badge}`} />
                        <div>
                          <p className="font-medium text-stone-900 leading-snug">{ch.title}</p>
                          <span className="text-[10px] text-stone-400 capitalize">{ch.subject}</span>
                          {prog.date_completed && (
                            <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 ml-2 rounded">
                              ✓ {prog.date_completed}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {['done', 'rev1', 'rev2', 'rev3', 'test_done'].map((field) => {
                      const isChecked = !!prog[field];
                      return (
                        <td key={field} className="py-3.5 px-2 text-center">
                          <button
                            onClick={() => handleCheckboxToggle(ch.subject, ch.index, field, isChecked)}
                            className="inline-flex items-center justify-center p-1 text-stone-300 hover:text-stone-600 transition-colors"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 text-stone-900" />
                            ) : (
                              <Square className="w-5 h-5 text-stone-300" />
                            )}
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-3.5 px-4 text-xs text-stone-500 truncate max-w-[150px]" title={prog.notes || ""}>
                      {prog.notes || <span className="text-stone-300 italic font-serif">None</span>}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => openEditModal(ch)}
                        className="p-1.5 text-stone-400 hover:text-stone-850 hover:bg-stone-100 rounded-lg transition-all"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingChapter && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-stone-200 max-w-md w-full shadow-2xl p-6 relative">
            <button 
              onClick={() => setEditingChapter(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50"
            >
              <X className="w-5 h-5" />
            </button>

            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${SUBJECT_DETAILS[editingChapter.subject].bg}`}>
              {SUBJECT_DETAILS[editingChapter.subject].name}
            </span>
            
            <h3 className="font-serif text-lg font-bold mt-2 text-stone-900">
              {editingChapter.title}
            </h3>
            <p className="text-stone-400 text-xs mt-1">Update notes and completion record</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Completion Date</label>
                <input 
                  type="date"
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Chapter Notes</label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Summarize key formulas, tricky concepts, or topics to re-read."
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg p-3 h-32 focus:outline-none focus:border-stone-600 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setEditingChapter(null)}
                className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button 
                onClick={saveModalEdits}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-850"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. REVISION PLANNER TAB
export function RevisionPlannerTab({ revisionEntries, saTracker, onAddRevision, onUpdateRevision, onDeleteRevision, onUpdateSa, toast }) {
  const [editingRev, setEditingRev] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("costing");
  const [dateStudied, setDateStudied] = useState(getLocalDateString());
  const [rev1Date, setRev1Date] = useState("");
  const [rev2Date, setRev2Date] = useState("");
  const [rev3Date, setRev3Date] = useState("");
  const [rev4Date, setRev4Date] = useState("");
  const [notes, setNotes] = useState("");

  const [activeTab, setActiveTab] = useState("revisions");

  const getSaStatus = (code) => {
    return saTracker.find(s => s.sa_code === code)?.completed || false;
  };

  const handleSaToggle = (code) => {
    const record = saTracker.find(s => s.sa_code === code);
    const isCompleted = record ? record.completed : false;
    onUpdateSa(record?.id || null, code, !isCompleted);
  };

  const openAddModal = () => {
    setEditingRev({ isNew: true });
    setTopic("");
    setSubject("costing");
    setDateStudied(getLocalDateString());
    setRev1Date("");
    setRev2Date("");
    setRev3Date("");
    setRev4Date("");
    setNotes("");
  };

  const openEditModal = (entry) => {
    setEditingRev(entry);
    setTopic(entry.topic || "");
    setSubject(entry.subject || "costing");
    setDateStudied(entry.date_studied || "");
    setRev1Date(entry.rev1_date || "");
    setRev2Date(entry.rev2_date || "");
    setRev3Date(entry.rev3_date || "");
    setRev4Date(entry.rev4_date || "");
    setNotes(entry.notes || "");
  };

  const handleSave = () => {
    if (!topic || !dateStudied) {
      toast.warning("Please enter a Topic and Date Studied.");
      return;
    }

    const payload = {
      topic,
      subject,
      date_studied: dateStudied,
      rev1_date: rev1Date || null,
      rev2_date: rev2Date || null,
      rev3_date: rev3Date || null,
      rev4_date: rev4Date || null,
      notes
    };

    if (editingRev.isNew) {
      onAddRevision(payload);
    } else {
      onUpdateRevision(editingRev.id, payload);
    }
    setEditingRev(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-stone-200 pb-3">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab("revisions")}
            className={`font-serif text-base md:text-xl font-bold pb-2 border-b-2 transition-all ${activeTab === "revisions" ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
          >
            Revision Log
          </button>
          <button 
            onClick={() => setActiveTab("sa")}
            className={`font-serif text-base md:text-xl font-bold pb-2 border-b-2 transition-all ${activeTab === "sa" ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
          >
            Audit SA Tracker
          </button>
        </div>
        
        {activeTab === "revisions" && (
          <button
            onClick={openAddModal}
            className="bg-stone-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-850 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Entry
          </button>
        )}
      </div>

      {activeTab === "revisions" ? (
        <div className="paper-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Revision Topic</th>
                  <th className="py-3 px-3 font-mono">Studied</th>
                  <th className="py-3 px-3 font-mono text-center">Rev 1</th>
                  <th className="py-3 px-3 font-mono text-center">Rev 2</th>
                  <th className="py-3 px-3 font-mono text-center">Rev 3</th>
                  <th className="py-3 px-3 font-mono text-center">Rev 4</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {revisionEntries.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-12 text-stone-500 font-serif">
                      No topics added to the revision log yet.
                    </td>
                  </tr>
                ) : (
                  revisionEntries.map((entry) => {
                    const subDetails = SUBJECT_DETAILS[entry.subject];
                    return (
                      <tr key={entry.id} className="hover:bg-stone-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold">
                          {subDetails ? (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${subDetails.bg}`}>
                              {subDetails.name}
                            </span>
                          ) : (
                            entry.subject
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-stone-900">{entry.topic}</td>
                        <td className="py-3.5 px-3 font-mono text-xs text-stone-600">{entry.date_studied}</td>
                        
                        {['rev1_date', 'rev2_date', 'rev3_date', 'rev4_date'].map((field) => (
                          <td key={field} className="py-3.5 px-3 font-mono text-xs text-center">
                            {entry[field] ? (
                              <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                                {entry[field]}
                              </span>
                            ) : (
                              <span className="text-stone-300">—</span>
                            )}
                          </td>
                        ))}

                        <td className="py-3.5 px-4 text-xs text-stone-500 truncate max-w-[150px]" title={entry.notes || ""}>
                          {entry.notes || <span className="text-stone-300 italic font-serif">None</span>}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => openEditModal(entry)}
                              className="p-1 text-stone-400 hover:text-stone-850 hover:bg-stone-100 rounded"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingId(entry.id)}
                              className="p-1 text-stone-300 hover:text-red-600 hover:bg-stone-100 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="paper-card p-6">
          <div className="mb-6">
            <h3 className="font-serif text-lg font-bold text-stone-900">Standards on Auditing (SAs)</h3>
            <p className="text-stone-400 text-xs mt-1">Cross off auditing standards and guidelines as you complete them.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {PREDEFINED_SAS.map((sa) => {
              const checked = getSaStatus(sa);
              return (
                <button
                  key={sa}
                  onClick={() => handleSaToggle(sa)}
                  className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg border text-left transition-all ${
                    checked 
                      ? 'bg-red-50/50 border-red-200 text-red-800' 
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-red-600 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-300 flex-shrink-0" />
                  )}
                  <span className="font-mono text-xs font-bold leading-none">{sa}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {deletingId && (
        <ConfirmModal
          title="Delete Revision"
          message="This will delete this revision entry permanently."
          onConfirm={() => { onDeleteRevision(deletingId); setDeletingId(null); }}
          onCancel={() => setDeletingId(null)}
        />
      )}

      {editingRev && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-stone-200 max-w-md w-full shadow-2xl p-6 relative">
            <button 
              onClick={() => setEditingRev(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-stone-900">
              {editingRev.isNew ? "Add Revision Log Entry" : "Edit Revision Details"}
            </h3>
            <p className="text-stone-400 text-xs mt-1">Organize and schedule your revisions</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Topic *</label>
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Standard Costing Variance Formulas"
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-medium"
                  >
                    <option value="costing">Costing</option>
                    <option value="fm">FM</option>
                    <option value="audit">Audit</option>
                    <option value="sm">SM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Date Studied *</label>
                  <input 
                    type="date"
                    value={dateStudied}
                    onChange={(e) => setDateStudied(e.target.value)}
                    className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4">
                <p className="text-xs font-bold text-stone-500 uppercase mb-2">Revision Milestones (Dates)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Revision 1</label>
                    <input 
                      type="date"
                      value={rev1Date}
                      onChange={(e) => setRev1Date(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-stone-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Revision 2</label>
                    <input 
                      type="date"
                      value={rev2Date}
                      onChange={(e) => setRev2Date(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-stone-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Revision 3</label>
                    <input 
                      type="date"
                      value={rev3Date}
                      onChange={(e) => setRev3Date(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-stone-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Revision 4</label>
                    <input 
                      type="date"
                      value={rev4Date}
                      onChange={(e) => setRev4Date(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-stone-600 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key observations or focus items..."
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg p-3 h-20 focus:outline-none focus:border-stone-600 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setEditingRev(null)}
                className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-850"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. HOURS TRACKER TAB
export function HoursTrackerTab({ dayPlans, studyHours, userPrefs, onUpdatePrefs, onUpdateHours, toast }) {
  const [weeklyTarget, setWeeklyTarget] = useState(userPrefs.weekly_target || 42);

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + distanceToMon + i);
      week.push({
        dateStr: getLocalDateString(day),
        label: day.toLocaleDateString('en-US', { weekday: 'short' }),
        num: day.getDate()
      });
    }
    return week;
  };

  const weekDates = getWeekDates();

  const getHoursForDate = (dateStr) => {
    const manualRecord = studyHours.find(h => h.date === dateStr);
    if (manualRecord) return manualRecord.total_hours;

    const plansForDay = dayPlans.filter(p => p.date === dateStr && p.done);
    return plansForDay.reduce((sum, p) => sum + (parseFloat(p.hours) || 0), 0);
  };

  const totalWeeklyHours = weekDates.reduce((sum, d) => sum + getHoursForDate(d.dateStr), 0);
  const targetPct = Math.min((totalWeeklyHours / (weeklyTarget || 1)) * 100, 100);

  const getSubjectHours = () => {
    const hours = { costing: 0, fm: 0, audit: 0, sm: 0 };
    const weekDateStrings = weekDates.map(d => d.dateStr);
    
    dayPlans.forEach(p => {
      if (weekDateStrings.includes(p.date) && p.done && p.subject && hours[p.subject] !== undefined) {
        hours[p.subject] += parseFloat(p.hours) || 0;
      }
    });
    return hours;
  };

  const subHours = getSubjectHours();
  const maxSubHours = Math.max(...Object.values(subHours), 1);

  const handleTargetSave = () => {
    onUpdatePrefs({ weekly_target: parseFloat(weeklyTarget) || 42.0 });
    toast.success("Weekly target updated successfully!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="paper-card p-6">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Weekly Goal Settings</h3>
          <p className="text-stone-400 text-xs mb-4">Set your study hours target and monitor completions.</p>
          
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <input 
                type="number"
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(e.target.value)}
                placeholder="Target Hours"
                className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-mono"
              />
            </div>
            <button
              onClick={handleTargetSave}
              className="bg-stone-900 text-white font-semibold text-xs px-3.5 py-2 rounded-lg hover:bg-stone-850 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs uppercase text-stone-400 font-semibold">Weekly Target progress</p>
                <p className="font-mono text-3xl font-extrabold text-stone-900 mt-1">{totalWeeklyHours.toFixed(1)} / {userPrefs.weekly_target || 42}h</p>
              </div>
              <span className="font-mono text-sm font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                {Math.round(targetPct)}%
              </span>
            </div>

            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
              <div 
                className="h-full bg-stone-900 transition-all duration-500"
                style={{ width: `${targetPct}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-400 font-serif italic">Progress is aggregated from completed daily slots + custom manual logs</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="paper-card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Mon-Sun Hours Log</h3>
              <p className="text-stone-400 text-xs">Record study hours per day to track consistency</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
            {weekDates.map((day) => {
              const hrs = getHoursForDate(day.dateStr);
              return (
                <div key={day.dateStr} className="bg-stone-50/50 border border-stone-200 rounded-lg p-2.5 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">{day.label}</span>
                    <span className="font-serif text-lg font-bold text-stone-800 block mt-0.5">{day.num}</span>
                  </div>
                  <div className="mt-3">
                    <input 
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={hrs || ""}
                      onChange={(e) => onUpdateHours(day.dateStr, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full text-center text-xs bg-white border border-stone-200 rounded px-1.5 py-1 focus:outline-none focus:border-stone-600 font-mono font-bold"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="paper-card p-6">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Weekly Subject Breakdown</h3>
          <p className="text-stone-400 text-xs mb-6">Time allocated across subjects this week (from completed planner slots)</p>

          <div className="space-y-4">
            {Object.entries(SUBJECT_DETAILS).map(([key, details]) => {
              const hoursVal = subHours[key] || 0;
              const barWidth = Math.max((hoursVal / maxSubHours) * 100, 3);
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-16 text-xs font-semibold text-stone-600 uppercase tracking-wider">{details.name}</span>
                  <div className="flex-1 bg-stone-100 h-6 rounded-md overflow-hidden relative border border-stone-200/50">
                    <div 
                      className={`h-full ${details.bar} transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    />
                    <span className="absolute inset-y-0 left-3 flex items-center font-mono text-[10px] font-bold text-stone-800">
                      {hoursVal.toFixed(1)} hrs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


// 7. MOCK TEST TAB
export function MockTestTab({ mockTests, onAddMock, onUpdateMock, onDeleteMock, toast }) {
  const [editingMock, setEditingMock] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  const [date, setDate] = useState(getLocalDateString());
  const [testName, setTestName] = useState("");
  const [subject, setSubject] = useState("costing");
  const [marks, setMarks] = useState("");
  const [total, setTotal] = useState("100");
  const [remarks, setRemarks] = useState("");

  // Calculate Mock Averages per Subject
  const getSubjectMockAvg = (sub) => {
    const mocks = mockTests.filter(m => m.subject === sub);
    if (mocks.length === 0) return null;
    
    const pctSum = mocks.reduce((sum, m) => sum + ((m.marks / (m.total || 100)) * 100), 0);
    return pctSum / mocks.length;
  };

  const getPillColor = (marks, total) => {
    const pct = (parseFloat(marks) / (parseFloat(total) || 100)) * 100;
    if (pct >= 60) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (pct >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const openAddModal = () => {
    setEditingMock({ isNew: true });
    setDate(getLocalDateString());
    setTestName("");
    setSubject("costing");
    setMarks("");
    setTotal("100");
    setRemarks("");
  };

  const openEditModal = (mock) => {
    setEditingMock(mock);
    setDate(mock.date || "");
    setTestName(mock.test_name || "");
    setSubject(mock.subject || "costing");
    setMarks(mock.marks?.toString() || "");
    setTotal(mock.total?.toString() || "100");
    setRemarks(mock.remarks || "");
  };

  const handleSave = () => {
    if (!testName || !marks || !total) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    const payload = {
      date,
      test_name: testName,
      subject,
      marks: parseFloat(marks) || 0,
      total: parseFloat(total) || 100,
      remarks
    };

    if (editingMock.isNew) {
      onAddMock(payload);
    } else {
      onUpdateMock(editingMock.id, payload);
    }
    setEditingMock(null);
  };

  return (
    <div className="space-y-6">
      {/* Mock average cards */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Test Tracker Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(SUBJECT_DETAILS).map(([key, details]) => {
            const avg = getSubjectMockAvg(key);
            return (
              <div key={key} className="paper-card p-5 text-center">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${details.bg}`}>
                  {details.name}
                </span>
                <p className="font-serif text-xs text-stone-400 font-medium uppercase mt-3">Test Average</p>
                <p className="font-mono text-2xl font-extrabold text-stone-850 mt-1">
                  {avg !== null ? `${Math.round(avg)}%` : <span className="text-stone-300 font-serif text-base font-normal italic">No Data</span>}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock lists and add log */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Test Scores</h3>
            <p className="text-xs text-stone-400">Track 100-mark test papers and evaluations</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-stone-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-850 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Test Paper
          </button>
        </div>

        <div className="paper-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 font-mono">Date</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Test Name</th>
                  <th className="py-3 px-3 text-center">Marks</th>
                  <th className="py-3 px-3 text-center">Percentage</th>
                  <th className="py-3 px-4">Remarks / Focus</th>
                  <th className="py-3 px-4 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {mockTests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-stone-500 font-serif">
                      No test scores recorded yet.
                    </td>
                  </tr>
                ) : (
                  mockTests.map((mock) => {
                    const subDetails = SUBJECT_DETAILS[mock.subject];
                    const pct = ((mock.marks / (mock.total || 1)) * 100).toFixed(0);
                    return (
                      <tr key={mock.id} className="hover:bg-stone-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-stone-600">{mock.date}</td>
                        <td className="py-3.5 px-4">
                          {subDetails && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${subDetails.bg}`}>
                              {subDetails.name}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-stone-900">{mock.test_name}</td>
                        <td className="py-3.5 px-3 font-mono text-xs text-center font-bold text-stone-800">
                          {mock.marks} / {mock.total}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-mono font-bold ${getPillColor(mock.marks, mock.total)}`}>
                            {pct}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-stone-500 italic font-serif">
                          {mock.remarks || "—"}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => openEditModal(mock)}
                              className="p-1 text-stone-400 hover:text-stone-850 hover:bg-stone-100 rounded"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingId(mock.id)}
                              className="p-1 text-stone-300 hover:text-red-600 hover:bg-stone-100 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editingMock && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-stone-200 max-w-md w-full shadow-2xl p-6 relative">
            <button 
              onClick={() => setEditingMock(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-stone-900">
              {editingMock.isNew ? "Record Test Paper" : "Edit Test Log"}
            </h3>
            <p className="text-stone-400 text-xs mt-1">Submit full syllabus test marks</p>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Date</label>
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-semibold"
                  >
                    <option value="costing">Costing</option>
                    <option value="fm">FM</option>
                    <option value="audit">Audit</option>
                    <option value="sm">SM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Mock Test Name *</label>
                <input 
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. ICAI Mock Test Series 1, Prep Mock 2"
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Marks *</label>
                  <input 
                    type="number"
                    step="0.5"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder="e.g. 52"
                    className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Total Marks *</label>
                  <input 
                    type="number"
                    step="0.5"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="100"
                    className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Remarks / Weak Areas identified</label>
                <input 
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Struggled in company audit questions, timed out at the end"
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-600"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setEditingMock(null)}
                className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-850"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <ConfirmModal
          title="Delete Score"
          message="This will permanently delete this test score."
          onConfirm={() => { onDeleteMock(deletingId); setDeletingId(null); }}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}

// FLIP CLOCK COMPONENTS
function AnimatedCard({ value }) {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== current) {
      setPrevious(current);
      setCurrent(value);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setPrevious(value);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [value, current]);

  return (
    <div className="flip-card w-14 h-20 sm:w-20 sm:h-28 lg:w-24 lg:h-32 text-3xl sm:text-5xl lg:text-7xl shadow-xl rounded-xl relative [perspective:1000px]">
      <div className="flip-card-top"><span className="flip-card-text">{current}</span></div>
      <div className="flip-card-bottom"><span className="flip-card-text">{previous}</span></div>
      
      {isFlipping && (
        <>
          <div key={`anim-top-${current}`} className="flip-card-top flip-anim-top">
            <span className="flip-card-text">{previous}</span>
          </div>
          <div key={`anim-bottom-${current}`} className="flip-card-bottom flip-anim-bottom">
            <span className="flip-card-text">{current}</span>
          </div>
        </>
      )}
    </div>
  );
}

function FlipClock({ seconds }) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const hStr = h.toString().padStart(2, '0');
  const mStr = m.toString().padStart(2, '0');
  const sStr = s.toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-3 bg-[#0a0a0a] p-3 sm:p-8 rounded-[2rem] shadow-xl border border-stone-800 w-full max-w-lg mb-8 mt-4 mx-auto">
      {hStr !== "00" && (
        <>
          <AnimatedCard value={hStr} />
          <div className="flex flex-col gap-2 sm:gap-3 pb-2 px-0.5 sm:px-1">
            <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-stone-700/50"></div>
            <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-stone-700/50"></div>
          </div>
        </>
      )}
      <AnimatedCard value={mStr} />
      <div className="flex flex-col gap-2 sm:gap-3 pb-2 px-0.5 sm:px-1">
        <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-stone-700/50"></div>
        <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-stone-700/50"></div>
      </div>
      <AnimatedCard value={sStr} />
    </div>
  );
}

// 8. STUDY TIMER TAB
export function StudyTimerTab() {
  const timerRef = React.useRef(null);
  const stopwatchRef = React.useRef(null);
  const [pomodoroMode, setPomodoroMode] = useState("work"); // 'work' or 'break'
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 mins
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [isEditingPomodoro, setIsEditingPomodoro] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStopwatchFullscreen, setIsStopwatchFullscreen] = useState(false);
  
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time Clock & Fullscreen Listener
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleFsChange = () => {
      setIsFullscreen(document.fullscreenElement === timerRef.current);
      setIsStopwatchFullscreen(document.fullscreenElement === stopwatchRef.current);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      clearInterval(timer);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  // Pomodoro Timer
  useEffect(() => {
    let interval = null;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
      // Optional: Play a sound here or auto-switch
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime]);

  // Stopwatch
  useEffect(() => {
    let interval = null;
    if (stopwatchActive) {
      const startTime = Date.now() - stopwatchTime;
      interval = setInterval(() => {
        setStopwatchTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchActive, stopwatchTime]);

  const togglePomodoro = () => setPomodoroActive(!pomodoroActive);
  
  const resetPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroTime(pomodoroMode === "work" ? 25 * 60 : 5 * 60);
  };
  
  const switchPomodoroMode = (mode) => {
    setPomodoroMode(mode);
    setPomodoroActive(false);
    setPomodoroTime(mode === "work" ? 25 * 60 : 5 * 60);
  };

  const toggleStopwatch = () => setStopwatchActive(!stopwatchActive);
  
  const resetStopwatch = () => {
    setStopwatchActive(false);
    setStopwatchTime(0);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m}:${s}`;
    return `${m}:${s}`;
  };

  const formatStopwatchTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    const msms = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return { main: `${h}:${m}:${s}`, ms: msms };
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (timerRef.current) timerRef.current.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const toggleStopwatchFullscreen = () => {
    if (!document.fullscreenElement) {
      if (stopwatchRef.current) stopwatchRef.current.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Current Time Clock */}
      <div className="lg:col-span-2 flex flex-col items-center justify-center mb-4 mt-2">
        <p className="text-[10px] uppercase text-stone-400 font-bold tracking-[0.2em] mb-2">Local Time</p>
        <div className="font-mono flex items-baseline tracking-tight">
          <span className="text-3xl sm:text-4xl font-light text-stone-800">
            {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' }).split(' ')[0]}
          </span>
          <span className="text-stone-400 text-xl sm:text-2xl ml-1 font-medium">
            :{currentTime.toLocaleTimeString('en-US', { hour12: false, second: '2-digit' })}
          </span>
          <span className="text-stone-300 text-sm sm:text-base ml-2 font-bold tracking-widest">
            {currentTime.toLocaleTimeString('en-US', { hour12: true }).slice(-2)}
          </span>
        </div>
        <p className="text-[11px] text-stone-500 font-medium mt-3 uppercase tracking-widest">
          {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </p>
      </div>

      {/* Pomodoro Timer */}
      <div ref={timerRef} className={`paper-card p-4 sm:p-6 flex flex-col items-center bg-white ${isFullscreen ? 'justify-center h-full' : ''}`}>
        <div className={`w-full flex justify-between items-center mb-6 z-10 ${isFullscreen ? 'absolute top-6 left-0 px-4 sm:px-8' : 'relative'}`}>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif text-xl font-bold text-stone-900">Timer</h2>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
            title="Full Screen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        <div className={`w-full flex-1 flex flex-col items-center justify-center ${isFullscreen ? 'scale-110 sm:scale-125 md:scale-150 transition-transform duration-500' : ''}`}>
          
          <div className="flex bg-stone-100 p-1 rounded-xl items-center mb-6 sm:mb-8 shadow-inner">
            <button 
              onClick={() => switchPomodoroMode("work")}
              className={`text-[11px] sm:text-xs px-6 sm:px-8 py-2 sm:py-2.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
                pomodoroMode === "work" ? 'bg-white text-stone-800 shadow-md' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Work
            </button>
            <button 
              onClick={() => switchPomodoroMode("break")}
              className={`text-[11px] sm:text-xs px-6 sm:px-8 py-2 sm:py-2.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
                pomodoroMode === "break" ? 'bg-white text-stone-800 shadow-md' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Break
            </button>
          </div>

          {isEditingPomodoro ? (
            <div className="flex flex-col items-center gap-6 bg-stone-50 p-8 rounded-[2rem] border border-stone-100 mb-8 mt-4 shadow-sm w-full max-w-lg">
              <h3 className="font-serif font-bold text-stone-700 text-lg">Set Custom Timer</h3>
              <div className="flex items-center justify-center gap-4 font-mono">
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={customHours}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val !== "") {
                        let num = parseInt(val, 10);
                        if (num > 23) val = "23";
                        else if (num < 0) val = "0";
                      }
                      setCustomHours(val);
                    }}
                    className="w-16 h-20 sm:w-28 sm:h-32 md:w-32 md:h-36 text-center text-4xl sm:text-6xl md:text-7xl font-extrabold bg-white border-2 border-stone-200 rounded-2xl shadow-sm focus:outline-none focus:border-stone-800 transition-all text-stone-800"
                    placeholder="00"
                  />
                  <span className="text-stone-400 mt-2 sm:mt-3 text-[10px] font-bold uppercase tracking-widest">Hours</span>
                </div>
                <div className="text-2xl sm:text-4xl font-black text-stone-300 pb-8">:</div>
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customMinutes}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val !== "") {
                        let num = parseInt(val, 10);
                        if (num > 59) val = "59";
                        else if (num < 0) val = "0";
                      }
                      setCustomMinutes(val);
                    }}
                    className="w-16 h-20 sm:w-28 sm:h-32 md:w-32 md:h-36 text-center text-4xl sm:text-6xl md:text-7xl font-extrabold bg-white border-2 border-stone-200 rounded-2xl shadow-sm focus:outline-none focus:border-stone-800 transition-all text-stone-800"
                    placeholder="00"
                    autoFocus
                  />
                  <span className="text-stone-400 mt-2 sm:mt-3 text-[10px] font-bold uppercase tracking-widest">Minutes</span>
                </div>
              </div>
              <div className="flex gap-3 w-full max-w-xs mt-4">
                <button 
                  onClick={() => setIsEditingPomodoro(false)}
                  className="flex-1 text-sm font-semibold bg-white border-2 border-stone-200 text-stone-600 py-3 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const h = parseInt(customHours || 0, 10);
                    const m = parseInt(customMinutes || 0, 10);
                    const totalMins = (h * 60) + m;
                    if (totalMins > 0) {
                      setPomodoroTime(totalMins * 60);
                      setPomodoroActive(false);
                    }
                    setIsEditingPomodoro(false);
                  }}
                  className="flex-1 text-sm font-bold bg-stone-900 text-white py-3 rounded-xl hover:bg-stone-800 transition-colors shadow-md"
                >
                  Save Time
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FlipClock seconds={pomodoroTime} />
              <button 
                onClick={() => {
                  const totalMins = Math.floor(pomodoroTime / 60);
                  setCustomHours(Math.floor(totalMins / 60));
                  setCustomMinutes(totalMins % 60);
                  setIsEditingPomodoro(true);
                  setPomodoroActive(false);
                }}
                className="text-xs font-semibold text-stone-400 hover:text-stone-700 underline underline-offset-4 mb-4"
              >
                Edit Timer Duration
              </button>
            </div>
          )}
        </div>

        <div className={`flex gap-4 w-full z-10 ${isFullscreen ? 'absolute bottom-4 sm:bottom-10 left-0 px-4 sm:px-10 max-w-4xl mx-auto right-0' : 'relative'}`}>
          <button 
            onClick={togglePomodoro}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              pomodoroActive 
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            {pomodoroActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {pomodoroActive ? "Pause" : "Start Focus"}
          </button>
          <button 
            onClick={resetPomodoro}
            className="w-14 flex items-center justify-center bg-white border-2 border-stone-200 text-stone-500 hover:bg-stone-50 rounded-xl"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stopwatch Timer */}
      <div ref={stopwatchRef} className={`paper-card p-4 sm:p-6 flex flex-col items-center bg-white ${isStopwatchFullscreen ? 'justify-center h-full' : ''}`}>
        <div className={`w-full flex justify-between items-center mb-6 z-10 ${isStopwatchFullscreen ? 'absolute top-6 left-0 px-4 sm:px-8' : 'relative'}`}>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="font-serif text-xl font-bold text-stone-900">Stopwatch</h2>
          </div>
          <button 
            onClick={toggleStopwatchFullscreen}
            className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
            title="Full Screen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        <div className={`w-full flex-1 flex flex-col items-center justify-center ${isStopwatchFullscreen ? 'scale-110 sm:scale-125 md:scale-150 transition-transform duration-500' : ''}`}>
          <div className="w-full max-w-[17rem] sm:max-w-md flex items-center justify-center bg-[#111111] rounded-[2rem] shadow-2xl border border-stone-800 mb-8 mt-4 py-8 px-2 sm:py-12 sm:px-6">
            <div className="font-mono flex items-baseline text-white">
              <span className="text-[2.5rem] leading-none sm:text-6xl lg:text-7xl font-black tracking-tight">
                {formatStopwatchTime(stopwatchTime).main}
              </span>
              <span className="text-xl sm:text-3xl lg:text-4xl font-bold text-stone-400 mb-1 tracking-tight ml-1 sm:ml-2">
                :{formatStopwatchTime(stopwatchTime).ms}
              </span>
            </div>
          </div>
        </div>

        <div className={`flex gap-4 w-full z-10 ${isStopwatchFullscreen ? 'absolute bottom-4 sm:bottom-10 left-0 px-4 sm:px-10 max-w-4xl mx-auto right-0' : 'relative'}`}>
          <button 
            onClick={toggleStopwatch}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              stopwatchActive 
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            {stopwatchActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {stopwatchActive ? "Pause" : "Start Session"}
          </button>
          <button 
            onClick={resetStopwatch}
            className="w-14 flex items-center justify-center bg-white border-2 border-stone-200 text-stone-500 hover:bg-stone-50 rounded-xl"
            title="Reset Stopwatch"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
}

