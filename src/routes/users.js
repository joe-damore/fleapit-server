const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController.js');

router.get('/', userController.index);
router.post('/', userController.createUser);

router.get('/:id', userController.findUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser);
//router.patch('/:id', userController.updateUserById);

module.exports = router;
