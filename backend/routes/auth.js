const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  register,
  login,
  logout,
  logoutAll,
  getCurrentUser,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');


router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);
router.post('/logout', authenticateToken, logout);
router.post('/logout-all', authenticateToken, logoutAll);

module.exports = router;
