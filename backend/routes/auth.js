const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/authController');
const upload = require('../middleware/upload'); 

router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);

module.exports = router;
