"use client";

import { useCallback, useRef, useState } from "react";

export default function UploadScreen({ onFileLoaded }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      if (!file || !file.name.endsWith(".txt")) return;
      setLoading(true);
      const text = await file.text();
      onFileLoaded(text, file.name);
    },
    [onFileLoaded]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer?.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <div className="loading-text">Sohbet yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="upload-screen">
      <h1 className="upload-logo">ReChat</h1>
      <p className="upload-subtitle">
        WhatsApp sohbetlerini görüntüle ve PDF olarak indir
      </p>

      <label
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        htmlFor="file-input"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        id="upload-zone"
      >
        <span className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
        </span>
        <p className="upload-text">
          WhatsApp sohbet dosyanızı sürükleyip bırakın
        </p>
        <p className="upload-hint">veya tıklayarak .txt dosyası seçin</p>
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          className="upload-input"
          onChange={handleInputChange}
          id="file-input"
        />
      </label>
    </div>
  );
}
