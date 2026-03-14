export function groupMessages(messages: any[]) {
  const groups: any[] = [];
  let lastDate = "";

  messages.forEach((msg) => {
    const date = new Date(msg.sentAt);
    const day = date.toISOString().split("T")[0]; // YYYY-MM-DD

    if (day !== lastDate) {
      groups.push({
        type: "date",
        date: date,
      });
      lastDate = day;
    }

    groups.push({
      type: "msg",
      msg,
    });
  });

  return groups;
}

export function formatDateHeader(date: Date | string) {
  const d = new Date(date);
  const now = new Date();

  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Hôm nay";
  if (isYesterday) return "Hôm qua";

  const dd = d.getDate().toString().padStart(2, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function formatChatTime(sentAt: string) {
  if (!sentAt) return "";

  const date = new Date(sentAt);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");

  if (isToday) {
    return `${hh}:${mm}`;
  }

  const dd = date.getDate().toString().padStart(2, "0");
  const mm2 = (date.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}/${mm2}/${yyyy} • ${hh}:${mm}`;
}
