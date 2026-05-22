const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedHR = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if HR already exists
    const hrExists = await User.findOne({ role: 'HR' });
    if (hrExists) {
      console.log('An HR user already exists in the database. You can log in with that account.');
      process.exit();
    }

    const hrUser = await User.create({
      name: 'Head of HR',
      email: 'admin@company.com',
      password: 'adminpassword123',
      role: 'HR',
      department: 'HR'
    });

    console.log('\n✅ Successfully created the initial HR user!');
    console.log('--------------------------------------------------');
    console.log(`Email:    ${hrUser.email}`);
    console.log(`Password: adminpassword123`);
    console.log('--------------------------------------------------');
    console.log('Please log in using these credentials and change the password later.');
    process.exit();
  } catch (error) {
    console.error('Error seeding HR user:', error);
    process.exit(1);
  }
};

seedHR();
