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

  useEffect(() => {
    // Load match info + messages
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
    setSending(true);
    const content = text.trim();
    setText("");
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.message) setMessages((prev) => [...prev, data.message]);
    } catch { /* non-critical */ } finally {
      setSending(false);
    }
  }

  const name = matchInfo?.other_user.name ?? "…";

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Header ── */}
      <div className="bg-brew-walnut px-4 pt-10 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#C4A882] flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-brew-walnut">{initials(name)}</span>
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white leading-tight truncate">{name}</p>
            {matchInfo?.other_user.university && (
              <p className="text-xs text-white/50 truncate">{matchInfo.other_user.university}</p>
            )}
          </div>

          {/* Video icon */}
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition">
            <Video size={20} className="text-white/70" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 pb-24">
        {loading && (
          <p className="text-center text-sm text-brew-khaki animate-pulse py-8">Loading…</p>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">☕</p>
            <p className="text-sm text-brew-midbrown">No messages yet.</p>
            <p className="text-xs text-brew-khaki mt-1 font-lora italic">Say hi and set up that coffee chat!</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === myId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? "bg-brew-walnut text-white rounded-br-sm"
                    : "bg-white border border-[#E8E4DC] text-brew-body rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="sticky bottom-0 bg-white border-t border-[#E8E4DC] px-4 py-3 flex items-end gap-3">
        <textarea
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
          className="flex-1 brew-input resize-none py-2.5 text-sm"
          style={{ minHeight: "42px", maxHeight: "120px" }}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full bg-brew-walnut flex items-center justify-center shrink-0 hover:bg-brew-body active:scale-95 transition disabled:opacity-40"
        >
          <Send size={16} className="text-white ml-0.5" />
        </button>
      </div>
    </main>
  );
}
