export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Fixed admin credentials as per requirement
    if (email === 'admin@chhotanram.com' && password === 'admin123') {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { email: 'admin@chhotanram.com', role: 'admin' }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}