require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB connected'))
  .catch(err => console.log('DB connection error:', err));

const seedCoreAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'core_admin' });
    if (existingAdmin) {
      console.log('Core Admin already exists');
      process.exit();
    }

    const admin = await User.create({
      name: 'Core Admin',
      email: 'coreadmin@example.com',
      phone: '+911234567890',
      password: 'B@ngalore@dmin25', 
      role: 'core_admin',
      isVerified: true
    });

    console.log('Core Admin created:', admin);
    process.exit();
  } catch (err) {
    console.log('Error creating Core Admin:', err);
    process.exit(1);
  }
};

seedCoreAdmin();
