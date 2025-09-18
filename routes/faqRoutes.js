const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// GET all FAQs
router.get('/', faqController.getFAQs);

// POST create FAQ
router.post('/', faqController.createFAQ);

// PUT update FAQ
router.put('/:id', faqController.updateFAQ);

// DELETE FAQ
router.delete('/:id', faqController.deleteFAQ);

module.exports = router;
