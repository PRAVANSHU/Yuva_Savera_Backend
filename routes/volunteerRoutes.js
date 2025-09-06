const express = require('express')
const {registerVolunteer} = require('../controllers/volunteerController.js')
const { uploadFile } = require('../middleware/uploadMiddleware');

const router = express.Router()

router.post('/register',  uploadFile.single('idProof'), registerVolunteer);

module.exports = router;