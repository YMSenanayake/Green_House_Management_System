const Finance = require('../../models/financialModel/Finance');

// Create
exports.addFinance = async (req, res) => {
    try {
        const newEntry = new Finance(req.body);
        const saved = await newEntry.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Read All with optional search
exports.getAllFinance = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { category: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ]
            };
        }

        const data = await Finance.find(query).sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update
exports.updateFinance = async (req, res) => {
    try {
        const updated = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete
exports.deleteFinance = async (req, res) => {
    try {
        await Finance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Report (grouped by category)
exports.getReport = async (req, res) => {
    try {
        const income = await Finance.aggregate([
            { $match: { type: 'income' } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);

        const expense = await Finance.aggregate([
            { $match: { type: 'expense' } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);

        res.json({ income, expense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
