const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const volunteerController = {
  // ========================
  // Volunteer self-service routes
  // ========================

  // Register as volunteer (self-service)
  registerVolunteer: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        location,
        availability,
        experience,
        motivation,
        password
      } = req.body;

      // Parse arrays sent as JSON strings
      const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
      const causes = req.body.causes ? JSON.parse(req.body.causes) : [];

      // Required field validation
      if (!name || !email || !phone || skills.length === 0 || causes.length === 0 || !availability || !motivation || !location) {
        return res.status(400).json({ status: 'fail', message: 'All required fields must be provided' });
      }

      // Create user (no password required yet)
      const user = await User.create({
        name,
        email,
        phone,
        role: 'volunteer',
        password 
      });

      // Handle optional file
      let idProof = null;
      if (req.file) {
        idProof = {
          url: `/uploads/${req.file.filename}`, // adjust according to your storage
          type: req.file.mimetype
        };
      }

      // Create volunteer record
      const volunteer = await Volunteer.create({
        userId: user._id,
        skills,
        causesOfInterest: causes,
        location,
        availability,
        experience,
        motivation,
        status: 'pending_review',
        ...(idProof && { idProof }) // include only if file exists
      });

      res.status(201).json({
        status: 'success',
        message: 'Volunteer registered successfully',
        data: { volunteer }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Get volunteer profile
  getVolunteerProfile: async (req, res) => {
    try {
      const volunteer = await Volunteer.findById(req.params.id)
        .populate('user', 'name email phone')
        .lean();

      if (!volunteer) {
        return res.status(404).json({ status: 'fail', message: 'Volunteer not found' });
      }

      res.status(200).json({ status: 'success', data: { volunteer } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Update volunteer profile (self-service)
  updateVolunteerProfile: async (req, res) => {
    try {
      const allowedFields = ['skills', 'causes', 'causesOfInterest', 'availability', 'experience', 'motivation', 'location'];
      const updates = {};

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          if (field === 'causes') {
            updates['causesOfInterest'] = req.body[field]; // map causes → causesOfInterest
          } else {
            updates[field] = req.body[field];
          }
        }
      });

      const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!volunteer) {
        return res.status(404).json({ status: 'fail', message: 'Volunteer not found' });
      }

      res.status(200).json({
        status: 'success',
        message: 'Volunteer profile updated successfully',
        data: { volunteer }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Get volunteer dashboard data
  getVolunteerDashboard: async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        data: {
          stats: {
            totalContributions: 15,
            totalPoints: 1250,
            totalBadges: 3,
            currentRank: 47,
            thisMonthHours: 12,
            thisMonthPeople: 3
          },
          recentContributions: [],
          upcomingOpportunities: [],
          badges: ['First Help', 'Education Champion', 'Community Leader']
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Get volunteer leaderboard
  getLeaderboard: async (req, res) => {
    try {
      const topVolunteers = await Volunteer.find()
        .sort({ points: -1 })
        .limit(10)
        .populate('user', 'name')
        .lean();

      const leaderboard = topVolunteers.map((v, index) => ({
        id: v._id,
        name: v.user?.name || 'Unknown',
        points: v.points,
        rank: index + 1
      }));

      res.status(200).json({ status: 'success', data: { leaderboard } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // ========================
  // Core Admin routes
  // ========================

  // Get all volunteers
  getAllVolunteers: async (req, res) => {
    try {
      const volunteers = await Volunteer.find()
        .populate('user', 'name email phone')
        .lean();

      res.status(200).json({
        status: 'success',
        results: volunteers.length,
        data: { volunteers }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Add a new volunteer (admin)
  addNewVolunteer: async (req, res) => {
    try {
      const { name, email, phone, password, skills, causes, availability, motivation, location } = req.body;

      if (!name || !email || !phone || !password) {
        return res.status(400).json({ status: 'fail', message: 'Name, email, phone and password are required' });
      }

      const user = await User.create({
        name,
        email,
        phone,
        role: 'volunteer',
        password
      });

      const volunteer = await Volunteer.create({
        userId: user._id,
        skills: skills && skills.length ? skills : ['General'],
        causesOfInterest: causes && causes.length ? causes : ['General'],
        location: location || 'Not Provided',
        availability: availability || 'flexible',
        motivation: motivation || 'N/A',
        status: 'approved'  // admin-created volunteers are automatically approved
      });

      res.status(201).json({
        status: 'success',
        message: 'Volunteer added successfully',
        data: { volunteer }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Activate/Deactivate volunteer
  toggleVolunteerStatus: async (req, res) => {
    try {
      const volunteer = await Volunteer.findById(req.params.id);
      if (!volunteer) {
        return res.status(404).json({ status: 'fail', message: 'Volunteer not found' });
      }

      volunteer.isActive = !volunteer.isActive;
      await volunteer.save();

      res.status(200).json({
        status: 'success',
        message: `Volunteer is now ${volunteer.status.isActive ? 'active' : 'inactive'}`,
        data: { volunteer }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  
  // Approve or reject volunteer
updateVolunteerStatus: async (req, res) => {
  try {
    const { status } = req.body; // expected 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid status value' });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({ status: 'fail', message: 'Volunteer not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `Volunteer status updated to ${status}`,
      data: { volunteer }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
 }
};


module.exports = volunteerController;
