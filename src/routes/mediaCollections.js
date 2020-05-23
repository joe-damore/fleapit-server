const express = require('express');
const router = express.Router();

const mediaCollectionController = require('../controllers/mediaCollectionController.js');

router.get('/', mediaCollectionController.index);
router.post('/', mediaCollectionController.createMediaCollection);

router.get('/top', mediaCollectionController.indexTopLevel);

router.get('/:id', mediaCollectionController.findMediaCollectionById);
router.get('/:id/items', mediaCollectionController.findMediaCollectionItemsById);

module.exports = router;
