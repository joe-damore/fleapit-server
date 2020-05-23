const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController.js');

router.get('/', userController.index);
router.post('/', userController.createUser);

router.get('/:id', userController.findUserById);
router.delete('/:id', userController.deleteUserById);
router.put('/:id', userController.updateUserById);

module.exports = router;
