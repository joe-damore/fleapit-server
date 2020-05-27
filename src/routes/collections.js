const express = require('express');
const router = express.Router();

const collectionController = require('../controllers/collectionController.js');

router.get('/', collectionController.index);
router.post('/', collectionController.createCollection);

// TODO Delete indexTop Level
//router.get('/top', collectionController.indexTopLevel);

router.get('/:id', collectionController.findCollectionById);
router.get('/:id/items', collectionController.findCollectionItemsById);

module.exports = router;
