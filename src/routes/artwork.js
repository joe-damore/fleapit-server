const express = require('express');
const router = express.Router();

const artworkController = require('../controllers/mediaArtworkController.js');

router.get('/', artworkController.index);

router.get('/:id', artworkController.findArtwork);
router.get('/:id/view', artworkController.viewArtwork);
// router.get('/:id/download', artworkController.downloadArtwork);

module.exports = router;
