const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

//GET ALL CLIENTS
router.get('/', clientController.getClients);

//UPDATE
router.put('/:id', clientController.updateClient);

//DELETE
router.delete('/:id', clientController.deleteClient);

module.exports = router;