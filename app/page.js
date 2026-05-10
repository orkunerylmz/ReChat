"use client";

import { useCallback, useRef, useState } from "react";
import { parseChat } from "./lib/chatParser";
import { exportToPDF } from "./lib/pdfExport";
import UploadScreen from "./components/UploadScreen";
import Sidebar from "./components/Sidebar";
import ChatView from "./components/ChatView";

// Helper function to capitalize each word of a name properly (handling Turkish characters)
const capitalizeWords = (str) => {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1).toLocaleLowerCase("tr-TR");
    })
    .join(" ");
};

export default function Home() {
  const [chatData, setChatData] = useState(null);
  const [nameMap, setNameMap] = useState({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mainUser, setMainUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chatRef = useRef(null);

  // Handle file load
  const handleFileLoaded = useCallback((text, name) => {
    const parsed = parseChat(text);
    setChatData(parsed);
    setFileName(name);

    // Initialize name map with capitalized original names
    const initialNameMap = {};
    parsed.participants.forEach((p) => {
      initialNameMap[p] = capitalizeWords(p);
    });
    setNameMap(initialNameMap);
    setMainUser(parsed.participants[0] || null);
    setSearchQuery("");
  }, []);

  // Handle name change with auto-capitalization
  const handleNameChange = useCallback((originalName, newName) => {
    setNameMap((prev) => ({
      ...prev,
      [originalName]: capitalizeWords(newName),
    }));
  }, []);

  // Handle PDF export
  const handleExportPDF = useCallback(async () => {
    if (!chatRef.current) return;
    setPdfLoading(true);
    setPdfProgress(0);

    try {
      await exportToPDF(chatRef.current, (progress) => {
        setPdfProgress(progress);
      });
    } catch (err) {
      console.error("PDF oluşturma hatası:", err);
      alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setPdfLoading(false);
      setPdfProgress(0);
    }
  }, []);

  // Reset / load new file
  const handleReset = useCallback(() => {
    setChatData(null);
    setNameMap({});
    setFileName("");
    setSearchQuery("");
    setMainUser(null);
  }, []);

  // Upload screen
  if (!chatData) {
    return <UploadScreen onFileLoaded={handleFileLoaded} />;
  }

  // Main chat view
  return (
    <>
      <div className="app-container" data-theme={theme}>
        <Sidebar
          messages={chatData.messages}
          participants={chatData.participants}
          nameMap={nameMap}
          onNameChange={handleNameChange}
          onExportPDF={handleExportPDF}
          onReset={handleReset}
          pdfLoading={pdfLoading}
          fileName={fileName}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          mainUser={mainUser}
          setMainUser={setMainUser}
          theme={theme}
          setTheme={setTheme}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <ChatView
          messages={chatData.messages}
          participants={chatData.participants}
          nameMap={nameMap}
          searchQuery={searchQuery}
          chatRef={chatRef}
          mainUser={mainUser}
          theme={theme}
          setTheme={setTheme}
          onOpenSidebar={() => setSidebarOpen(prev => !prev)}
        />
      </div>

      {/* PDF Progress Overlay */}
      {pdfLoading && (
        <div className="pdf-overlay">
          <div className="pdf-progress-card">
            <div className="pdf-progress-title">PDF Oluşturuluyor</div>
            <div className="pdf-progress-bar-container">
              <div
                className="pdf-progress-bar"
                style={{ width: `${pdfProgress}%` }}
              />
            </div>
            <div className="pdf-progress-text">%{pdfProgress} tamamlandı</div>
          </div>
        </div>
      )}
    </>
  );
}
