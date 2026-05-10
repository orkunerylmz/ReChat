"use client";

import { useMemo, useRef, useEffect } from "react";
import { formatDateLabel } from "../lib/chatParser";
import { SENDER_COLORS } from "./Sidebar";

export default function ChatView({
  messages,
  participants,
  nameMap,
  searchQuery,
  chatRef,
  mainUser,
  theme,
  setTheme,
  onOpenSidebar,
  customTitle,
}) {
  const scrollRef = useRef(null);

  // Determine display name helper
  const getDisplayName = (sender) => {
    if (nameMap[sender] && nameMap[sender].trim() !== "") {
      return nameMap[sender];
    }
    return sender;
  };

  const mappedMainSender = getDisplayName(mainUser || participants[0]);

  // Determine unique participants based on mapped names
  const uniqueMappedParticipants = useMemo(() => {
    const set = new Set();
    participants.forEach((p) => set.add(getDisplayName(p)));
    return Array.from(set);
  }, [participants, nameMap]);

  // Color map
  const colorMap = useMemo(() => {
    const map = {};
    uniqueMappedParticipants.forEach((p, i) => {
      map[p] = SENDER_COLORS[i % SENDER_COLORS.length];
    });
    return map;
  }, [uniqueMappedParticipants]);

  // Filter messages if search query exists
  const filteredMessages = useMemo(() => {
    let result = messages;

    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => {
        return m.text.toLowerCase().includes(q);
      });
    }
    return result;
  }, [messages, searchQuery, nameMap]);

  // Group messages by date and anonymize text
  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDate = null;

    filteredMessages.forEach((msg, idx) => {
      const mappedSender = getDisplayName(msg.sender);

      // Replace original names in the message text with the new names for privacy
      let anonymizedText = msg.text;
      participants.forEach((p) => {
        if (nameMap[p] && nameMap[p] !== p && nameMap[p].trim() !== "") {
          anonymizedText = anonymizedText.split(p).join(nameMap[p]);
        }
      });

      if (msg.date !== currentDate) {
        currentDate = msg.date;
        groups.push({ type: "date", date: msg.date, id: `date-${msg.date}-${idx}` });
      }
      groups.push({
        type: "message",
        ...msg,
        text: anonymizedText,
        mappedSender,
        originalIdx: idx
      });
    });

    return groups;
  }, [filteredMessages, nameMap, participants]);

  // Highlight search term helper
  const highlightText = (text, query) => {
    if (!query || !query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="search-highlight">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Auto-scroll to bottom on initial load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // Chat header info
  const defaultTitle = uniqueMappedParticipants.join(", ");
  const chatTitleText = customTitle && customTitle.trim() !== "" ? customTitle : defaultTitle;

  return (
    <div className="chat-area">
      {/* Chat Header */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          {/* Mobile hamburger menu */}
          <button
            className="mobile-menu-btn"
            onClick={onOpenSidebar}
            aria-label="Menüyü Aç"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>

          <div className="chat-header-info">
            <div className="chat-header-name">{chatTitleText}</div>
            <div className="chat-header-status">
              {filteredMessages.filter((m) => !m.isSystem).length} mesaj
              {searchQuery ? " (filtrelenmiş)" : ""}
            </div>
          </div>
        </div>
        
        {/* Theme Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          )}
        </button>

      </div>

      {/* Messages */}
      <div className="chat-messages" ref={scrollRef}>
        <div className="chat-messages-inner" ref={chatRef}>
          {groupedMessages.map((item, idx) => {
            if (item.type === "date") {
              return (
                <div key={item.id} className="date-separator">
                  <span className="date-separator-badge">
                    {formatDateLabel(item.date)}
                  </span>
                </div>
              );
            }

            // Determine side (outgoing or incoming) based on MAPPED sender
            const isOutgoing = item.mappedSender === mappedMainSender;
            const prevItem = groupedMessages[idx - 1];

            // A message starts a new bubble group if the MAPPED sender is different
            const isFirstInGroup =
              !prevItem ||
              prevItem.type === "date" ||
              prevItem.mappedSender !== item.mappedSender ||
              prevItem.isSystem !== item.isSystem;

            // System message — rendered as a bubble on the sender's side
            if (item.isSystem) {
              return (
                <div
                  key={`sys-${item.id}`}
                  className={`message-row ${isOutgoing ? "outgoing" : "incoming"} ${isFirstInGroup ? "first-in-group" : ""}`}
                  style={{ animationDelay: `${Math.min(idx * 0.01, 0.5)}s` }}
                >
                  <div className="message-bubble system-bubble">
                    {isFirstInGroup && !isOutgoing && (
                      <span
                        className="message-sender"
                        style={{ color: colorMap[item.mappedSender] }}
                      >
                        {item.mappedSender}
                      </span>
                    )}
                    <span className="message-text system-text">
                      {highlightText(item.text, searchQuery)}
                    </span>
                    <div className="message-meta">
                      <span className="message-time">
                        {item.time.slice(0, 5)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            // Skip empty messages
            if (!item.text.trim()) return null;

            return (
              <div
                key={`msg-${item.id}`}
                className={`message-row ${isOutgoing ? "outgoing" : "incoming"} ${isFirstInGroup ? "first-in-group" : ""}`}
                style={{ animationDelay: `${Math.min(idx * 0.01, 0.5)}s` }}
              >
                <div className="message-bubble">
                  {isFirstInGroup && !isOutgoing && (
                    <span
                      className="message-sender"
                      style={{ color: colorMap[item.mappedSender] }}
                    >
                      {item.mappedSender}
                    </span>
                  )}
                  {isFirstInGroup && isOutgoing && uniqueMappedParticipants.length > 2 && (
                    <span
                      className="message-sender"
                      style={{ color: colorMap[item.mappedSender] }}
                    >
                      {item.mappedSender}
                    </span>
                  )}
                  <span className="message-text">{highlightText(item.text, searchQuery)}</span>
                  <div className="message-meta">
                    <span className="message-time">
                      {item.time.slice(0, 5)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
