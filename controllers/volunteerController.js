const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const volunteerController = {
  // ========================
  // Volunteer self-service routes
  // ========================

  registerVolunteer: async (req, res) => {
  try {
    console.log("====== 📥 New Volunteer Registration Request ======");
    console.log("➡ Raw body:", req.body);
    console.log("➡ Uploaded file:", req.file);

    const {
      name,
      email,
      phone,
      location,
      availability,
      experience,
      motivation,
      password,
      idProofType // ✅ new field from frontend
    } = req.body;

    // Parse arrays sent as JSON strings
    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    const causes = req.body.causes ? JSON.parse(req.body.causes) : [];

    console.log("➡ Parsed skills:", skills);
    console.log("➡ Parsed causes:", causes);

    // Required field validation
    if (!name || !email || !phone || skills.length === 0 || causes.length === 0 || !availability || !motivation || !location) {
      return res.status(400).json({ status: "fail", message: "All required fields must be provided" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠ Duplicate email attempt:", email);
      return res.status(400).json({ status: "fail", message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      role: "volunteer",
      password: hashedPassword
    });

    console.log("✅ User created:", user._id);

    // Handle optional file
    let idProof = null;
    if (req.file) {
      idProof = {
        url: req.file.path || req.file.secure_url,
        publicId: req.file.filename || req.file.public_id,
        docType: idProofType || "aadhaar", // ✅ must be from enum
        mimeType: req.file.mimetype
      };
    }
    console.log("➡ Final idProof object:", idProof);

    // Create volunteer record
    const volunteer = await Volunteer.create({
      userId: user._id,
      skills,
      causesOfInterest: causes,
      location,
      availability,
      experience,
      motivation,
      status: "pending_review",
      ...(idProof && { idProof })
    });

    res.status(201).json({
      status: "success",
      message: "Volunteer registered successfully",
      data: { volunteer }
    });

  } catch (error) {
    console.error("❌ registerVolunteer error message:", error.message);
    console.error("❌ registerVolunteer error stack:", error.stack);
    res.status(500).json({ status: "error", message: error.message });
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
      console.error("❌ getVolunteerProfile error:", error);
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
            updates['causesOfInterest'] = req.body[field];
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
      console.error("❌ updateVolunteerProfile error:", error);
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
      console.error("❌ getVolunteerDashboard error:", error);
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
      console.error("❌ getLeaderboard error:", error);
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
      console.error("❌ getAllVolunteers error:", error);
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

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        name,
        email,
        phone,
        role: 'volunteer',
        password: hashedPassword
      });

      const volunteer = await Volunteer.create({
        userId: user._id,
        skills: skills && skills.length ? skills : ['General'],
        causesOfInterest: causes && causes.length ? causes : ['General'],
        location: location || 'Not Provided',
        availability: availability || 'flexible',
        motivation: motivation || 'N/A',
        status: 'approved'
      });

      res.status(201).json({
        status: 'success',
        message: 'Volunteer added successfully',
        data: { volunteer }
      });
    } catch (error) {
      console.error("❌ addNewVolunteer error:", error);
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

      volunteer.status = volunteer.status === 'approved' ? 'inactive' : 'approved';
      await volunteer.save();

      res.status(200).json({
        status: 'success',
        message: `Volunteer is now ${volunteer.status}`,
        data: { volunteer }
      });
    } catch (error) {
      console.error("❌ toggleVolunteerStatus error:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = volunteerController;
