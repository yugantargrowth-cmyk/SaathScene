// SaathScene Ahmedabad — Frontend Interactive Engine
import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFormTabs();
  initForms();
  initFaqAccordion();
  initDynamicLinks();
});

// 1. Mobile Navigation
function initNavigation() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close drawer on link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// 2. Form Tabs (Switch between Customer Enquiry and Companion 18+ Application)
function initFormTabs() {
  const tabCustomer = document.getElementById('tabCustomerBtn');
  const tabCompanion = document.getElementById('tabCompanionBtn');
  const panelCustomer = document.getElementById('customerPanel');
  const panelCompanion = document.getElementById('companionPanel');

  if (!tabCustomer || !tabCompanion) return;

  tabCustomer.addEventListener('click', () => {
    tabCustomer.classList.add('active');
    tabCompanion.classList.remove('active');
    panelCustomer.classList.add('active');
    panelCompanion.classList.remove('active');
  });

  tabCompanion.addEventListener('click', () => {
    tabCompanion.classList.add('active');
    tabCustomer.classList.remove('active');
    panelCompanion.classList.add('active');
    panelCustomer.classList.remove('active');
  });

  // Check URL hash for direct tab navigation
  if (window.location.hash === '#companion-form') {
    tabCompanion.click();
  }
}

// 3. Functional Forms with Real Serverless Backend Verification
function initForms() {
  // A. Customer Enquiry Form
  const customerForm = document.getElementById('customerEnquiryForm');
  const customerFeedback = document.getElementById('customerFeedbackCard');
  const customerSubmitBtn = customerForm ? customerForm.querySelector('button[type="submit"]') : null;
  const customerErrorBox = document.getElementById('customerErrorBox');

  if (customerForm) {
    customerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (customerErrorBox) {
        customerErrorBox.style.display = 'none';
        customerErrorBox.textContent = '';
      }

      const isAdultChecked = customerForm.customerAdultCheck.checked;
      if (!isAdultChecked) {
        showError(customerErrorBox, 'You must confirm that you are aged 18+ to submit an enquiry.');
        return;
      }

      const payload = {
        name: customerForm.customerName.value.trim(),
        contact: customerForm.customerContact.value.trim(),
        activity: customerForm.customerActivity.value,
        preferredDate: customerForm.customerDate.value.trim(),
        location: customerForm.customerLocation.value.trim(),
        duration: customerForm.customerDuration.value,
        notes: customerForm.customerNotes.value.trim(),
        isAdult: true
      };

      if (!payload.name || payload.name.length < 2) {
        showError(customerErrorBox, 'Please enter a valid name (at least 2 characters).');
        return;
      }

      if (!payload.contact || payload.contact.length < 6) {
        showError(customerErrorBox, 'Please enter a valid phone number, WhatsApp, or email address.');
        return;
      }

      if (!payload.activity) {
        showError(customerErrorBox, 'Please select your planned social activity.');
        return;
      }

      // Enter loading state
      const originalBtnText = customerSubmitBtn.innerHTML;
      customerSubmitBtn.disabled = true;
      customerSubmitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Transmitting Enquiry...
      `;

      try {
        const response = await fetch(CONFIG.API_CUSTOMER_ENQUIRY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Server rejected the submission.');
        }

        // Safe local backup only after confirmed backend persistence
        saveSubmission(CONFIG.STORAGE_KEY_CUSTOMER, { id: data.id, ...payload });

        // Render confirmed feedback
        renderCustomerFeedback({ id: data.id, ...payload });
        customerForm.style.display = 'none';
        customerFeedback.classList.add('show');

      } catch (err) {
        console.error('Customer submission error:', err);
        showError(customerErrorBox, err.message || 'Unable to submit enquiry right now. Please check your network or message us directly on WhatsApp or email.');
      } finally {
        customerSubmitBtn.disabled = false;
        customerSubmitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // B. Companion Application Form (18+)
  const companionForm = document.getElementById('companionAppForm');
  const companionFeedback = document.getElementById('companionFeedbackCard');
  const companionSubmitBtn = companionForm ? companionForm.querySelector('button[type="submit"]') : null;
  const companionErrorBox = document.getElementById('companionErrorBox');

  if (companionForm) {
    companionForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (companionErrorBox) {
        companionErrorBox.style.display = 'none';
        companionErrorBox.textContent = '';
      }

      const isAdultChecked = companionForm.companionAdultCheck.checked;
      if (!isAdultChecked) {
        showError(companionErrorBox, 'You must confirm that you are aged 18+ to apply as a companion.');
        return;
      }

      const payload = {
        name: companionForm.companionName.value.trim(),
        contact: companionForm.companionContact.value.trim(),
        area: companionForm.companionArea.value.trim(),
        comfortActivities: Array.from(companionForm.querySelectorAll('input[name="comfortActivities"]:checked')).map(cb => cb.value),
        availability: companionForm.companionAvailability.value,
        about: companionForm.companionAbout.value.trim(),
        isAdult: true
      };

      if (!payload.name || payload.name.length < 2) {
        showError(companionErrorBox, 'Please enter a valid name (at least 2 characters).');
        return;
      }

      if (!payload.contact || payload.contact.length < 6) {
        showError(companionErrorBox, 'Please enter a valid contact phone/WhatsApp.');
        return;
      }

      if (!payload.area) {
        showError(companionErrorBox, 'Please specify your area in Ahmedabad.');
        return;
      }

      if (!payload.about || payload.about.length < 10) {
        showError(companionErrorBox, 'Please provide an intro of at least 10 characters.');
        return;
      }

      // Enter loading state
      const originalBtnText = companionSubmitBtn.innerHTML;
      companionSubmitBtn.disabled = true;
      companionSubmitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Registering Application...
      `;

      try {
        const response = await fetch(CONFIG.API_COMPANION_APPLY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Server rejected the application.');
        }

        // Safe local backup only after confirmed backend persistence
        saveSubmission(CONFIG.STORAGE_KEY_COMPANION, { id: data.id, ...payload });

        // Render confirmed feedback
        renderCompanionFeedback({ id: data.id, ...payload });
        companionForm.style.display = 'none';
        companionFeedback.classList.add('show');

      } catch (err) {
        console.error('Companion submission error:', err);
        showError(companionErrorBox, err.message || 'Unable to submit application right now. Please check your network or contact our coordinator directly.');
      } finally {
        companionSubmitBtn.disabled = false;
        companionSubmitBtn.innerHTML = originalBtnText;
      }
    });
  }
}

