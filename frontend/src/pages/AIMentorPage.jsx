import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import { useToast } from "../components/ui/ToastProvider";
import {
  MentorHeader,
  WelcomeState,
  ConversationSidebar,
  AIMessage,
  UserMessage,
  ContextPanel,
  ChatInput
} from "../components/mentor";

const STORAGE_PREFIX = "skillnexa_mentor_sessions";

export const AIMentorPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const messagesEndRef = useRef(null);

  const storageKey = useMemo(() => {
    return `${STORAGE_PREFIX}_${user?._id || user?.id || "guest"}`;
  }, [user?._id, user?.id]);

  // Load saved sessions from localStorage
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    return conversations[0]?.id || null;
  });

  const [messages, setMessages] = useState([]);
  const [activeMode, setActiveMode] = useState("general");
  const [activeContext, setActiveContext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Ingest incoming context from route state (e.g. from Practice or Learn)
  useEffect(() => {
    if (location.state?.context) {
      setActiveContext(location.state.context);
      if (location.state.mode) {
        setActiveMode(location.state.mode);
      }
      // If prompt was passed, auto-fill or suggest
    }
  }, [location.state]);

  // Synchronize active conversation with messages state
  useEffect(() => {
    if (activeConversationId) {
      const activeConv = conversations.find((c) => c.id === activeConversationId);
      if (activeConv) {
        setMessages(activeConv.messages || []);
        setActiveMode(activeConv.mode || "general");
        if (activeConv.context) {
          setActiveContext(activeConv.context);
        }
      }
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  // Save conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(conversations));
    } catch (e) {
      console.error("Failed to save chat sessions:", e);
    }
  }, [conversations, storageKey]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messages.length > 0 || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Start a new chat session
  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Conversation",
      messages: [],
      mode: activeMode,
      context: activeContext,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setConversations((prev) => [newSession, ...prev]);
    setActiveConversationId(newId);
    setMessages([]);
    setMobileSidebarOpen(false);
  };

  // Delete a chat session
  const handleDeleteConversation = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining[0]?.id || null);
    }
  };

  // Send message to AI
  const handleSendMessage = async (textToSend, overrideMode) => {
    if (!textToSend.trim() || loading) return;

    const modeToUse = overrideMode || activeMode;
    const userMsg = {
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", {
        messages: nextMessages,
        context: activeContext,
        mode: modeToUse
      });

      const assistantMsg = {
        role: "assistant",
        content: data.content || "I am ready to help you solve this.",
        timestamp: data.timestamp || new Date().toISOString()
      };

      const finalMessages = [...nextMessages, assistantMsg];
      setMessages(finalMessages);

      // Create or update conversation in session history
      const titleSnippet = textToSend.slice(0, 36) + (textToSend.length > 36 ? "..." : "");
      setConversations((prev) => {
        const existingIdx = prev.findIndex((c) => c.id === activeConversationId);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            title: updated[existingIdx].messages.length === 0 ? titleSnippet : updated[existingIdx].title,
            messages: finalMessages,
            mode: modeToUse,
            context: activeContext,
            updatedAt: new Date().toISOString()
          };
          return updated;
        } else {
          const newSession = {
            id: `session-${Date.now()}`,
            title: titleSnippet,
            messages: finalMessages,
            mode: modeToUse,
            context: activeContext,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setActiveConversationId(newSession.id);
          return [newSession, ...prev];
        }
      });
    } catch (error) {
      console.error("AI mentor request failed:", error);
      const errorMsg = {
        role: "assistant",
        content: "I ran into a temporary issue processing your message. Please check your connection or try again.",
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages([...nextMessages, errorMsg]);
      showToast?.("Unable to generate response right now", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Regenerate latest assistant response
  const handleRegenerate = async () => {
    if (loading || messages.length === 0) return;
    const lastUserIdx = [...messages].map((m, i) => (m.role === "user" ? i : -1)).filter((i) => i !== -1).pop();
    if (lastUserIdx === undefined) return;

    const trimmedMessages = messages.slice(0, lastUserIdx + 1);
    const lastUserMsg = messages[lastUserIdx].content;

    setMessages(trimmedMessages);
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", {
        messages: trimmedMessages,
        context: activeContext,
        mode: activeMode
      });

      const assistantMsg = {
        role: "assistant",
        content: data.content || "Here is the updated explanation.",
        timestamp: data.timestamp || new Date().toISOString()
      };

      setMessages([...trimmedMessages, assistantMsg]);
    } catch (err) {
      showToast?.("Regeneration failed", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Clear current active conversation messages
  const handleClearChat = () => {
    setMessages([]);
    if (activeConversationId) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConversationId ? { ...c, messages: [] } : c))
      );
    }
  };

  return (
    <PageContainer maxWidth="7xl" className="space-y-4">
      {/* 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-4 sm:gap-6 min-h-[calc(100vh-140px)] items-start">
        {/* Left Column: Chat Sessions History (Desktop & Mobile Drawer) */}
        <aside
          className={`space-y-4 md:sticky md:top-20 md:block ${
            mobileSidebarOpen ? "block" : "hidden md:block"
          }`}
        >
          <Card className="p-4 border border-[var(--snx-border)] bg-[var(--snx-surface)] h-[calc(100vh-160px)] flex flex-col">
            <ConversationSidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={(id) => {
                setActiveConversationId(id);
                setMobileSidebarOpen(false);
              }}
              onNewConversation={handleNewChat}
              onDeleteConversation={handleDeleteConversation}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </Card>
        </aside>

        {/* Right Column: Chat Window */}
        <main className="flex flex-col h-[calc(100vh-160px)] min-w-0 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-[var(--snx-surface)]">
            <MentorHeader
              onNewChat={handleNewChat}
              onClearChat={handleClearChat}
              onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              hasMessages={messages.length > 0}
            />

            {/* Context Panel (If active) */}
            {activeContext && (
              <div className="mt-3">
                <ContextPanel
                  context={activeContext}
                  onRemoveContext={() => setActiveContext(null)}
                />
              </div>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto snx-scrollbar p-4 sm:p-6 space-y-6">
            {messages.length === 0 ? (
              <WelcomeState
                onSelectPrompt={(prompt, mode) => {
                  if (mode) setActiveMode(mode);
                  handleSendMessage(prompt, mode);
                }}
                onSelectMode={(mode) => setActiveMode(mode)}
              />
            ) : (
              messages.map((msg, index) => {
                const isLatest = index === messages.length - 1;

                if (msg.role === "user") {
                  return (
                    <UserMessage
                      key={index}
                      content={msg.content}
                      timestamp={msg.timestamp}
                      user={user}
                    />
                  );
                }

                return (
                  <AIMessage
                    key={index}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    isLatest={isLatest}
                    onRegenerate={handleRegenerate}
                  />
                );
              })
            )}

            {/* Thinking / Loading Indicator */}
            {loading && (
              <div className="flex gap-3 items-center text-xs text-slate-500 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white animate-pulse">
                  <span className="text-[10px] font-black">AI</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span>Mentor is analyzing your question</span>
                  <span className="inline-flex gap-0.5">
                    <span className="h-1 w-1 rounded-full bg-slate-400 animate-bounce" />
                    <span className="h-1 w-1 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1 w-1 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Bottom Input Area */}
          <div className="p-4 border-t border-[var(--snx-border)] bg-[var(--snx-surface)]/95 backdrop-blur-md">
            <ChatInput
              onSendMessage={(text) => handleSendMessage(text)}
              loading={loading}
              activeMode={activeMode}
              onChangeMode={(m) => setActiveMode(m)}
            />
          </div>
        </main>
      </div>
    </PageContainer>
  );
};

export default AIMentorPage;
