import "./globals.css";

export const metadata = {
  title: "ReChat — WhatsApp Sohbet Görüntüleyici",
  description:
    "WhatsApp sohbet dosyalarını premium bir arayüzle görüntüleyin, kişi isimlerini düzenleyin ve PDF olarak indirin.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
