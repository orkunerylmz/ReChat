"use client";

import { useCallback, useState } from "react";

export default function UploadScreen({ onFileLoaded }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="split-landing">
      <div className="landing-bg-effect"></div>

      <div className="split-container">
        {/* Left Side: Info */}
        <div className="split-left">
          <div className="landing-logo mb-6">ReChat</div>

          <h1 className="hero-title-compact">
            Sohbetlerinize <br />
            <span className="text-gradient">Hayat Verin</span>
          </h1>

          <p className="hero-desc-compact">
            WhatsApp <b>.txt</b> dosyalarınızı saniyeler içinde etkileşimli, düzenlenebilir
            ve harika görünümlü PDF raporlarına dönüştürün.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div className="feature-text">Maksimum Gizlilik ve Yerel Veri İşleme</div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
              </div>
              <div className="feature-text">Kapsamlı Kişiselleştirme Seçenekleri</div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div className="feature-text">Tek Tıkla Profesyonel PDF Raporlama</div>
            </div>
          </div>

          <div className="how-to-compact">
            <h3>Nasıl Kullanılır?</h3>
            <ol>
              <li>WhatsApp'ta sohbete girin.</li>
              <li><b>Seçenekler &gt; Dışa Aktar (Medyasız)</b> seçin.</li>
              <li>Oluşan .txt dosyasını yükleyin.</li>
            </ol>
          </div>
        </div>

        {/* Right Side: Upload */}
        <div className="split-right">
          <label
            className={`compact-upload-zone ${dragging ? "dragging" : ""}`}
            htmlFor="file-input-desktop"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="compact-upload-inner">
              <span className="upload-icon-pulse">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <h2 className="upload-main-text">Sohbeti Yükle (.txt)</h2>
              <p className="upload-sub-text">Sürükle bırak veya seçmek için tıkla</p>
            </div>
            <input
              type="file"
              accept=".txt"
              className="upload-input"
              onChange={handleInputChange}
              id="file-input-desktop"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
