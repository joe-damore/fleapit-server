const express = require('express');
const router = express.Router();

const mediaObjectController = require('../controllers/mediaObjectController.js');

router.get('/', mediaObjectController.index);
router.post('/', mediaObjectController.createMediaObject);

router.get('/:id', mediaObjectController.findMediaObjectById);
router.get('/:id/info', mediaObjectController.findMediaObjectInfoById);
// router.get('/:id/metadata', mediaObjectController.findMediaObjectMetadataById);

module.exports = router;
