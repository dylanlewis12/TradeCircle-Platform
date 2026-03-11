// backend/scripts/seedDatabase.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Skill from '../models/Skills.js';
import Message from '../models/Message.js';
import Trade from '../models/Trades.js';
import RefreshToken from '../models/RefreshToken.js';
import sampleUsers from '../data/sampleUserData.js';
import sampleSkills from '../data/sampleSkillData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔧 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ✅ Uncomment to clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Trade.deleteMany({});
    await Message.deleteMany({});
    await RefreshToken.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Insert users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`✅ ${insertedUsers.length} users seeded`);

    // Insert skills
    const insertedSkills = await Skill.insertMany(sampleSkills);
    console.log(`✅ ${insertedSkills.length} skills seeded`);

    console.log('✅ Database seeded successfully!');

    await mongoose.connection.close();
    console.log('✅ Connection closed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();