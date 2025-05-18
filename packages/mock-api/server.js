const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const crypto = require('crypto');
const port = 5000;

// Secure configuration
const config = {
  // In production these would come from environment variables
  secret: process.env.APP_SECRET || crypto.randomBytes(32).toString('hex'),
  tokenExpiration: 3600000,
  maxLoginAttempts: 5,
  lockoutDuration: 900000,
  keyIterations: 100000,
  keyLength: 32,
  saltLength: 16,
};

// Store for rate limiting (in production, use Redis or similar)
const loginAttempts = new Map();

// Key derivation function
function deriveKey(secret, salt) {
  return crypto.pbkdf2Sync(
    secret,
    salt,
    config.keyIterations,
    config.keyLength,
    'sha512'
  );
}

// Generate cryptographically secure random bytes
function generateSecureBytes(length) {
  return crypto.randomBytes(length);
}

function encrypt(text) {
  const iv = generateSecureBytes(16); // 16 bytes for AES
  const salt = generateSecureBytes(config.saltLength);
  const key = deriveKey(config.secret, salt);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Format: salt:iv:authTag:encrypted
  return {
    token: `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`,
    expiresAt: Date.now() + config.tokenExpiration,
  };
}

function decrypt(token) {
  try {
    const [saltHex, ivHex, authTagHex, encrypted] = token.split(':');

    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = deriveKey(config.secret, salt);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (err) {
    return null;
  }
}

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    exp: Date.now() + config.tokenExpiration,
    jti: crypto.randomBytes(16).toString('hex'),
    iat: Date.now(),
  };

  return encrypt(JSON.stringify(payload));
}

function verifyToken(encryptedToken) {
  const decrypted = decrypt(encryptedToken);
  if (!decrypted) return null;

  // Check expiration
  if (Date.now() > decrypted.exp) {
    return null;
  }

  return decrypted;
}

// Rate limiting middleware
function rateLimit(ip) {
  const attempts = loginAttempts.get(ip) || {
    count: 0,
    firstAttempt: Date.now(),
  };

  // Reset attempts if lockout duration has passed
  if (Date.now() - attempts.firstAttempt > config.lockoutDuration) {
    attempts.count = 0;
    attempts.firstAttempt = Date.now();
  }

  if (attempts.count >= config.maxLoginAttempts) {
    const timeLeft =
      (config.lockoutDuration - (Date.now() - attempts.firstAttempt)) / 1000;
    return {
      allowed: false,
      timeLeft: Math.ceil(timeLeft),
    };
  }

  attempts.count++;
  loginAttempts.set(ip, attempts);

  return { allowed: true };
}

// Cleanup old rate limiting entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of loginAttempts.entries()) {
    if (now - data.firstAttempt > config.lockoutDuration) {
      loginAttempts.delete(ip);
    }
  }
}, config.lockoutDuration);

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/auth/login', (req, res) => {
  const ip = req.ip;
  const rateCheck = rateLimit(ip);

  if (!rateCheck.allowed) {
    return res.status(429).jsonp({
      error: `Too many login attempts. Try again in ${rateCheck.timeLeft} seconds`,
    });
  }

  const { email, password } = req.body;
  const db = router.db;
  const user = db.get('user').value();

  if (email === user.email && password === user.password) {
    const { token, expiresAt } = generateToken(user);

    res.jsonp({
      token,
      expiresAt,
    });
  } else {
    res.status(401).jsonp({ error: 'Invalid credentials' });
  }
});

server.use((req, res, next) => {
  if (req.path === '/auth/login') return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).jsonp({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).jsonp({ error: 'Invalid or expired token' });
  }

  next();
});

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
