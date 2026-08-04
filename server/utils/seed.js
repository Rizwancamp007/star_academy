const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('../models/User')
const MCQ = require('../models/MCQ')
const Test = require('../models/Test')
const Lecture = require('../models/Lecture')

dotenv.config()

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/star_educational_academy'
    await mongoose.connect(connStr)
    console.log('✅ Connected to MongoDB...')

    // Purge all collections
    await User.deleteMany({})
    await MCQ.deleteMany({})
    await Test.deleteMany({})
    await Lecture.deleteMany({})

    // Purge any submissions or extra collections if models exist
    try {
      const db = mongoose.connection.db
      const collections = await db.listCollections().toArray()
      for (const col of collections) {
        await db.collection(col.name).deleteMany({})
      }
    } catch (e) {
      console.log('Collections cleared.')
    }

    console.log('🧹 Database completely purged.')

    // Create Single Super Admin Account
    const adminUser = await User.create({
      fullName: 'Rizwan Khan',
      email: 'khan@star.com',
      password: 'Rkhan007',
      role: 'admin',
      isApproved: true,
      phone: '03000000000',
    })

    console.log('👑 Admin account created successfully:')
    console.log(`   Name:     ${adminUser.fullName}`)
    console.log(`   Email:    ${adminUser.email}`)
    console.log(`   Password: Rkhan007`)
    console.log(`   Role:     ${adminUser.role}`)

    console.log('🎉 Star Educational Academy database reset complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Reset error:', error)
    process.exit(1)
  }
}

seedData()
