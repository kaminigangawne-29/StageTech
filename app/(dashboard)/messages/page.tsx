'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Conversation, Message } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatMessageTime(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

function Avatar({
  name,
  size = 'md',
  online,
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
}) {
  const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  // Generate a hue from the name for consistent colour
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold text-black`}
        style={{ background: `hsl(${hue}, 55%, 30%)`, border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {getInitials(name)}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#FFF4D6]`}
          style={{ backgroundColor: online ? '#1B9E5A' : '#444444' }}
        />
      )}
    </div>
  );
}

// ─── Conversation Item ────────────────────────────────────────────────────────

function ConversationItem({
  conv,
  selected,
  onClick,
}: {
  conv: Conversation;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors
        ${selected ? 'bg-[#E63946]/10 border-r-2 border-[#E63946]' : 'hover:bg-[#1a1a2a]'}`}
    >
      <Avatar name={conv.participantName} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-sm font-semibold truncate ${selected ? 'text-[#E63946]' : 'text-black'}`}>
            {conv.participantName}
          </span>
          <span className="text-[10px] text-[#444444] flex-shrink-0">{formatTime(conv.lastMessageAt)}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-[#444444] truncate">{conv.lastMessage}</p>
          {conv.unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#E63946] text-[#FFF4D6] text-[10px] font-bold flex items-center justify-center">
              {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, isSent }: { msg: Message; isSent: boolean }) {
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${
            isSent
              ? 'bg-[#E63946] text-[#FFF4D6] rounded-tr-sm'
              : 'bg-[#FFFFFF] text-black border border-[#111111] rounded-tl-sm'
          }`}
      >
        <p className="break-words">{msg.content}</p>
        <p
          className={`text-[10px] mt-1 text-right ${
            isSent ? 'text-[#FFF4D6]/60' : 'text-[#444444]'
          }`}
        >
          {formatMessageTime(msg.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id as string | undefined;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convsLoading, setConvsLoading] = useState(true);
  const [convsError, setConvsError] = useState('');
  const [search, setSearch] = useState('');

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [sendText, setSendText] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch Conversations ───────────────────────────────────────────────────

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages/conversations');
      if (!res.ok) throw new Error('Failed to load conversations.');
      const data: Conversation[] = await res.json();
      setConversations(data);
    } catch (err: any) {
      setConvsError(err.message);
    } finally {
      setConvsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ── Fetch Messages ────────────────────────────────────────────────────────

  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/messages/${convId}`);
      if (!res.ok) throw new Error('Failed to load messages.');
      const data: Message[] = await res.json();
      setMessages(data);
    } catch {
      // silently fail on poll errors
    }
  }, []);

  // Select conversation
  const selectConversation = (convId: string) => {
    setSelectedConvId(convId);
    setMessages([]);
    setMsgsLoading(true);
    fetchMessages(convId).finally(() => setMsgsLoading(false));
    // Mark unread as 0 locally
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
    inputRef.current?.focus();
  };

  // ── Auto-scroll ───────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Polling every 5s ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!selectedConvId) return;

    pollRef.current = setInterval(() => {
      fetchMessages(selectedConvId);
      fetchConversations();
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [selectedConvId, fetchMessages, fetchConversations]);

  // ── Send Message ──────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!sendText.trim() || !selectedConvId || sending) return;
    const content = sendText.trim();
    setSendText('');
    setSending(true);

    // Optimistic update
    const optimisticMsg: Message = {
      id: `optimistic-${Date.now()}`,
      senderId: currentUserId ?? '',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch(`/api/messages/${selectedConvId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        // Refresh to get server-generated message
        await fetchMessages(selectedConvId);
        await fetchConversations();
      }
    } catch {
      // keep optimistic msg visible
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const filteredConvs = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-[#FFF4D6] text-black flex overflow-hidden">
      {/* ── Left Panel ────────────────────────────────────────────────────── */}
      <div className="w-80 flex-shrink-0 border-r border-[#111111] flex flex-col bg-[#FFF4D6]">
        {/* Header */}
        <div className="px-4 pt-6 pb-4 border-b border-[#111111]">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-lg font-bold text-black">Messages</h1>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#E63946] text-[#FFF4D6] text-xs font-bold">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </div>
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444]"
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full pl-9 pr-4 py-2 bg-[#FFFFFF] border border-[#111111] rounded-lg text-sm text-black placeholder-[#444444] focus:outline-none focus:border-[#E63946] transition-colors"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {convsLoading ? (
            <div className="space-y-px pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FFFFFF] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#FFFFFF] rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-[#FFFFFF] rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : convsError ? (
            <div className="p-4 text-center">
              <p className="text-[#D00000] text-sm">{convsError}</p>
            </div>
          ) : filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#444444" strokeWidth={1.5} className="mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-[#444444] text-sm">
                {search ? 'No conversations match your search.' : 'No conversations yet.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#111111]/50">
              {filteredConvs.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  selected={conv.id === selectedConvId}
                  onClick={() => selectConversation(conv.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selectedConvId || !selectedConv ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-[#FFFFFF] border border-[#111111] flex items-center justify-center mb-5">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#444444" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-black font-semibold text-xl mb-2">Select a conversation</h2>
            <p className="text-[#444444] text-sm max-w-xs">
              Choose a conversation from the left panel to start messaging.
            </p>
          </div>
        ) : (
          <>
            {/* Top Bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#111111] bg-[#FFF4D6]">
              <Avatar name={selectedConv.participantName} size="md" online={true} />
              <div>
                <p className="text-black font-semibold text-sm">{selectedConv.participantName}</p>
                <p className="text-xs text-[#1B9E5A] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B9E5A] inline-block" />
                  Online
                </p>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {msgsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="h-10 rounded-2xl animate-pulse bg-[#FFFFFF]"
                        style={{ width: `${120 + Math.random() * 140}px` }}
                      />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-[#444444] text-sm">No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      isSent={msg.senderId === currentUserId}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-[#111111] bg-[#FFF4D6]">
              <div className="flex items-center gap-3 bg-[#FFFFFF] border border-[#111111] rounded-xl px-4 py-2.5 focus-within:border-[#E63946] transition-colors">
                <input
                  ref={inputRef}
                  value={sendText}
                  onChange={(e) => setSendText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  className="flex-1 bg-transparent text-black text-sm placeholder-[#444444] focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!sendText.trim() || sending}
                  className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#E63946] text-[#FFF4D6] flex items-center justify-center hover:bg-[#00bce0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-[#FFF4D6]/30 border-t-[#FFF4D6] rounded-full animate-spin" />
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-[#444444]/60 mt-1.5 text-center">
                Press Enter to send · Refreshes every 5s
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