function showError(container, message) {
  if (container) {
    container.textContent = message;
    container.style.display = 'block';
  } else {
    alert(message);
  }
}

function saveSubmission(key, data) {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

function renderCustomerFeedback(data) {
  const detailsBox = document.getElementById('customerFeedbackDetails');
  const whatsappBtn = document.getElementById('customerWhatsAppBtn');

  if (detailsBox) {
    detailsBox.innerHTML = `
      <h4>Confirmed Intake Details (Ref: ${escapeHtml(data.id)})</h4>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(data.name)}</li>
        <li><strong>Activity:</strong> ${escapeHtml(data.activity)}</li>
        <li><strong>Date / Time:</strong> ${escapeHtml(data.preferredDate || 'Flexible')}</li>
        <li><strong>Area / Public Venue:</strong> ${escapeHtml(data.location || 'Ahmedabad')}</li>
        <li><strong>Duration:</strong> ${escapeHtml(data.duration || 'Flexible')}</li>
        <li><strong>Contact:</strong> ${escapeHtml(data.contact)}</li>
      </ul>
      <p style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--color-slate);">
        Status: Securely registered in coordinator intake queue. A coordinator will review and contact you via your preferred channel.
      </p>
    `;
  }

  if (whatsappBtn) {
    const waText = encodeURIComponent(
      `Hello SaathScene! I just registered customer enquiry [${data.id}]:\n` +
      `• Name: ${data.name}\n` +
      `• Activity: ${data.activity}\n` +
      `• Date: ${data.preferredDate || 'Flexible'}\n` +
      `• Preferred Public Area: ${data.location || 'Ahmedabad'}\n` +
      `Please let me know once an available companion is matched!`
    );
    whatsappBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${waText}`;
  }
}

function renderCompanionFeedback(data) {
  const detailsBox = document.getElementById('companionFeedbackDetails');
  const whatsappBtn = document.getElementById('companionWhatsAppBtn');

  if (detailsBox) {
    const activitiesList = Array.isArray(data.comfortActivities) && data.comfortActivities.length > 0
      ? data.comfortActivities.join(', ')
      : 'General Public Outings';

    detailsBox.innerHTML = `
      <h4>Confirmed Application Details (Ref: ${escapeHtml(data.id)})</h4>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(data.name)}</li>
        <li><strong>City Area:</strong> ${escapeHtml(data.area)}</li>
        <li><strong>Comfort Activities:</strong> ${escapeHtml(activitiesList)}</li>
        <li><strong>Availability:</strong> ${escapeHtml(data.availability || 'Flexible')}</li>
        <li><strong>Contact:</strong> ${escapeHtml(data.contact)}</li>
      </ul>
      <p style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--color-slate);">
        Status: Securely registered for 18+ profile review and onboarding orientation.
      </p>
    `;
  }

  if (whatsappBtn) {
    const waText = encodeURIComponent(
      `Hello SaathScene! I just registered my 18+ Companion Application [${data.id}]:\n` +
      `• Name: ${data.name}\n` +
      `• Area: ${data.area}\n` +
      `I have confirmed age 18+ and wish to complete the safety onboarding orientation.`
    );
    whatsappBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${waText}`;
  }
}

// 4. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// 5. Dynamic Configuration Links
function initDynamicLinks() {
  // WhatsApp Floating Button & Header links
  const defaultWhatsAppText = encodeURIComponent(
    `Hello SaathScene! I am in Ahmedabad and would like to learn more about finding a social companion.`
  );
  const waUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${defaultWhatsAppText}`;

  document.querySelectorAll('.whatsapp-dynamic-link').forEach(el => {
    el.href = waUrl;
  });

  // Display WhatsApp Number
  document.querySelectorAll('.whatsapp-display-number').forEach(el => {
    el.textContent = CONFIG.WHATSAPP_DISPLAY;
  });

  // Email placeholders
  document.querySelectorAll('.email-dynamic-link').forEach(el => {
    el.href = `mailto:${CONFIG.CONTACT_EMAIL}`;
    el.textContent = CONFIG.CONTACT_EMAIL;
  });

  // Instagram links
  document.querySelectorAll('.instagram-dynamic-link').forEach(el => {
    el.href = CONFIG.INSTAGRAM_URL;
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
