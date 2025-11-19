const API_BASE = "http://localhost:5000";

export const fetchMessages = async () => {
  console.log("[DEBUG] Fetching messages from API");
  const response = await fetch(`${API_BASE}/messages`);
  console.log(`[DEBUG] API response status: ${response.status}`);
  if (!response.ok) throw new Error("Failed to fetch messages");
  const data = await response.json();
  console.log(`[DEBUG] Fetched ${data.length} messages from API`);
  return data;
};