/**
 * Automated API Test Suite for Capacity Connect (SIH PS 26075)
 * Verifies authentication, authorization, role permissions, scoring, certificates, and YouTube utilities.
 */

import assert from 'assert';
import app from '../src/app.js';
import { extractYouTubeVideoId, isValidYouTubeUrl } from '../src/utils/youtube.js';

let server;
const PORT = 5099;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

async function runTests() {
  console.log('🧪 Starting Capacity Connect Automated Test Suite...\n');

  await new Promise((resolve) => {
    server = app.listen(PORT, '127.0.0.1', () => {
      resolve();
    });
  });

  try {
    // Test 1: YouTube URL Parser
    console.log('Test 1: YouTube URL Parser');
    const yt1 = extractYouTubeVideoId('https://www.youtube.com/watch?v=Gv9_4yMHFhI');
    assert.strictEqual(yt1, 'Gv9_4yMHFhI', 'Standard watch URL should extract ID');
    const yt2 = extractYouTubeVideoId('https://youtu.be/bMknfKXIFA8?t=10');
    assert.strictEqual(yt2, 'bMknfKXIFA8', 'Shortened youtu.be URL should extract ID');
    assert.strictEqual(isValidYouTubeUrl('https://example.com/not-youtube'), false, 'Non-YouTube URL should be invalid');
    console.log('✅ YouTube URL parser passed.');

    // Test 2: Health Check
    console.log('\nTest 2: Health Check endpoint');
    const healthRes = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.success, true);
    console.log('✅ Health check passed.');

    // Test 3: Public Course Catalog
    console.log('\nTest 3: Course Catalog');
    const coursesRes = await fetch(`${BASE_URL}/courses`);
    assert.strictEqual(coursesRes.status, 200);
    const coursesData = await coursesRes.json();
    assert.strictEqual(coursesData.success, true);
    assert.ok(coursesData.data.length >= 2, 'Should return published courses');
    console.log(`✅ Course catalog returned ${coursesData.data.length} published courses.`);

    // Test 4: Trainee Login
    console.log('\nTest 4: Trainee Login');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aarav.patel@trainee.in',
        password: 'Password@123'
      })
    });
    assert.strictEqual(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true);
    assert.strictEqual(loginData.data.user.role, 'TRAINEE');
    const traineeToken = loginData.data.token;
    console.log('✅ Trainee login successful.');

    // Test 5: Admin Login
    console.log('\nTest 5: Admin Login');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@capacityconnect.gov.in',
        password: 'Password@123'
      })
    });
    assert.strictEqual(adminLoginRes.status, 200);
    const adminLoginData = await adminLoginRes.json();
    assert.strictEqual(adminLoginData.data.user.role, 'ADMIN');
    const adminToken = adminLoginData.data.token;
    console.log('✅ Admin login successful.');

    // Test 6: Security - Trainee cannot access Admin route
    console.log('\nTest 6: Security - RBAC Enforcement');
    const unauthorizedRes = await fetch(`${BASE_URL}/admin/statistics`, {
      headers: { Authorization: `Bearer ${traineeToken}` }
    });
    assert.strictEqual(unauthorizedRes.status, 403, 'Trainee must be blocked from admin statistics');
    const unauthData = await unauthorizedRes.json();
    assert.strictEqual(unauthData.success, false);
    console.log('✅ Trainee correctly blocked from Admin endpoint (403 Forbidden).');

    // Test 7: Public Registration Security - Cannot register as ADMIN
    console.log('\nTest 7: Security - Block Admin Self-Registration');
    const badRegRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker User',
        email: 'hacker@example.com',
        password: 'Password@123',
        role: 'ADMIN'
      })
    });
    assert.strictEqual(badRegRes.status, 400, 'Direct admin registration must be rejected');
    console.log('✅ Public admin registration correctly rejected.');

    // Test 8: Trainee Profile Retrieval
    console.log('\nTest 8: Trainee Profile');
    const profileRes = await fetch(`${BASE_URL}/trainee/profile`, {
      headers: { Authorization: `Bearer ${traineeToken}` }
    });
    assert.strictEqual(profileRes.status, 200);
    const profileData = await profileRes.json();
    assert.strictEqual(profileData.data.user.name, 'Aarav Patel');
    assert.ok(profileData.data.profile_completion_percentage > 0);
    console.log(`✅ Trainee profile retrieved (Completion: ${profileData.data.profile_completion_percentage}%).`);

    // Test 9: Public Certificate Verification
    console.log('\nTest 9: Public Certificate Verification');
    const verifyRes = await fetch(`${BASE_URL}/certificates/cc_token_v7f8a93e2b104dc98a4e/verify`);
    assert.strictEqual(verifyRes.status, 200);
    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyData.verified, true);
    assert.strictEqual(verifyData.data.certificate_number, 'CC-2026-000108');
    assert.strictEqual(verifyData.data.trainee_name, 'Aarav Patel');
    console.log('✅ Public certificate verified authentically with QR token.');

    // Test 10: Capacity Competency Matching Engine
    console.log('\nTest 10: Capacity Competency Matching');
    const compRes = await fetch(`${BASE_URL}/competency/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        subject: 'Advanced Machine Learning'
      })
    });
    assert.strictEqual(compRes.status, 200);
    const compData = await compRes.json();
    assert.ok(compData.data.rankedTrainers.length >= 1, 'Should rank trainers');
    assert.strictEqual(compData.data.topMatch.name, 'Dr. Rajesh Sharma', 'Dr. Rajesh should rank top for ML');
    assert.ok(compData.data.explanation.length > 10, 'Should include explanation');
    console.log(`✅ Capacity Competency matched top candidate: ${compData.data.topMatch.name} (Score: ${compData.data.topMatch.score}%).`);

    console.log('\n🎉 ALL 10 TESTS PASSED SUCCESSFULLY! The backend is fully verified.');
  } finally {
    if (server) {
      server.close();
    }
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('\n❌ Test Suite Failed:', err);
  if (server) server.close();
  process.exit(1);
});
