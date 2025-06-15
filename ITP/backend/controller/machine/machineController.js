// controller/machine/machineController.js

const Machine = require('../../models/machineModel/machinesModel');

// Add a new machine
const addMachine = async (req, res) => {
    try {
        const newMachine = new Machine(req.body);
        await newMachine.save();
        res.status(201).json({ message: 'Machine added successfully', machine: newMachine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add machine', error });
    }
};

// Get all machines
const getAllMachines = async (req, res) => {
    try {
        const machines = await Machine.find();
        res.status(200).json(machines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve machines', error });
    }
};

// Get a specific machine
const getMachine = async (req, res) => {
    try {
        const { id } = req.params;
        const machine = await Machine.findById(id);
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found' });
        }
        res.status(200).json(machine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve machine', error });
    }
};

// Update a machine
const updateMachine = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMachine = await Machine.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMachine) {
            return res.status(404).json({ message: 'Machine not found' });
        }
        res.status(200).json({ message: 'Machine updated successfully', machine: updatedMachine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update machine', error });
    }
};

// Delete a machine
const deleteMachine = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMachine = await Machine.findByIdAndDelete(id);
        if (!deletedMachine) {
            return res.status(404).json({ message: 'Machine not found' });
        }
        res.status(200).json({ message: 'Machine deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete machine', error });
    }
};

// Get machines due for repair
const getMachinesDueForRepair = async (req, res) => {
    try {
        // Assuming you have a field 'dueForRepair' in your model
        const machinesDueForRepair = await Machine.find({ dueForRepair: true });
        res.status(200).json(machinesDueForRepair);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve machines due for repair', error });
    }
};

module.exports = {
    getAllMachines,
    addMachine,
    getMachine,
    updateMachine,
    deleteMachine,
    getMachinesDueForRepair
};
