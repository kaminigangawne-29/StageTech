'use client';

import React, { useEffect, useRef } from 'react';
import { MessageData } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────
interface MessageThreadProps {
  messages: MessageData[];
  currentUserId: string;
  otherUser: {
    id: string;
    name: string;
    image?: string | null;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return `Yesterday ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    return d.toLocaleDateString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  } else {
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

function shouldShowDateDivider(
  current: MessageData,
  previous?: MessageData
): boolean {
  if (!previous) return true;
  const curr = new Date(current.createdAt);
  const prev = new Date(previous.createdAt);
  return (
    curr.getFullYear() !== prev.getFullYear() ||
    curr.getMonth() !== prev.getMonth() ||
    curr.getDate() !== prev.getDate()
  );
}

function formatDateDivider(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string | null;
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-xs font-semibold text-black flex-shrink-0 border border-white/10">
      {initials}
    </div>
  );
}

// ─── Date Divider ─────────────────────────────────────────────────────────────
function DateDivider({ date }: { date: Date | string }) {
  return (
    <div className="flex items-center gap-3 my-4 px-2">
      <div className="flex-1 h-px bg-[#111111]" />
      <span className="text-xs text-gray-500 font-medium px-2 flex-shrink-0">
        {formatDateDivider(date)}
      </span>
      <div className="flex-1 h-px bg-[#111111]" />
    </div>
  );
}

// ─── Individual Bubble ────────────────────────────────────────────────────────
function MessageBubble({
  message,
  isSent,
  showAvatar,
  otherUser,
}: {
  message: MessageData;
  isSent: boolean;
  showAvatar: boolean;
  otherUser: MessageThreadProps['otherUser'];
}) {
  const isRead = message.readAt !== null;

  return (
    <div className={`flex items-end gap-2 group ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar for received messages */}
      {!isSent && (
        <div className={`mb-0.5 flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
          <Avatar name={otherUser.name} imageUrl={otherUser.image} />
        </div>
      )}

      {/* Bubble + timestamp */}
      <div
        className={`flex flex-col gap-1 max-w-[70%] sm:max-w-[60%] ${isSent ? 'items-end' : 'items-start'}`}
      >
        <div
          className={`
            relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words
            ${isSent
              ? 'bg-red-600 text-black rounded-br-md shadow-[0_2px_12px_rgba(230,57,70,0.2)]'
              : 'bg-[#111111] text-gray-100 rounded-bl-md border border-white/5'
            }
          `}
        >
          {message.content}
        </div>

        {/* Timestamp + read status */}
        <div className={`flex items-center gap-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isSent ? 'flex-row-reverse' : ''}`}>
          <span className="text-[11px] text-gray-500">
            {formatTime(message.createdAt)}
          </span>
          {isSent && (
            <span title={isRead ? 'Read' : 'Delivered'}>
              {isRead ? (
                /* Double check (read) */
                <svg className="w-3.5 h-3.5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.41 13.41L6 19l1.41-1.42L1.83 12zm20.17-7.17l-8.5 8.5-3.08-3.08L7.59 13l4.41 4 9.91-9.91zM15.59 7L14 5.41 7.41 12l1.42 1.41z"/>
                </svg>
              ) : (
                /* Single check (delivered) */
                <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MessageThread({
  messages,
  currentUserId,
  otherUser,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#111111] flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <p className="text-black font-medium text-sm">Start the conversation</p>
          <p className="text-gray-500 text-xs mt-1">
            Send a message to {otherUser.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-4 px-4 overflow-y-auto h-full scroll-smooth">
      {messages.map((msg, index) => {
        const isSent = msg.senderId === currentUserId;
        const prevMsg = messages[index - 1];
        const nextMsg = messages[index + 1];

        // Show avatar only for the last consecutive received message from same sender
        const showAvatar =
          !isSent &&
          (!nextMsg || nextMsg.senderId !== msg.senderId);

        const showDivider = shouldShowDateDivider(msg, prevMsg);

        return (
          <React.Fragment key={msg.id}>
            {showDivider && <DateDivider date={msg.createdAt} />}
            <div className={`${isSent ? 'mb-1' : 'mb-1'}`}>
              <MessageBubble
                message={msg}
                isSent={isSent}
                showAvatar={showAvatar}
                otherUser={otherUser}
              />
            </div>
          </React.Fragment>
        );
      })}
      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
