// Vercel Serverless Function: Companion Application Intake (18+)
import { checkRateLimit, isDuplicate, persistSubmission, sanitizeText } from './_helper.js';

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  // Rate Limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ 
      success: false, 
      error: 'Too many requests. Please wait a moment before submitting again.' 
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, contact, area, availability, comfortActivities, about, isAdult } = body || {};

    // 1. Server-side 18+ check
    if (isAdult !== true && isAdult !== 'true') {
      return res.status(400).json({
        success: false,
        error: 'Confirmation of age 18+ is strictly required to apply as a social companion.'
      });
    }

    // 2. Required fields validation
    const cleanName = sanitizeText(name, 100);
    const cleanContact = sanitizeText(contact, 100);
    const cleanArea = sanitizeText(area, 100);
    const cleanAbout = sanitizeText(about, 600);
    const cleanAvailability = sanitizeText(availability, 100);

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ success: false, error: 'Please provide a valid name (at least 2 characters).' });
    }

    if (!cleanContact || cleanContact.length < 6) {
      return res.status(400).json({ success: false, error: 'Please provide a valid contact phone/WhatsApp.' });
    }

    if (!cleanArea) {
      return res.status(400).json({ success: false, error: 'Please specify your area in Ahmedabad.' });
    }

    if (!cleanAbout || cleanAbout.length < 10) {
      return res.status(400).json({ success: false, error: 'Please provide a brief introduction about yourself (at least 10 characters).' });
    }

    // Process comfort activities array
    const cleanActivities = Array.isArray(comfortActivities)
      ? comfortActivities.map(a => sanitizeText(a, 50)).filter(Boolean)
      : [];

    // 3. Duplicate Prevention (Hash name + contact)
    const duplicateKey = `COMP:${cleanName.toLowerCase()}:${cleanContact.toLowerCase()}`;
    if (isDuplicate(duplicateKey)) {
      return res.status(409).json({
        success: false,
        error: 'A companion application with this contact information has already been submitted recently.'
      });
    }

    // 4. Create intake record
    const applicationId = 'COMP-' + Date.now().toString(36).toUpperCase();
    const companionRecord = {
      id: applicationId,
      name: cleanName,
      contact: cleanContact,
      area: cleanArea,
      availability: cleanAvailability || 'Flexible',
      comfortActivities: cleanActivities,
      about: cleanAbout,
      isAdult: true,
      timestamp: new Date().toISOString()
    };

    // 5. Persist securely
    const result = await persistSubmission('companion_applications', companionRecord);

    return res.status(200).json({
      success: true,
      id: applicationId,
      message: 'Your companion application has been successfully received for coordinator review.',
      application: {
        id: applicationId,
        name: cleanName,
        area: cleanArea,
        availability: companionRecord.availability,
        comfortActivities: cleanActivities,
        contact: cleanContact
      }
    });

  } catch (err) {
    console.error('Companion application intake error:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal error occurred while recording your application. Please try again or reach out directly.'
    });
  }
}
