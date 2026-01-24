// Create a test user for login testing
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createTestUser() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/donation_app');
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ username: 'testuser' });
    if (existingUser) {
      console.log('Test user already exists:');
      console.log('Username: testuser');
      console.log('Password: password123');
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = new User({
      fullname: 'Test User',
      username: 'testuser',
      password: hashedPassword,
      phone: '1234567890',
      address: 'Test Address, Test City'
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('Username: testuser');
    console.log('Password: password123');
    console.log('You can now use these credentials to log in.');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

createTestUser();
