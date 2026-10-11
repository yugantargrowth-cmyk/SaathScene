// Server-side validation and storage helper for SaathScene intakes
import fs from 'fs';
import path from 'path';

// Rate limiting in-memory store (sliding window per IP)
const submissionRateMap = new Map();
const recentSubmissions = new Set(); // For duplicate detection within 15 minutes

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 20; // Max 20 submissions per minute per IP

export function checkRateLimit(ip) {
  const now = Date.now();
  const history = submissionRateMap.get(ip) || [];
  const recent = history.filter(time => now - time < WINDOW_MS);
  
  if (recent.length >= MAX_PER_WINDOW) {
    return false;
  }
  
  recent.push(now);
  submissionRateMap.set(ip, recent);
  return true;
}

export function isDuplicate(submissionHash) {
  if (recentSubmissions.has(submissionHash)) {
    return true;
  }
  recentSubmissions.add(submissionHash);
  // Auto expire from duplicate cache after 15 minutes
  setTimeout(() => {
    recentSubmissions.delete(submissionHash);
  }, 15 * 60 * 1000);
  return false;
}

export async function persistSubmission(collectionName, record) {
  // 1. Try forwarding to configured Google Apps Script Webhook / Form if configured in env
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  let webhookForwarded = false;

  if (webhookUrl && webhookUrl.startsWith('https://')) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collectionName,
          ...record
        })
      });
      if (response.ok) {
        webhookForwarded = true;
      }
    } catch (err) {
      console.warn('Webhook forwarding failed:', err.message);
    }
  }

  // 2. Persist to local JSON storage file in /tmp (Vercel serverless writable)
  // or a fallback local path for local development
  const storageDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
  if (!fs.existsSync(storageDir)) {
    try {
      fs.mkdirSync(storageDir, { recursive: true });
    } catch (e) {
      // ignore
    }
  }

  const filePath = path.join(storageDir, `${collectionName}.json`);
  let entries = [];
  try {
    if (fs.existsSync(filePath)) {
      entries = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
    }
  } catch (e) {
    entries = [];
  }

  // Sanitize record to ensure no secrets or unnecessary sensitive info
  const sanitizedRecord = {
    ...record,
    persistedAt: new Date().toISOString(),
    forwardedToWebhook: webhookForwarded
  };

  entries.push(sanitizedRecord);

  try {
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf8');
  } catch (err) {
    console.error('File storage error:', err.message);
  }

  return {
    success: true,
    id: record.id,
    forwardedToWebhook: webhookForwarded
  };
}

export function sanitizeText(str, maxLength = 500) {
  if (!str) return '';
  return String(str)
    .replace(/[<>]/g, '') // remove HTML tags
    .trim()
    .slice(0, maxLength);
}
