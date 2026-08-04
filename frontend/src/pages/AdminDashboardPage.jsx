import { useEffect, useState } from "react";
import { FiUsers, FiCpu, FiPlus, FiTrash2, FiEdit2, FiActivity, FiSearch, FiCheck, FiSettings, FiCheckSquare } from "react-icons/fi";
import api from "../api/client";
import PageHeader from "../components/ui/PageHeader";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useToast } from "../components/ui/ToastProvider";

const AdminDashboardPage = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Question Form State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    title: "",
    category: "DSA",
    topic: "",
    difficulty: "Medium",
    company: "General",
    type: "Subjective",
    description: "",
    options: "", // comma separated for MCQs
    correctAnswer: "",
    explanation: "",
    starterCodePython: "",
    starterCodeCpp: "",
    starterCodeJava: ""
  });

  // Prompt Editor State
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [promptContent, setPromptContent] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes, promptsRes, questionsRes] = await Promise.all([
        api.get("/admin/analytics"),
        api.get("/admin/users"),
        api.get("/admin/prompts"),
        api.get("/questions?limit=100") // load some questions
      ]);

      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setPrompts(promptsRes.data);
      setQuestions(Array.isArray(questionsRes.data) ? questionsRes.data : questionsRes.data?.items || []);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to load admin workspace. Check permissions.", "error");
    } finally {
      setLoading(false);
    }
  };

  // User Actions
  const handleToggleAdmin = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`);
      setUsers(users.map(u => u._id === userId ? { ...u, role: data.role } : u));
      showToast(data.message, "success");
    } catch (error) {
      showToast("Error updating user role", "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      showToast("User deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting user", "error");
    }
  };

  // Prompt Actions
  const handleUpdatePrompt = async (key) => {
    try {
      await api.put(`/admin/prompts/${key}`, { content: promptContent });
      setPrompts(prompts.map(p => p.key === key ? { ...p, content: promptContent } : p));
      setEditingPrompt(null);
      showToast("AI prompt template updated", "success");
    } catch (error) {
      showToast("Error updating AI prompt", "error");
    }
  };

  // Question CRUD Actions
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    const payload = {
      ...questionForm,
      options: questionForm.options.split(",").map(o => o.trim()).filter(Boolean),
      starterCode: {
        python: questionForm.starterCodePython || undefined,
        cpp: questionForm.starterCodeCpp || undefined,
        java: questionForm.starterCodeJava || undefined
      }
    };

    try {
      if (editingQuestion) {
        // Update
        const { data } = await api.put(`/admin/questions/${editingQuestion._id}`, payload);
        setQuestions(questions.map(q => q._id === editingQuestion._id ? data : q));
        showToast("Question updated successfully", "success");
      } else {
        // Create
        const { data } = await api.post("/admin/questions", payload);
        setQuestions([data, ...questions]);
        showToast("Question created successfully", "success");
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
      resetQuestionForm();
    } catch (error) {
      showToast("Error saving question", "error");
    }
  };

  const handleEditQuestionClick = (q) => {
    setEditingQuestion(q);
    setQuestionForm({
      title: q.title || "",
      category: q.category || "DSA",
      topic: q.topic || "",
      difficulty: q.difficulty || "Medium",
      company: q.company || "General",
      type: q.type || "Subjective",
      description: q.description || "",
      options: (q.options || []).join(", "),
      correctAnswer: q.correctAnswer || "",
      explanation: q.explanation || "",
      starterCodePython: q.starterCode?.python || "",
      starterCodeCpp: q.starterCode?.cpp || "",
      starterCodeJava: q.starterCode?.java || ""
    });
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await api.delete(`/admin/questions/${qId}`);
      setQuestions(questions.filter(q => q._id !== qId));
      showToast("Question deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting question", "error");
    }
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      title: "",
      category: "DSA",
      topic: "",
      difficulty: "Medium",
      company: "General",
      type: "Subjective",
      description: "",
      options: "",
      correctAnswer: "",
      explanation: "",
      starterCodePython: "",
      starterCodeCpp: "",
      starterCodeJava: ""
    });
  };

  if (loading) {
    return <LoadingScreen title="Loading Admin Workspace..." subtitle="Resolving analytical data and prompt configurations" />;
  }

  // Filter lists based on search
  const filteredUsers = users.filter(u => 
    String(u.name).toLowerCase().includes(searchQuery.toLowerCase()) || 
    String(u.email).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuestions = questions.filter(q => 
    String(q.title).toLowerCase().includes(searchQuery.toLowerCase()) || 
    String(q.topic).toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(q.company).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 snx-fade-in">
      <PageHeader
        kicker="System Control Center"
        title="Admin Workspace Dashboard"
        description="Monitor platform analytics, manage registration profiles, tweak OpenAI system prompts, and update coding questions."
      />

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-custom-200 dark:border-slate-custom-700">
        {[
          { id: "analytics", label: "Overview Metrics", icon: FiActivity },
          { id: "users", label: "User Profiles", icon: FiUsers },
          { id: "questions", label: "Question Editor", icon: FiCheckSquare },
          { id: "prompts", label: "AI Prompt Manager", icon: FiSettings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-all duration-200 ${
              activeTab === tab.id
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-custom-500 hover:text-slate-custom-850"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* VIEW: Analytics */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          <div className="snx-grid-auto">
            {[
              { label: "Total Users Registered", value: analytics.totalUsers, meta: "Registered profiles", icon: FiUsers },
              { label: "Practice Questions", value: analytics.totalQuestions, meta: "Database size", icon: FiCheckSquare },
              { label: "AI Evaluations Conducted", value: analytics.totalEvaluations, meta: "Total evaluations", icon: FiCpu },
              { label: "Average Evaluation Score", value: `${analytics.averageScore}%`, meta: "Platform average accuracy", icon: FiActivity }
            ].map((stat) => (
              <div key={stat.label} className="snx-stat snx-card-elevated">
                <div className="flex items-center justify-between">
                  <span className="snx-label">{stat.label}</span>
                  <stat.icon className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="snx-stat-value mt-2">{stat.value}</div>
                <p className="snx-stat-label mt-1">{stat.meta}</p>
              </div>
            ))}
          </div>

          {/* Registration Log Chart list */}
          <div className="snx-panel-muted space-y-4">
            <h3 className="snx-heading-3">Recent Registration Log (Last 10 active dates)</h3>
            <div className="divide-y divide-slate-custom-100 dark:divide-slate-custom-800">
              {analytics.registrationTrend && analytics.registrationTrend.length > 0 ? (
                analytics.registrationTrend.map((day) => (
                  <div key={day._id} className="flex justify-between py-2.5 text-sm">
                    <span className="font-medium text-slate-custom-700 dark:text-slate-custom-300">{day._id}</span>
                    <span className="font-bold text-slate-custom-900 dark:text-white">+{day.count} new users</span>
                  </div>
                ))
              ) : (
                <p className="text-xs italic text-slate-custom-500 py-4">No registration history logged recently.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Users Management */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-custom-500" />
            <input
              type="text"
              placeholder="Search user profile name or email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="snx-input pl-11"
            />
          </div>

          <div className="snx-panel-muted overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-custom-200 dark:border-slate-custom-700 text-slate-custom-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Target Track</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-custom-100 dark:divide-slate-custom-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="align-middle">
                    <td className="py-3 font-semibold text-slate-custom-900 dark:text-white">{u.name}</td>
                    <td className="py-3 text-slate-custom-600 dark:text-slate-custom-400">{u.email}</td>
                    <td className="py-3 text-xs font-semibold text-brand-600">{u.targetField || "Software"}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-slate-custom-100 text-slate-custom-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleAdmin(u._id)}
                        className="snx-btn-secondary snx-btn-sm !py-1 text-xs cursor-pointer"
                      >
                        Toggle Admin
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="snx-btn-secondary snx-btn-sm !py-1 !text-red-500 hover:!border-red-400 border border-transparent cursor-pointer"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: Question Editor */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-custom-500" />
              <input
                type="text"
                placeholder="Search questions by title, topic, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="snx-input pl-11"
              />
            </div>
            <button
              onClick={() => {
                setEditingQuestion(null);
                resetQuestionForm();
                setShowQuestionModal(true);
              }}
              className="snx-btn-primary flex items-center gap-2 cursor-pointer shrink-0"
            >
              <FiPlus className="h-4 w-4" /> Add Question
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filteredQuestions.map((q) => (
              <div key={q._id} className="snx-card !p-4 flex items-center justify-between gap-4 hover:-translate-y-0">
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-slate-custom-900 dark:text-white truncate">{q.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-custom-500">
                    <span className="font-bold text-indigo-600 uppercase">{q.category}</span>
                    <span>•</span>
                    <span>{q.topic}</span>
                    <span>•</span>
                    <span>{q.difficulty}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEditQuestionClick(q)}
                    className="h-8 w-8 rounded-lg border border-slate-custom-200 flex items-center justify-center text-slate-custom-600 hover:bg-slate-custom-50 dark:border-slate-custom-700 cursor-pointer"
                  >
                    <FiEdit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q._id)}
                    className="h-8 w-8 rounded-lg border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 dark:border-red-950/20 cursor-pointer"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: Prompt Configurator */}
      {activeTab === "prompts" && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {prompts.map((prompt) => {
              const isEditing = editingPrompt === prompt.key;
              return (
                <div key={prompt.key} className="snx-panel-muted space-y-4">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-custom-100 pb-3 dark:border-slate-custom-800">
                    <div>
                      <h4 className="font-bold text-slate-custom-900 dark:text-white text-sm">{prompt.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-custom-400 font-mono uppercase bg-slate-custom-50 dark:bg-slate-custom-850 px-2 py-0.5 rounded">
                        Key: {prompt.key}
                      </span>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setEditingPrompt(prompt.key);
                          setPromptContent(prompt.content);
                        }}
                        className="snx-btn-secondary snx-btn-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <FiEdit2 className="h-3.5 w-3.5" /> Edit Template
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdatePrompt(prompt.key)}
                          className="snx-btn-primary snx-btn-sm flex items-center gap-1 cursor-pointer"
                        >
                          <FiCheck className="h-3.5 w-3.5" /> Save
                        </button>
                        <button
                          onClick={() => setEditingPrompt(null)}
                          className="snx-btn-secondary snx-btn-sm cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-custom-500 uppercase">Template Variables: Use curly braces placeholder variables e.g. {"{{role}}"}, {"{{difficulty}}"}</label>
                      <textarea
                        value={promptContent}
                        onChange={(e) => setPromptContent(e.target.value)}
                        className="snx-textarea min-h-[300px] text-xs font-mono"
                      />
                    </div>
                  ) : (
                    <pre className="text-xs text-slate-custom-600 dark:text-slate-custom-400 bg-slate-custom-50 dark:bg-slate-custom-850 p-4 rounded-xl max-h-[160px] overflow-y-auto font-mono whitespace-pre-wrap">
                      {prompt.content}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: Question Creator/Editor */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-custom-900/60 backdrop-blur-sm">
          <div className="snx-panel-muted w-full max-w-3xl max-h-[85vh] overflow-y-auto snx-scrollbar space-y-6">
            <div className="flex items-center justify-between border-b border-slate-custom-200 pb-3 dark:border-slate-custom-700">
              <h3 className="font-bold text-slate-custom-900 dark:text-white text-base">
                {editingQuestion ? "Edit Practice Question" : "Create New Question"}
              </h3>
              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  setEditingQuestion(null);
                  resetQuestionForm();
                }}
                className="h-8 w-8 rounded-lg border border-slate-custom-200 flex items-center justify-center text-slate-custom-600 hover:bg-slate-custom-50 cursor-pointer dark:border-slate-custom-700"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-bold text-slate-custom-500 uppercase">Question Title</span>
                  <input
                    type="text"
                    required
                    value={questionForm.title}
                    onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                    className="snx-input !h-9 text-xs"
                    placeholder="e.g. Find First and Last Position of Element"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-bold text-slate-custom-500 uppercase">Category</span>
                  <select
                    value={questionForm.category}
                    onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                    className="snx-input !h-9 text-xs"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Core Subjects">Core Subjects</option>
                    <option value="HR">HR / Behavioral</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-bold text-slate-custom-500 uppercase">Topic Name</span>
                  <input
                    type="text"
                    required
                    value={questionForm.topic}
                    onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                    className="snx-input !h-9 text-xs"
                    placeholder="e.g. Arrays, OS scheduling"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-bold text-slate-custom-500 uppercase">Difficulty</span>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    className="snx-input !h-9 text-xs"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-bold text-slate-custom-500 uppercase">Question Type</span>
                  <select
                    value={questionForm.type}
                    onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value })}
                    className="snx-input !h-9 text-xs"
                  >
                    <option value="Subjective">Subjective (AI graded text)</option>
                    <option value="Coding">Coding Sandbox (Compiler matching)</option>
                    <option value="MCQ">MCQ Quiz (Multiple Choice)</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-bold text-slate-custom-500 uppercase">Featured Company</span>
                  <input
                    type="text"
                    value={questionForm.company}
                    onChange={(e) => setQuestionForm({ ...questionForm, company: e.target.value })}
                    className="snx-input !h-9 text-xs"
                    placeholder="e.g. Amazon, Google, General"
                  />
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-xs font-bold text-slate-custom-500 uppercase">Problem Description</span>
                <textarea
                  required
                  value={questionForm.description}
                  onChange={(e) => setQuestionForm({ ...questionForm, description: e.target.value })}
                  className="snx-textarea min-h-[100px] text-xs"
                  placeholder="Write clear question instructions..."
                />
              </label>

              {questionForm.type === "MCQ" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1">
                    <span className="text-xs font-bold text-slate-custom-500 uppercase">Options (Comma separated)</span>
                    <input
                      type="text"
                      value={questionForm.options}
                      onChange={(e) => setQuestionForm({ ...questionForm, options: e.target.value })}
                      className="snx-input !h-9 text-xs"
                      placeholder="e.g. Option A, Option B, Option C, Option D"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs font-bold text-slate-custom-500 uppercase">Correct Answer option text</span>
                    <input
                      type="text"
                      value={questionForm.correctAnswer}
                      onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                      className="snx-input !h-9 text-xs"
                      placeholder="e.g. Option A"
                    />
                  </label>
                </div>
              )}

              {questionForm.type !== "MCQ" && (
                <label className="block space-y-1">
                  <span className="text-xs font-bold text-slate-custom-500 uppercase">Correct Answer / Reference Solution</span>
                  <textarea
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                    className="snx-textarea min-h-[80px] text-xs"
                    placeholder="Reference code logic or subjective keywords for grader comparison..."
                  />
                </label>
              )}

              <label className="block space-y-1">
                <span className="text-xs font-bold text-slate-custom-500 uppercase">Detailed Solution Explanation</span>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="snx-textarea min-h-[80px] text-xs"
                  placeholder="Include time and space complexity explanations..."
                />
              </label>

              {questionForm.type === "Coding" && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-custom-500 uppercase border-b pb-1">Starter Template Code</div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-slate-custom-400 uppercase">Python</span>
                      <textarea
                        value={questionForm.starterCodePython}
                        onChange={(e) => setQuestionForm({ ...questionForm, starterCodePython: e.target.value })}
                        className="snx-textarea min-h-[100px] text-[10px] font-mono"
                        placeholder="def solution():\n    pass"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-slate-custom-400 uppercase">C++</span>
                      <textarea
                        value={questionForm.starterCodeCpp}
                        onChange={(e) => setQuestionForm({ ...questionForm, starterCodeCpp: e.target.value })}
                        className="snx-textarea min-h-[100px] text-[10px] font-mono"
                        placeholder="int solution() {\n    return 0;\n}"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-slate-custom-400 uppercase">Java</span>
                      <textarea
                        value={questionForm.starterCodeJava}
                        onChange={(e) => setQuestionForm({ ...questionForm, starterCodeJava: e.target.value })}
                        className="snx-textarea min-h-[100px] text-[10px] font-mono"
                        placeholder="class Solution {\n    public int solution() {\n        return 0;\n    }\n}"
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestionModal(false);
                    setEditingQuestion(null);
                    resetQuestionForm();
                  }}
                  className="snx-btn-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="snx-btn-primary cursor-pointer">
                  {editingQuestion ? "Save Changes" : "Publish Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
