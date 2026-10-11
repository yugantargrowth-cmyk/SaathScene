// Vercel Serverless Function: Customer Enquiry Intake
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
    const { name, contact, activity, preferredDate, location, duration, notes, isAdult } = body || {};

    // 1. Server-side 18+ check
    if (isAdult !== true && isAdult !== 'true') {
      return res.status(400).json({
        success: false,
        error: 'Confirmation of age 18+ is strictly required to submit an enquiry.'
      });
    }

    // 2. Required fields validation
    const cleanName = sanitizeText(name, 100);
    const cleanContact = sanitizeText(contact, 100);
    const cleanActivity = sanitizeText(activity, 150);

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ success: false, error: 'Please provide a valid name (at least 2 characters).' });
    }

    if (!cleanContact || cleanContact.length < 6) {
      return res.status(400).json({ success: false, error: 'Please provide a valid contact phone/WhatsApp or email.' });
    }

    if (!cleanActivity) {
      return res.status(400).json({ success: false, error: 'Please specify the planned social activity.' });
    }

    // 3. Duplicate Prevention (Hash name + contact + activity)
    const duplicateKey = `CUST:${cleanName.toLowerCase()}:${cleanContact.toLowerCase()}:${cleanActivity.toLowerCase()}`;
    if (isDuplicate(duplicateKey)) {
      return res.status(409).json({
        success: false,
        error: 'A duplicate enquiry with this information was recently received. Please do not re-submit immediately.'
      });
    }

    // 4. Create intake record
    const enquiryId = 'CUST-' + Date.now().toString(36).toUpperCase();
    const enquiryRecord = {
      id: enquiryId,
      name: cleanName,
      contact: cleanContact,
      activity: cleanActivity,
      preferredDate: sanitizeText(preferredDate, 100) || 'Flexible',
      location: sanitizeText(location, 100) || 'Ahmedabad',
      duration: sanitizeText(duration, 50) || 'Flexible',
      notes: sanitizeText(notes, 500) || '',
      isAdult: true,
      timestamp: new Date().toISOString()
    };

    // 5. Persist securely
    const result = await persistSubmission('customer_enquiries', enquiryRecord);

    return res.status(200).json({
      success: true,
      id: enquiryId,
      message: 'Your customer enquiry was received and safely registered with our coordinator queue.',
      enquiry: {
        id: enquiryId,
        name: cleanName,
        activity: cleanActivity,
        preferredDate: enquiryRecord.preferredDate,
        location: enquiryRecord.location,
        duration: enquiryRecord.duration,
        contact: cleanContact
      }
    });

  } catch (err) {
    console.error('Customer enquiry intake error:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal error occurred while recording your enquiry. Please try again or reach out directly.'
    });
  }
}
