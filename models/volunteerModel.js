const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  skills: { type: [String], required: true },
  causes: { type: [String], required: true },
  availability: { type: String, required: true },
  experience: { type: String, required: false },
  motivation: { type: String, required: true },
  idProof: { type: String, required: false }, 
});

module.exports = mongoose.model('volunteerModel', volunteerSchema);
