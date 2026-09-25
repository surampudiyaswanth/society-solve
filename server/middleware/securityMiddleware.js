// Security Headers Middleware
export const securityHeaders = (req, res, next) => {
  // Prevent browsers from MIME-sniffing a response away from the declared content-type
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Mitigate clickjacking attacks by allowing framing only on same origin
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Cross-site scripting (XSS) filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control how much referrer information should be included with requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Disable powered-by header for information hiding
  res.removeHeader('X-Powered-By');

  next();
};

// In-Memory Rate Limiter for Sensitive Routes (e.g., /api/auth)
// Beginner-friendly, zero external dependencies, robust and safe
const rateLimitMap = new Map();

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes
  maxRequests = 50,          // Max 50 attempts per IP per window
  message = 'Too many requests from this IP. Please try again later in 15 minutes.',
}) => {
  return (req, res, next) => {
    // In local or test environments, client IP is extracted from headers or connection
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    // If window expired, reset counter
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    record.count += 1;

    // Check if limit exceeded
    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
};

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 60,          // generous for demo testing
  message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
});
