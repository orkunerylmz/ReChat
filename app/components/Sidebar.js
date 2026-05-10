"use client";

import { useMemo, useState } from "react";
import { getChatStats } from "../lib/chatParser";

const SENDER_COLORS = [
  "var(--sender-color-1)",
  "var(--sender-color-2)",
  "var(--sender-color-3)",
  "var(--sender-color-4)",
  "var(--sender-color-5)",
  "var(--sender-color-6)",
  "var(--sender-color-7)",
  "var(--sender-color-8)",
];

export default function Sidebar({
  messages,
  participants,
  nameMap,
  onNameChange,
  onExportPDF,
  onReset,
  onFileLoaded,
  pdfLoading,
  fileName,
  searchQuery,
  onSearchChange,
  mainUser,
  setMainUser,
  theme,
  setTheme,
  isOpen,
  setIsOpen,
  customTitle,
  setCustomTitle,
}) {
  const colorMap = useMemo(() => {
    const map = {};
    participants.forEach((p, i) => {
      map[p] = SENDER_COLORS[i % SENDER_COLORS.length];
    });
    return map;
  }, [participants]);

  const stats = useMemo(() => getChatStats(messages), [messages]);

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="sidebar-logo">ReChat</div>
            <button
              className="sidebar-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Kapat"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="sidebar-meta">
            {fileName} · {stats.totalMessages} mesaj
          </div>
        </div>


        {/* Chat Title Editor */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Sohbet Başlığı</h3>
          <input
            className="name-editor-input"
            style={{ width: "100%" }}
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Sohbet başlığı girin..."
            id="chat-title-input"
          />
        </div>

        {/* Main User Selector */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Sohbet Sahibi (Sen)</h3>
          <select
            className="name-editor-input"
            style={{ width: "100%", cursor: "pointer" }}
            value={mainUser || ""}
            onChange={(e) => setMainUser(e.target.value)}
          >
            <option value="" disabled>Sen kimsin?</option>
            {participants.map((p) => (
              <option key={`main-${p}`} value={p}>
                {nameMap[p] || p}
              </option>
            ))}
          </select>
        </div>

        {/* Name Editor */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Kişi İsimleri</h3>
          <div className="name-editor-list">
            {participants.map((p) => (
              <div key={p} className="name-editor-item">
                <span
                  className="name-color-dot"
                  style={{ background: colorMap[p] }}
                />
                <input
                  className="name-editor-input"
                  value={nameMap[p] || p}
                  onChange={(e) => onNameChange(p, e.target.value)}
                  title={`Orijinal: ${p}`}
                  id={`name-input-${p.replace(/\s/g, "-")}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Participants List */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Sohbetteki Kişiler</h3>
          <div className="name-editor-list">
            {participants.map((p) => (
              <div key={`info-${p}`} className="name-editor-item" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                <span
                  className="name-color-dot"
                  style={{ background: colorMap[p] }}
                />
                {nameMap[p] || p}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">İstatistikler</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalMessages}</div>
              <div className="stat-label">Mesaj</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalDays}</div>
              <div className="stat-label">Gün</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.systemMessages}</div>
              <div className="stat-label">Medya</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{participants.length}</div>
              <div className="stat-label">Kişi</div>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}

export { SENDER_COLORS };
