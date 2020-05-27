const express = require('express');
const router = express.Router();

const mediaController = require('../controllers/mediaController.js');

router.get('/', mediaController.index);
router.post('/', mediaController.createMedia);

router.get('/:id', mediaController.findMedia);
router.delete('/:id', mediaController.deleteMedia);
// TODO Delete "ext" route
// router.get('/:id/ext', mediaController.findMediaExtended);
router.get('/:id/view', mediaController.viewMedia);
// router.get('/:id/view', mediaController.viewMedia);
// router.get('/:id/download', mediaController.downloadMedia);

router.get('/:id/metadata', mediaController.findMediaMetadata);
router.post('/:id/metadata', mediaController.updateMediaMetadata);
// router.delete('/:id/metadata', mediaController.deleteMediaMetadata);
// TO DELETE router.post('/:id/metadata', mediaController.replaceMediaMetadata);

router.get('/:id/artwork', mediaController.findMediaArtwork);
router.post('/:id/artwork', mediaController.createMediaArtwork);
//router.delete('/:id/artwork', mediaController.deleteMediaArtwork);

//router.put('/:id/artwork', mediaController.replaceMediaArtwork);

module.exports = router;
