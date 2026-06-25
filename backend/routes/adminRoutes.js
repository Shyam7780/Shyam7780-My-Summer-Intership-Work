const express = require('express');
const router = express.Router();

// Fixed Admin Login (as per requirement)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@chhotanram.com' && password === 'admin123') {
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { email: 'admin@chhotanram.com', role: 'admin' }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
