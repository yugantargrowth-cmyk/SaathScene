// SaathScene Ahmedabad — Central Configuration
export const CONFIG = {
  BRAND_NAME: 'SaathScene',
  TAGLINE: 'Your next social scene starts here',
  SERVICE_SCOPE: 'Ahmedabad-first non-sexual social companionship for adults 18+',
  LOCATION: 'Ahmedabad, Gujarat',
  
  // Business WhatsApp Configuration
  // Note: Phone number +919023119260 is central to our links, but is NOT yet registered on WhatsApp.
  // We clearly present direct fallback contact options (email/Instagram) alongside wa.me links.
  WHATSAPP_NUMBER: '919023119260',
  WHATSAPP_DISPLAY: '+91 90231 19260',
  WHATSAPP_STATUS: 'Pending WhatsApp Registration (Non-WhatsApp fallbacks available below)',
  
  INSTAGRAM_HANDLE: '@saathscene.ahmedabad',
  INSTAGRAM_URL: 'https://instagram.com/saathscene.ahmedabad',
  CONTACT_EMAIL: 'hello@saathscene.in',

  // Real Backend API Endpoints (Vercel Serverless Functions)
  API_CUSTOMER_ENQUIRY: '/api/customer-enquiry',
  API_COMPANION_APPLY: '/api/companion-apply',

  // Local storage keys for offline resilience
  STORAGE_KEY_CUSTOMER: 'saathscene_customer_enquiries',
  STORAGE_KEY_COMPANION: 'saathscene_companion_applications'
};
