/**
 * WhatsApp Chat Parser
 * Parses WhatsApp text export files in format:
 *   [DD.MM.YYYY HH:MM:SS] Sender: message
 * Also handles system messages (e.g. "görüntü dahil edilmedi")
 */

// Regex: matches lines like [12.02.2026 14:25:45] Sender Name: message
// Also handles the invisible BOM/LTR characters WhatsApp adds
const MESSAGE_REGEX =
  /^\u200e?\[(\d{1,2}\.\d{2}\.\d{4})\s(\d{2}:\d{2}:\d{2})\]\s(.+?):\s([\s\S]*)$/;

// System message patterns (media not included, edited messages, etc.)
const SYSTEM_PATTERNS = [
  "görüntü dahil edilmedi",
  "ses dahil edilmedi",
  "video dahil edilmedi",
  "belge dahil edilmedi",
  "Çıkartma dahil edilmedi",
  "görüntülü not çıkarıldı",
  "konum dahil edilmedi",
  "kişi kartı dahil edilmedi",
  "GIF dahil edilmedi",
  "Bu mesaj düzenlendi",
  "Bu mesaj silindi",
  "Mesajlar ve aramalar uçtan uca",
];

/**
 * Parse raw WhatsApp chat text into structured data
 * @param {string} rawText - The raw chat.txt content
 * @returns {{ messages: Array, participants: string[] }}
 */
export function parseChat(rawText) {
  const lines = rawText.split("\n");
  const messages = [];
  const participantsSet = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, "").replace(/^\u200e/, "");

    if (!line.trim()) continue;

    const match = line.match(MESSAGE_REGEX);

    if (match) {
      const [, dateStr, timeStr, sender, text] = match;
      const cleanText = text.replace(/^\u200e/, "").trim();

      // Check if it's a system/media message
      const isSystem = SYSTEM_PATTERNS.some((pattern) =>
        cleanText.includes(pattern)
      );

      if (!isSystem && cleanText.length > 0) {
        participantsSet.add(sender);
      }

      messages.push({
        id: messages.length,
        date: dateStr,
        time: timeStr,
        sender: sender,
        text: cleanText,
        isSystem,
        timestamp: parseDate(dateStr, timeStr),
      });
    }
  }

  return {
    messages,
    participants: Array.from(participantsSet),
  };
}

/**
 * Parse DD.MM.YYYY HH:MM:SS to Date
 */
function parseDate(dateStr, timeStr) {
  const [day, month, year] = dateStr.split(".");
  return new Date(`${year}-${month}-${day}T${timeStr}`);
}

/**
 * Format date for display (e.g. "12 Şubat 2026")
 */
export function formatDateLabel(dateStr) {
  const [day, month, year] = dateStr.split(".");
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} ${months[monthIdx]} ${year}`;
}

/**
 * Get chat statistics
 */
export function getChatStats(messages) {
  const totalMessages = messages.filter((m) => !m.isSystem).length;
  const systemMessages = messages.filter((m) => m.isSystem).length;

  // Unique dates
  const uniqueDates = new Set(messages.map((m) => m.date));

  // Messages per participant
  const perParticipant = {};
  messages
    .filter((m) => !m.isSystem)
    .forEach((m) => {
      perParticipant[m.sender] = (perParticipant[m.sender] || 0) + 1;
    });

  return {
    totalMessages,
    systemMessages,
    totalDays: uniqueDates.size,
    perParticipant,
  };
}
