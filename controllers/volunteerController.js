const volunteerModel = require('../models/volunteerModel');

const registerVolunteer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      skills,
      causes,
      availability,
      experience,
      motivation
    } = req.body;

    const parsedSkills = JSON.parse(skills);
    const parsedCauses = JSON.parse(causes);

    const newVolunteer = new volunteerModel({
      name,
      email,
      phone,
      location,
      skills: parsedSkills,
      causes: parsedCauses,
      availability,
      experience,
      motivation,
      idProof:  req.file?.path || null, 
    });

    console.log('New Volunteer:', newVolunteer);

    await newVolunteer.save();

    res.status(201).json({ success: true, message: 'Volunteer registered successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {registerVolunteer};
