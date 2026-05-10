"use client";

import { useState, useEffect } from "react";

export default function BottomNavbar({
  onReset,
  theme,
  setTheme,
  searchQuery,
  onSearchChange,
  onExportPDF,
  onFileLoaded,
  pdfLoading,
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Home icon
  const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  // Search icon
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  // Download icon
  const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );

  // Plus icon
  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        {/* Left: Home */}
        <div className="bottom-nav-left">
          <button 
            className="nav-btn" 
            onClick={onReset} 
            title="Ana Sayfa"
            aria-label="Ana Sayfa"
          >
            <HomeIcon />
          </button>
        </div>

        {/* Center: Search */}
        <div className="bottom-nav-center">
          <div className="bottom-search-wrapper">
            <div className="bottom-search-icon">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Mesajlarda ara..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bottom-search-input"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="bottom-nav-right">
          <button 
            className="nav-btn" 
            onClick={onExportPDF}
            disabled={pdfLoading}
            title="PDF Olarak İndir"
            aria-label="Dışa Aktar"
          >
            <DownloadIcon />
          </button>
          
          <label 
            className="nav-btn" 
            htmlFor="bottom-file-upload"
            title="Yeni Dosya Yükle"
            style={{ cursor: 'pointer' }}
          >
            <PlusIcon />
          </label>
          <input
            type="file"
            accept=".txt"
            id="bottom-file-upload"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file || !file.name.endsWith(".txt")) return;
              const text = await file.text();
              if (onFileLoaded) {
                onFileLoaded(text, file.name);
              }
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </nav>
  );
}
