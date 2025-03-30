// routes/machineRoute.js
const express = require('express');
const router = express.Router();

// Import the machine controller functions
const {
    getAllMachines,
    addMachine,
    getMachine,
    updateMachine,
    deleteMachine,
    getMachinesDueForRepair
} = require('../../backend/controller/machine/machineController');

// Define the routes
router.get('/getallmachines', getAllMachines);
router.post('/add', addMachine);
router.get('/due-for-repair', getMachinesDueForRepair);

router.route('/:id')
  .get(getMachine)
  .put(updateMachine)
  .delete(deleteMachine);

module.exports = router;
