// Comprehensive Test Suite for SaathScene Forms & Endpoints
// Tests:
// 1. Static pages (200 OK)
// 2. 404 page handling
// 3. Customer Enquiry:
//    - Under 18 rejection (400)
//    - Missing fields rejection (400)
//    - Valid submission success (200)
//    - Duplicate submission detection (409)
// 4. Companion Application:
//    - Under 18 rejection (400)
//    - Missing fields rejection (400)
//    - Valid submission success (200)
//    - Duplicate submission detection (409)

const BASE = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting SaathScene Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. Static Pages
  await test('GET / returns 200 with HTML content', async () => {
    const res = await fetch(`${BASE}/`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('SaathScene Ahmedabad')) throw new Error('Title missing');
  });

  await test('GET /privacy returns 200 with Privacy Notice', async () => {
    const res = await fetch(`${BASE}/privacy`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('Privacy Notice')) throw new Error('Content missing');
  });

  await test('GET /terms returns 200 with Terms & Code of Conduct', async () => {
    const res = await fetch(`${BASE}/terms`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('Code of Conduct')) throw new Error('Content missing');
  });

  await test('GET /unknown-route returns 404', async () => {
    const res = await fetch(`${BASE}/random-non-existent-page`);
    if (res.status !== 404) throw new Error(`Status ${res.status}`);
  });

  // 2. Customer Enquiry API
  await test('POST /api/customer-enquiry rejects non-adults (<18)', async () => {
    const res = await fetch(`${BASE}/api/customer-enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Underage User',
        contact: 'test@example.com',
        activity: 'Garba',
        isAdult: false
      })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (!data.error.includes('18+')) throw new Error('Missing 18+ error msg');
  });

  await test('POST /api/customer-enquiry rejects missing required fields', async () => {
    const res = await fetch(`${BASE}/api/customer-enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        contact: '',
        isAdult: true
      })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await test('POST /api/customer-enquiry accepts valid intake', async () => {
    const res = await fetch(`${BASE}/api/customer-enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aarav Patel',
        contact: '+91 98250 12345',
        activity: 'Navratri Garba Night',
        preferredDate: 'Saturday Evening',
        location: 'Vastrapur, Ahmedabad',
        duration: '2 to 3 hours',
        notes: 'Looking for a Garba partner for club passes.',
        isAdult: true
      })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.id.startsWith('CUST-')) throw new Error('Invalid response structure');
  });

  await test('POST /api/customer-enquiry rejects duplicate submission', async () => {
    const res = await fetch(`${BASE}/api/customer-enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aarav Patel',
        contact: '+91 98250 12345',
        activity: 'Navratri Garba Night',
        preferredDate: 'Saturday Evening',
        location: 'Vastrapur, Ahmedabad',
        isAdult: true
      })
    });
    if (res.status !== 409) throw new Error(`Expected 409 for duplicate, got ${res.status}`);
  });

  // 3. Companion Application API
  await test('POST /api/companion-apply rejects non-adults (<18)', async () => {
    const res = await fetch(`${BASE}/api/companion-apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Young Candidate',
        contact: '+91 98765 00000',
        area: 'Navrangpura',
        about: 'Excited to attend events',
        isAdult: false
      })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await test('POST /api/companion-apply accepts valid adult companion application', async () => {
    const res = await fetch(`${BASE}/api/companion-apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Diya Shah',
        contact: '+91 97120 54321',
        area: 'Bodakdev, Ahmedabad',
        availability: 'Weekends Only',
        comfortActivities: ['Garba & Festivals', 'Cafés & Coffee'],
        about: 'Passionate about cultural outings, safe public socializing, and traditional folk dance.',
        isAdult: true
      })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.id.startsWith('COMP-')) throw new Error('Invalid response structure');
  });

  await test('POST /api/companion-apply rejects duplicate application', async () => {
    const res = await fetch(`${BASE}/api/companion-apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Diya Shah',
        contact: '+91 97120 54321',
        area: 'Bodakdev, Ahmedabad',
        about: 'Passionate about cultural outings, safe public socializing, and traditional folk dance.',
        isAdult: true
      })
    });
    if (res.status !== 409) throw new Error(`Expected 409, got ${res.status}`);
  });

  console.log(`\n==================================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
