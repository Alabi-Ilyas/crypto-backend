const FAQ = require('../models/Faq');

// Get all FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = new FAQ({ question, answer });
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json(faq);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
