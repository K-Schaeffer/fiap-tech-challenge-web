const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const crypto = require('crypto');
const port = 5000;

// Encryption key - in a real app this would be in env vars
const ENCRYPTION_KEY = 'your-secret-key-32-chars-long!!';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Add custom auth route
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  const user = db.get('user').value();

  if (email === user.email && password === user.password) {
    // Generate encrypted user identifier
    // Create a simple token (in real app use JWT)
    const token = crypto.randomBytes(64).toString('hex');

    res.jsonp({
      token,
    });
  } else {
    res.status(401).jsonp({ error: 'Invalid credentials' });
  }
});

// Protect other routes
server.use((req, res, next) => {
  if (req.path === '/auth/login') return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).jsonp({ error: 'Authentication required' });
  }

  next();
});

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
