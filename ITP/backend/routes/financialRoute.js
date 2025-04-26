const express = require('express');
const router = express.Router();
const {
    addFinance,
    getAllFinance,
    updateFinance,
    deleteFinance,
    getReport
} = require('../controller/financial/financeController');

router.post('/', addFinance);
router.get('/', getAllFinance);
router.put('/:id', updateFinance);
router.delete('/:id', deleteFinance);
router.get('/report', getReport);

module.exports = router;
