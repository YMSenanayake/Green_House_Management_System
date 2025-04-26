const express = require('express');
const router = express.Router();
const {
    addFinance,
    getAllFinance,
    updateFinance,
    deleteFinance,
    getReport,
    getFinanceById // Added method to get finance by ID
} = require('../controller/financial/financeController');

router.post('/', addFinance);
router.get('/', getAllFinance);
router.get('/:id', getFinanceById); // Added route for finding by ID
router.put('/:id', updateFinance);
router.delete('/:id', deleteFinance);
router.get('/report', getReport);

module.exports = router;
