export interface HealthResponse {
  status: string;
  service: string;
  version?: string;
  fridge_id?: string;
  fridge_location?: {
    lat: number;
    lon: number;
  };
}

export interface Donor {
  id: string;
  name: string;
  phone: string;
  lat: number;
  lon: number;
  distance_km?: number;
  distance_miles?: number;
}

export interface ExtractedData {
  raw_text: string;
  items: string[];
  freshness_signal: string;
  fill_level: string;
  fill_level_pct?: number;
}

export interface CheckinExecutionResult {
  id: string;
  incoming_text: string;
  sender?: string;
  status: 'risk' | 'critically_empty' | 'all_fine';
  assessment_reasoning: string;
  extracted_data: ExtractedData;
  action_taken: string;
  notified_donor?: string | null;
  sms_sid?: string | null;
  timestamp: string;
  source: 'simulator' | 'webhook';
  execution_time_ms?: number;
}

export interface StatsResponse {
  total_checkins: number;
  risk_count: number;
  critically_empty_count: number;
  all_fine_count: number;
  current_fill_pct: number;
  fridge_status: 'all_fine' | 'risk' | 'critically_empty';
  active_donors_count: number;
  last_checkin_time?: string;
}

export interface ShelfLifeRule {
  category: string;
  days_at_room_temp?: number;
  days_refrigerated?: number;
  days_frozen?: number;
  guidance?: string;
  tips?: string;
}

export interface ShelfLifeData {
  items: Record<string, any>;
  aliases: Record<string, string>;
}

const API_BASE = '';

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/api/stats`);
  if (!res.ok) throw new Error(`Fetch stats failed: ${res.statusText}`);
  return res.json();
}

export async function fetchDonors(): Promise<Donor[]> {
  const res = await fetch(`${API_BASE}/api/donors`);
  if (!res.ok) throw new Error(`Fetch donors failed: ${res.statusText}`);
  return res.json();
}

export async function createDonor(donor: Omit<Donor, 'id' | 'distance_km' | 'distance_miles'>): Promise<Donor> {
  const res = await fetch(`${API_BASE}/api/donors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donor),
  });
  if (!res.ok) throw new Error(`Add donor failed: ${res.statusText}`);
  return res.json();
}

export async function fetchShelfLife(): Promise<ShelfLifeData> {
  const res = await fetch(`${API_BASE}/api/shelflife`);
  if (!res.ok) throw new Error(`Fetch shelf-life failed: ${res.statusText}`);
  return res.json();
}

export async function lookupShelfLifeItem(item: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/shelflife/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item }),
  });
  if (!res.ok) throw new Error(`Lookup failed: ${res.statusText}`);
  return res.json();
}

export async function fetchHistory(): Promise<CheckinExecutionResult[]> {
  const res = await fetch(`${API_BASE}/api/history`);
  if (!res.ok) throw new Error(`Fetch history failed: ${res.statusText}`);
  return res.json();
}

export async function clearHistory(): Promise<{ cleared: boolean }> {
  const res = await fetch(`${API_BASE}/api/history`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Clear history failed: ${res.statusText}`);
  return res.json();
}

export async function submitCheckin(text: string, sender?: string): Promise<CheckinExecutionResult> {
  const res = await fetch(`${API_BASE}/api/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sender: sender || '+15551234567' }),
  });
  if (!res.ok) throw new Error(`Checkin submission failed: ${res.statusText}`);
  return res.json();
}

export async function submitWebhookSms(body: string, from: string): Promise<string> {
  const formData = new URLSearchParams();
  formData.append('Body', body);
  formData.append('From', from);

  const res = await fetch(`${API_BASE}/webhook/sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });
  if (!res.ok) throw new Error(`Webhook SMS failed: ${res.statusText}`);
  return res.text();
}
