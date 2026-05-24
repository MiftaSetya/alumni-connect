export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  
  // Handling YYYY-MM-DD
  const ymdMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    return `${ymdMatch[3]}-${ymdMatch[2]}-${ymdMatch[1]}`;
  }
  
  // Handling ISO strings or Date parseable strings
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
  } catch (e) {
    // Ignore and return original
  }
  
  return dateStr;
};

export const formatTime = (timeStr: string): string => {
  if (!timeStr) return "";

  // Handling 12-hour format like "10:00 AM", "2:00 PM", "6:00 PM EST", "6:00PM WIB"
  const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match12) {
    let hours = parseInt(match12[1]);
    const minutes = match12[2];
    const ampm = match12[3].toUpperCase();

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    // Always strip timezone suffix (EST, WIB, UTC, etc.)
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  // Handling already 24-hour format with optional timezone suffix e.g. "18:00 WIB", "18:30 EST"
  const match24tz = timeStr.match(/^(\d{1,2}):(\d{2})(?:\s+[A-Z]{2,4})?$/);
  if (match24tz) {
    const hours = String(parseInt(match24tz[1])).padStart(2, "0");
    return `${hours}:${match24tz[2]}`;
  }

  return timeStr;
};
