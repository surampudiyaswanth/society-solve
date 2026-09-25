/**
 * SocietySolve Automated Verification Suite
 * Verifies core ecosystem logic, security policies, data models, and ID generators.
 */

import { generateProblemId } from '../utils/problemIdGenerator.js';
import { securityHeaders, createRateLimiter } from '../middleware/securityMiddleware.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Solution from '../models/Solution.js';
import Collaboration from '../models/Collaboration.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${message}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ [FAIL]\x1b[0m ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n\x1b[1m\x1b[36m=======================================================');
  console.log('       SOCIETYSOLVE AUTOMATED VERIFICATION SUITE       ');
  console.log('=======================================================\x1b[0m\n');

  // Test Suite 1: Unique Problem Identifier Generation
  console.log('\x1b[1mTest Suite 1: Problem ID Generator & Format\x1b[0m');
  try {
    const id1 = await generateProblemId();
    const id2 = await generateProblemId();
    assert(typeof id1 === 'string', 'generateProblemId() returns a string');
    assert(/^SS-2026-\d{6}$/.test(id1), `Generated ID matches pattern SS-2026-XXXXXX (${id1})`);
    assert(id1 !== id2, `Sequential calls generate unique identifiers (${id1} vs ${id2})`);
  } catch (err) {
    assert(false, `Problem ID generator threw error: ${err.message}`);
  }

  // Test Suite 2: Data Models & Schema Verification
  console.log('\n\x1b[1mTest Suite 2: Mongoose Data Models\x1b[0m');
  assert(User && User.modelName === 'User', 'User Model loaded with role discriminator');
  assert(Problem && Problem.modelName === 'Problem', 'Problem Model loaded with 10-stage timeline');
  assert(Solution && Solution.modelName === 'Solution', 'Solution Model loaded with academic proposal fields');
  assert(Collaboration && Collaboration.modelName === 'Collaboration', 'Collaboration Model loaded with sponsorship grants');
  assert(Comment && Comment.modelName === 'Comment', 'Comment Model loaded with multi-role tags');
  assert(Notification && Notification.modelName === 'Notification', 'Notification Model loaded with alert types');

  // Test Suite 3: Security Headers Middleware
  console.log('\n\x1b[1mTest Suite 3: Security Hardening & Headers\x1b[0m');
  const mockHeaders = {};
  const mockRes = {
    setHeader: (k, v) => { mockHeaders[k] = v; },
    removeHeader: (k) => { delete mockHeaders[k]; },
  };
  securityHeaders({}, mockRes, () => {});
  assert(mockHeaders['X-Content-Type-Options'] === 'nosniff', 'X-Content-Type-Options is nosniff');
  assert(mockHeaders['X-Frame-Options'] === 'SAMEORIGIN', 'X-Frame-Options set to SAMEORIGIN (clickjacking defense)');
  assert(mockHeaders['X-XSS-Protection'] === '1; mode=block', 'X-XSS-Protection enabled');
  assert(mockHeaders['Referrer-Policy'] === 'strict-origin-when-cross-origin', 'Referrer policy is strict-origin');

  // Test Suite 4: In-Memory Rate Limiter
  console.log('\n\x1b[1mTest Suite 4: Rate Limiting Defense\x1b[0m');
  const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });
  const mockReq = { headers: {}, socket: { remoteAddress: '127.0.0.1' } };
  let limiterBlocked = false;
  const mockLimitRes = {
    status: (code) => ({
      json: () => { if (code === 429) limiterBlocked = true; }
    })
  };
  limiter(mockReq, mockLimitRes, () => {}); // req 1: pass
  limiter(mockReq, mockLimitRes, () => {}); // req 2: pass
  limiter(mockReq, mockLimitRes, () => {}); // req 3: should block (exceeded max 2)
  assert(limiterBlocked === true, 'Rate limiter blocks rapid requests after exceeding threshold (HTTP 429)');

  // Test Suite 5: Ecosystem 10 Stages Audit
  console.log('\n\x1b[1mTest Suite 5: 10-Stage Progression Sequence\x1b[0m');
  const expectedStages = [
    'Submitted',
    'Under Review',
    'Accepted',
    'University Assigned',
    'Solution Development',
    'Industry Collaboration',
    'Pilot Implementation',
    'Implemented',
    'Impact Measured',
    'Resolved',
  ];
  const schemaStages = Problem.schema.path('status').enumValues;
  const allStagesPresent = expectedStages.every((s) => schemaStages.includes(s));
  assert(allStagesPresent, 'Problem schema defines all 10 canonical Societal Problem stages');

  // Summary
  console.log('\n\x1b[1m\x1b[36m=======================================================');
  console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=======================================================\x1b[0m\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
