const express = require('express');
const router = express.Router();
// We import the specific functions from our controller
const { registerTenant, loginUser, addStaff } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerTenant);
router.post('/login', loginUser);

// Protected: Only a logged-in Admin can add staff
// Changed 'registerTenantController.addStaff' to just 'addStaff'
router.post('/add-staff', auth, addStaff); 

module.exports = router;