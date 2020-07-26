const express = require('express');
const router = express.Router();

const mediaController = require('../controllers/mediaController.js');

router.get('/', mediaController.index);
router.post('/', mediaController.createMedia);

router.get('/:id', mediaController.findMedia);
router.delete('/:id', mediaController.deleteMedia);

router.get('/:id/view', mediaController.viewMedia);
router.get('/:id/download', mediaController.downloadMedia);

router.get('/:id/metadata', mediaController.findMediaMetadata);
router.post('/:id/metadata', mediaController.upsertMediaMetadata);
router.patch('/:id/metadata', mediaController.patchMediaMetadata);

router.get('/:id/artwork', mediaController.findMediaArtwork);
router.post('/:id/artwork', mediaController.createMediaArtwork);
//router.delete('/:id/artwork', mediaController.deleteMediaArtwork);

//router.put('/:id/artwork', mediaController.replaceMediaArtwork);

module.exports = router;
