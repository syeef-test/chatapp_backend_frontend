const express = require('express');

const auth = require('../middleware/auth');

const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/addchat',auth.authenticate,chatController.addChat);
router.post('/getchat/:lastmsgId',auth.authenticate,chatController.getChat);





module.exports = router;