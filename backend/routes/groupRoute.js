const express = require('express');

const auth = require('../middleware/auth');
const groupController = require('../controllers/groupController');

const router = express.Router();


router.post('/create_group',auth.authenticate,groupController.createGroup);
router.get('/get_group',auth.authenticate,groupController.getGroup);
router.get('/get_group_for_dropdown',auth.authenticate,groupController.getGroupForDropdown);
router.post('/add_participent',auth.authenticate,groupController.addParticipent);




module.exports = router;