"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Video, Send } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
interface MatchInfo {
  other_user: { name: string; university: string };
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/match/${id}`).then((r) => r.json()),
      fetch(`/api/messages/${id}`).then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ]).then(([matchData, msgData, meData]) => {
      setMatchInfo(matchData.match ?? null);
      setMessages(msgData.messages ?? []);
      setMyId(meData.id ?? null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!text.trim() || sending) return;
    const content = text.trim();
    setText("");
    setSending(true);
    // Optimistic
    const tmpId = `tmp-${Date.now()}`;
    setMessages((prev) => [...prev, {
      id: tmpId, sender_id: myId ?? "", content, created_at: new Date().toISOString()
    }]);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => prev.map((m) => m.id === tmpId ? data.message : m));
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tmpId));
    } finally {
      setSending(false);
    }
  }

  const name = matchInfo?.other_user.name ?? "…";

  return (
    <main className="flex min-h-screen flex-col" style={{ background: "#F5F2EE" }}>
      {/* ── Header ── */}
      <div
        className="shrink-0 px-4 pt-14 pb-3"
        style={{
          background: "linear-gradient(160deg, #4A2410 0%, #3D1F0D 100%)",
          boxShadow: "0 4px 20px rgba(61,31,13,0.25)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.10)" }}
          >
            <ArrowLeft size={19} color="rgba(255,255,255,0.85)" />
          </button>

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #7A4A2A, #C4A882)",
              boxShadow: "0 2px 8px rgba(61,31,13,0.30)",
            }}
          >
            {initials(name)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm leading-tight truncate" style={{ letterSpacing: "-0.01em" }}>
              {name}
            </p>
            {matchInfo?.other_user.university && (
              <p className="text-[11px] text-white/45 truncate font-lora italic">
                {matchInfo.other_user.university}
              </p>
            )}
          </div>

          <button
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.10)" }}
          >
            <Video size={18} color="rgba(255,255,255,0.60)" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto scroll-smooth-ios px-4 py-5 space-y-2">
        {loading && (
          <div className="space-y-3 animate-fade-in">
            {[1,2,3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div
                  className="skeleton rounded-2xl"
                  style={{ width: `${120 + i * 30}px`, height: 38, animationDelay: `${i * 0.1}s` }}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-3xl mb-2">☕</p>
            <p className="text-sm font-semibold text-brew-walnut mb-1">Start the conversation</p>
            <p className="text-xs font-lora italic text-brew-khaki">Say hi and plan that coffee chat!</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender_id === myId;
          const isLast = i === messages.length - 1;
          const showTime = isLast || messages[i + 1]?.sender_id !== msg.sender_id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-fade-in`}
              style={{ animationDelay: `${Math.min(i * 0.04, 0.3)}s` }}
            >
              <div
                className="max-w-[75%] px-4 py-2.5 text-sm leading-relaxed"
                style={{
                  borderRadius: isMe
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                  background: isMe
                    ? "linear-gradient(135deg, #4A2C17, #3D1F0D)"
                    : "#fff",
                  color: isMe ? "#fff" : "var(--brew-body)",
                  boxShadow: isMe
                    ? "0 2px 10px rgba(61,31,13,0.28)"
                    : "0 1px 4px rgba(61,31,13,0.08), 0 4px 12px rgba(61,31,13,0.06)",
                  opacity: msg.id.startsWith("tmp-") ? 0.7 : 1,
                  transition: "opacity 0.2s ease",
                }}
              >
                {msg.content}
              </div>
              {showTime && (
                <p className="text-[10px] text-brew-khaki mt-1 px-1">
                  {formatTime(msg.created_at)}
                </p>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        className="shrink-0 px-4 py-3 flex items-end gap-3"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(212,207,198,0.4)",
          boxShadow: "0 -4px 20px rgba(61,31,13,0.05)",
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message…"
          rows={1}
          className="flex-1 brew-input resize-none text-sm"
          style={{ minHeight: "42px", maxHeight: "120px", paddingTop: "0.6rem", paddingBottom: "0.6rem" }}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all disabled:opacity-35"
          style={{
            background: text.trim()
              ? "linear-gradient(135deg, #4A2C17, #3D1F0D)"
              : "#E8E4DC",
            boxShadow: text.trim() ? "0 3px 12px rgba(61,31,13,0.28)" : "none",
            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Send size={15} color={text.trim() ? "#fff" : "#B0A99F"} style={{ marginLeft: 1 }} />
        </button>
      </div>
    </main>
  );
}
